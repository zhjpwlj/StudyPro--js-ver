import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization.jsx';
import { useTheme } from '../hooks/useDarkMode.js';
import { SunIcon, MoonIcon, BrainCircuitIcon } from './icons/Icons.jsx';

const TopBar = ({ onLogout }) => {
    const { language, setLanguage } = useLocalization();
    const { mode, toggleMode } = useTheme();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    const formatDate = (date) => {
        return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <header className="top-bar h-8 flex items-center px-4 text-sm font-medium text-gray-800 dark:text-gray-200 z-50 flex-shrink-0">
            <div className="flex items-center space-x-4 flex-shrink-0">
                <BrainCircuitIcon className="w-5 h-5 text-primary-500" />
                <span className="font-bold">StudyPro</span>
            </div>
            <div className="flex-1 flex justify-center items-center space-x-4 min-w-0 px-4">
                 <span className="truncate">{formatDate(currentTime)}</span>
                 <span className="truncate">{formatTime(currentTime)}</span>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
                 <p className="truncate">Alex Turner</p>
                <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="bg-gray-200/30 dark:bg-gray-800/50 border-none focus:outline-none focus:ring-0 rounded"
                >
                    <option className="bg-white dark:bg-gray-800 text-black dark:text-white" value="en">EN</option>
                    <option className="bg-white dark:bg-gray-800 text-black dark:text-white" value="zh">ZH</option>
                    <option className="bg-white dark:bg-gray-800 text-black dark:text-white" value="ja">JA</option>
                </select>

                <button onClick={toggleMode} className="focus:outline-none">
                    {mode === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                </button>
            </div>
        </header>
    );
};

export default TopBar;
