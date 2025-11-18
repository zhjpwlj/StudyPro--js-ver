import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: ((this: SpeechRecognition, ev: any) => any) | null;
    onerror: ((this: SpeechRecognition, ev: any) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const useDictation = () => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.interimResults = true;
        recognition.continuous = false; // We control when it stops and starts
        recognition.lang = 'en-US';
        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, []);

    const start = useCallback((onResult: (transcript: string, isFinal: boolean) => void) => {
        if (isListening || !recognitionRef.current) return;

        const recognition = recognitionRef.current;
        
        recognition.onresult = (event) => {
            let transcript = '';
            let isFinal = false;
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
                if(event.results[i].isFinal) {
                    isFinal = true;
                }
            }
            onResult(transcript, isFinal);
        };
        
        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };
        
        recognition.start();
        setIsListening(true);
    }, [isListening]);

    const stop = useCallback(() => {
        if (!isListening || !recognitionRef.current) return;
        recognitionRef.current.stop();
        setIsListening(false);
    }, [isListening]);

    return {
        isListening,
        start,
        stop,
        hasRecognitionSupport: !!SpeechRecognition
    };
};

export default useDictation;
