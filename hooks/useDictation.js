import { useState, useEffect, useRef, useCallback } from 'react';

const SpeechRecognition = (window).SpeechRecognition || (window).webkitSpeechRecognition;

const useDictation = () => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.interimResults = true;
        recognition.continuous = false; // We control when it stops and starts
        recognition.lang = 'en-US';
        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const start = useCallback((onResult) => {
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
