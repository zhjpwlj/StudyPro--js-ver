import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization.jsx';
import { Trash2Icon, MicrophoneIcon } from './icons/Icons.jsx';
import useDictation from '../hooks/useDictation.js';

const moods = {
    great: '😊',
    good: '🙂',
    neutral: '😐',
    bad: '🙁',
    awful: '😠',
};

const Journal = ({ entries, setEntries }) => {
    const { t } = useLocalization();
    const [currentEntry, setCurrentEntry] = useState({
        title: '',
        content: '',
        mood: 'neutral'
    });
    const [isWriting, setIsWriting] = useState(false);
    const { isListening, start, stop, hasRecognitionSupport } = useDictation();

    const handleSave = () => {
        if (currentEntry.title && currentEntry.content) {
            const newEntry = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                title: currentEntry.title,
                content: currentEntry.content,
                mood: currentEntry.mood || 'neutral',
            };
            setEntries([newEntry, ...entries]);
            setCurrentEntry({ title: '', content: '', mood: 'neutral' });
            setIsWriting(false);
        }
    };
    
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this journal entry?")) {
            setEntries(entries.filter(entry => entry.id !== id));
        }
    };

    const handleDictation = () => {
        if (isListening) {
            stop();
        } else {
            const existingContent = currentEntry.content ? currentEntry.content + ' ' : '';
            start((result) => {
                setCurrentEntry(prev => ({...prev, content: existingContent + result}));
            });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString([], {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    if (isWriting) {
        return (
            <div className="h-full flex flex-col">
                <input
                    type="text"
                    placeholder={t('journal_placeholder_title')}
                    value={currentEntry.title}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                    className="text-xl font-semibold bg-transparent focus:outline-none mb-2"
                />
                <textarea
                    placeholder={t('journal_placeholder_content')}
                    value={currentEntry.content}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                    className="flex-1 bg-transparent focus:outline-none resize-none text-sm"
                />
                <div className="flex items-center justify-between mt-4">
                     <div className="flex items-center space-x-1">
                        <span className="text-sm mr-1">{t('journal_mood')}</span>
                        {Object.entries(moods).map(([moodKey, moodEmoji]) => (
                             <button 
                                key={moodKey} 
                                onClick={() => setCurrentEntry({...currentEntry, mood: moodKey})}
                                className={`text-2xl p-1 rounded-full transition-transform duration-200 ${currentEntry.mood === moodKey ? 'bg-primary-200/50 scale-125' : 'hover:scale-110'}`}
                             >{moodEmoji}</button>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2">
                        {hasRecognitionSupport && (
                            <button 
                                onClick={handleDictation}
                                title={isListening ? 'Stop dictation' : 'Start dictation'}
                                className={`p-2 rounded-full ${isListening ? 'text-red-500 bg-red-100 dark:bg-red-900/50 animate-pulse' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                <MicrophoneIcon className="w-5 h-5"/>
                            </button>
                         )}
                        <button onClick={() => setIsWriting(false)} className="text-sm px-4 py-2 rounded-md">Cancel</button>
                        <button onClick={handleSave} className="text-sm px-4 py-2 bg-primary-500 text-white rounded-md">Save</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{t('journal')}</h3>
                <button onClick={() => setIsWriting(true)} className="px-4 py-2 bg-primary-500 text-white rounded-md text-sm">{t('journal_new_entry')}</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {entries.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No entries yet.</p>}
                {entries.map(entry => (
                    <div key={entry.id} className="p-4 rounded-lg bg-black/5 dark:bg-white/5 group relative">
                        <button onClick={() => handleDelete(entry.id)} className="absolute top-2 right-2 p-1 text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2Icon className="w-4 h-4" />
                        </button>
                        <div className="flex justify-between items-start">
                             <div>
                                <h4 className="font-semibold">{entry.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(entry.date)}</p>
                             </div>
                             <span className="text-2xl pr-6">{moods[entry.mood]}</span>
                        </div>
                        <p className="text-sm mt-2 whitespace-pre-wrap">{entry.content.substring(0, 100)}{entry.content.length > 100 && '...'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Journal;
