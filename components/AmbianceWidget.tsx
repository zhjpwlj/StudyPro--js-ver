import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon } from './icons/Icons';

const tracks = {
    music: [
        { name: 'Lofi Chill', url: 'https://cdn.pixabay.com/audio/2022/02/07/audio_f559817f73.mp3' },
        { name: 'Peaceful Piano', url: 'https://cdn.pixabay.com/audio/2022/11/17/audio_88591f85af.mp3' },
    ],
    ambient: [
        { name: 'Forest Rain', url: 'https://cdn.pixabay.com/audio/2022/08/04/audio_3583162725.mp3' },
        { name: 'Ocean Waves', url: 'https://cdn.pixabay.com/audio/2023/09/20/audio_5556d56345.mp3' },
    ],
    noise: [
        { name: 'White Noise', url: 'https://cdn.pixabay.com/audio/2021/09/24/audio_7eb0a05f76.mp3' },
        { name: 'Brown Noise', url: 'https://cdn.pixabay.com/audio/2022/05/29/audio_3439b16140.mp3' },
    ]
};

type Category = keyof typeof tracks;

const AmbianceWidget: React.FC = () => {
    const [category, setCategory] = useState<Category>('music');
    const [currentTrack, setCurrentTrack] = useState(tracks.music[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = currentTrack.url;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
        }
    }, [currentTrack]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    const selectTrack = (track: {name: string, url: string}) => {
        setIsPlaying(true); // Auto-play new track
        setCurrentTrack(track);
    };

    const handleCategoryChange = (cat: Category) => {
        setCategory(cat);
        selectTrack(tracks[cat][0]);
    }

    return (
        <div className="h-full flex flex-col">
            <audio ref={audioRef} loop onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
            <div className="flex space-x-1 p-1 bg-gray-200/70 dark:bg-gray-700/70 rounded-lg mb-4">
                {(Object.keys(tracks) as Category[]).map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => handleCategoryChange(cat)}
                        className={`flex-1 capitalize px-3 py-1 text-sm font-semibold rounded-md transition-colors ${category === cat ? 'bg-white dark:bg-gray-800 shadow text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {tracks[category].map(track => (
                    <div 
                        key={track.name} 
                        onClick={() => selectTrack(track)}
                        className={`p-3 rounded-lg cursor-pointer ${currentTrack.url === track.url ? 'bg-primary-100 dark:bg-primary-900/50' : 'hover:bg-gray-200/50 dark:hover:bg-gray-700/50'}`}
                    >
                        <p className="font-medium">{track.name}</p>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <p className="font-semibold text-center truncate mb-3">{currentTrack.name}</p>
                <div className="flex items-center justify-center space-x-4">
                    <button onClick={togglePlay} className="p-3 bg-primary-500 text-white rounded-full hover:bg-primary-600">
                        {isPlaying ? <PauseIcon className="w-5 h-5"/> : <PlayIcon className="w-5 h-5"/>}
                    </button>
                    <div className="flex items-center space-x-2 w-40">
                        <VolumeXIcon className="w-5 h-5 text-gray-500"/>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={e => setVolume(parseFloat(e.target.value))}
                            className="w-full h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary-500"
                        />
                         <Volume2Icon className="w-5 h-5 text-gray-500"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AmbianceWidget;