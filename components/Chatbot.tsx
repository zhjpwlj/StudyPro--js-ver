import React, { useState, useRef, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { sendMessageStream } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { SendIcon, SparklesIcon, MicrophoneIcon } from './icons/Icons';
import useDictation from '../hooks/useDictation';

const Chatbot: React.FC = () => {
    const { t } = useLocalization();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDeepThink, setIsDeepThink] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { isListening, start, stop, hasRecognitionSupport } = useDictation();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);
        
        // Add a placeholder for AI response
        setMessages((prev) => [...prev, { sender: 'ai', text: '' }]);

        await sendMessageStream(
            currentInput,
            isDeepThink,
            (chunk) => {
                setMessages((prev) => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage.sender === 'ai') {
                        const updatedMessage = { ...lastMessage, text: lastMessage.text + chunk };
                        return [...prev.slice(0, -1), updatedMessage];
                    }
                    return prev;
                });
            },
            () => {
                setIsLoading(false);
            }
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };
    
    const handleDictation = () => {
        if (isListening) {
            stop();
        } else {
            start((result) => {
                setInput(result);
            });
        }
    };

    const Message: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
        const isUser = msg.sender === 'user';
        return (
            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
                <div className={`px-4 py-2 rounded-xl max-w-xs lg:max-w-md ${
                    isUser
                        ? 'bg-primary-500 text-white rounded-br-none'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                }`}>
                    <p className="text-sm">{msg.text || '...'}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4 group relative">
                <label htmlFor="deep-think-toggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input id="deep-think-toggle" type="checkbox" className="sr-only" checked={isDeepThink} onChange={() => setIsDeepThink(!isDeepThink)} />
                        <div className={`block w-10 h-6 rounded-full transition ${isDeepThink ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isDeepThink ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <div className="ml-3 font-medium">{t('deep_think_mode')}</div>
                </label>
                 <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-black text-white text-xs rounded-md scale-0 group-hover:scale-100 transition-transform origin-bottom z-50">
                    {t('deep_think_tooltip')}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                {messages.map((msg, index) => <Message key={index} msg={msg} />)}
                {isLoading && messages[messages.length-1]?.text === '' && (
                    <div className="flex justify-start mb-3">
                        <div className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                           <div className="flex items-center space-x-2">
                               <SparklesIcon className="w-4 h-4 animate-pulse" />
                               <span className="text-sm">{t('thinking')}</span>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-4 flex items-center border-t border-gray-200/50 dark:border-gray-700/50 pt-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('chatbot_placeholder')}
                    className="flex-1 w-full bg-transparent focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={isLoading}
                />
                {hasRecognitionSupport && (
                    <button
                        onClick={handleDictation}
                        disabled={isLoading}
                        className={`ml-3 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}
                        title={isListening ? 'Stop dictation' : 'Dictate message'}
                    >
                        <MicrophoneIcon className="w-5 h-5" />
                    </button>
                )}
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input}
                    className="ml-2 p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Chatbot;