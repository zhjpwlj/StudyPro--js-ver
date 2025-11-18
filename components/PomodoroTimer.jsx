import React, { useState, useEffect, useRef } from 'react';
import { useLocalization } from '../hooks/useLocalization.jsx';

const TIME_SETTINGS = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

const PomodoroTimer = () => {
    const { t } = useLocalization();
    const [mode, setMode] = useState('pomodoro');
    const [time, setTime] = useState(TIME_SETTINGS[mode]);
    const [isActive, setIsActive] = useState(false);
    const audioRef = useRef(null);
    
    useEffect(() => {
        setTime(TIME_SETTINGS[mode]);
        setIsActive(false);
    }, [mode]);

    useEffect(() => {
        let interval = null;
        if (isActive && time > 0) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (isActive && time === 0) {
            if (audioRef.current) {
                audioRef.current.play();
            }
            setIsActive(false);
            // Suggest next mode, but don't auto-start
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, time]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTime(TIME_SETTINGS[mode]);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const percentage = ((TIME_SETTINGS[mode]) - time) / (TIME_SETTINGS[mode]) * 100;

    const modeTitles = {
        pomodoro: 'Pomodoro',
        shortBreak: 'Short Break',
        longBreak: 'Long Break',
    }

    const modeColors = {
        pomodoro: 'text-red-500',
        shortBreak: 'text-green-500',
        longBreak: 'text-blue-500',
    }

    const selectMode = (newMode) => {
        if (isActive && !window.confirm("A timer is running. Are you sure you want to switch? This will reset the current timer.")) {
            return;
        }
        setMode(newMode);
    }
    
    return (
        <div className="h-full flex flex-col items-center justify-between text-center">
            <audio ref={audioRef} src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg" preload="auto"></audio>
            
            <div className="flex space-x-2 p-1 bg-gray-200/70 dark:bg-gray-700/70 rounded-lg">
                {(Object.keys(TIME_SETTINGS)).map(m => (
                    <button 
                        key={m} 
                        onClick={() => selectMode(m)}
                        className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${mode === m ? 'bg-white dark:bg-gray-800 shadow text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        {modeTitles[m]}
                    </button>
                ))}
            </div>

            <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="7"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                    />
                    <circle
                        className={modeColors[mode]}
                        strokeWidth="7"
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={2 * Math.PI * 45 - (percentage / 100) * 2 * Math.PI * 45}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h2 className="text-5xl font-bold text-gray-800 dark:text-white">{formatTime(time)}</h2>
                </div>
            </div>
            <div className="flex space-x-4">
                <button onClick={toggleTimer} className={`px-6 py-2 rounded-lg font-semibold text-white ${isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-primary-600 hover:bg-primary-700'}`}>
                    {isActive ? t('pomo_pause') : t('pomo_start')}
                </button>
                <button onClick={resetTimer} className="px-6 py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">
                    {t('pomo_reset')}
                </button>
            </div>
        </div>
    );
};

export default PomodoroTimer;
