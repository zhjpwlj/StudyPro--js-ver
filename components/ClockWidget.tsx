import React, { useState, useEffect } from 'react';

const AnalogClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    const secondDeg = (seconds / 60) * 360;
    const minuteDeg = (minutes / 60) * 360 + (seconds/60)*6;
    const hourDeg = (hours / 12) * 360 + (minutes/60)*30;

    return (
        <div className="relative w-48 h-48 sm:w-52 sm:h-52">
            <div className="absolute inset-0 rounded-full border-4 border-gray-700 dark:border-gray-300 shadow-inner bg-gray-100 dark:bg-gray-800"></div>
            {[...Array(12)].map((_, i) => (
                <div key={i} className="absolute w-full h-full" style={{ transform: `rotate(${i * 30}deg)` }}>
                    <div className={`absolute top-1 left-1/2 -ml-0.5 h-3 ${i % 3 === 0 ? 'w-1 bg-gray-800 dark:bg-gray-200' : 'w-0.5 bg-gray-500 dark:bg-gray-400'}`}></div>
                </div>
            ))}
            <div className="absolute inset-0 flex items-center justify-center" style={{transform: `rotate(-90deg)`}}>
                <div className="absolute w-1 h-12 bg-gray-800 dark:bg-gray-200 rounded-full" style={{ transform: `rotate(${hourDeg}deg)`, transformOrigin: 'bottom', top: 'calc(50% - 3rem)' }}></div>
                <div className="absolute w-0.5 h-16 bg-gray-800 dark:bg-gray-200 rounded-full" style={{ transform: `rotate(${minuteDeg}deg)`, transformOrigin: 'bottom', top: 'calc(50% - 4rem)' }}></div>
                <div className="absolute w-0.5 h-20 bg-red-500 rounded-full" style={{ transform: `rotate(${secondDeg}deg)`, transformOrigin: 'bottom', top: 'calc(50% - 5rem)'}}></div>
            </div>
            <div className="absolute top-1/2 left-1/2 w-3 h-3 -mt-1.5 -ml-1.5 bg-gray-800 dark:bg-gray-200 rounded-full z-10 border-2 border-gray-100 dark:border-gray-800"></div>
        </div>
    );
};

const DigitalClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit'});
    const formatDate = (d: Date) => d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="text-center">
            <p className="text-5xl font-semibold font-mono text-gray-800 dark:text-gray-100">{formatTime(time)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(time)}</p>
        </div>
    );
};


const ClockWidget: React.FC = () => {
    const [mode, setMode] = useState<'analog' | 'digital'>('analog');
    
    const toggleMode = () => setMode(prev => prev === 'analog' ? 'digital' : 'analog');

    return (
        <div className="h-full w-full flex items-center justify-center rounded-lg cursor-pointer" onClick={toggleMode} title="Click to change clock mode">
            {mode === 'analog' ? <AnalogClock /> : <DigitalClock />}
        </div>
    );
};

export default ClockWidget;