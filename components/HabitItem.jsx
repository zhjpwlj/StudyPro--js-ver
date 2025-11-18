import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization.jsx';
import { FireIcon, CheckIcon, PencilIcon, Trash2Icon, XIcon } from './icons/Icons.jsx';

const HabitItem = ({ habit, onComplete, onSelect, onDelete, onUpdate, isSelected }) => {
    const { t } = useLocalization();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(habit.name);

    const todayStr = new Date().toDateString();
    const isCompletedToday = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() === todayStr : false;
    
    const handleSave = () => {
        if (editText.trim()) {
            onUpdate(habit.id, editText.trim());
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <div className="p-3 rounded-lg bg-primary-100 dark:bg-gray-700 ring-2 ring-primary-500 flex items-center space-x-2">
                <input 
                    type="text" 
                    value={editText} 
                    onChange={e => setEditText(e.target.value)} 
                    onKeyPress={e => e.key === 'Enter' && handleSave()}
                    className="flex-1 bg-transparent focus:outline-none text-sm font-semibold" 
                    autoFocus
                />
                <button onClick={handleSave} className="p-1 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full"><CheckIcon className="w-4 h-4" /></button>
                <button onClick={() => setIsEditing(false)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><XIcon className="w-4 h-4" /></button>
            </div>
        );
    }

    return (
        <div 
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${isSelected ? 'bg-primary-100 dark:bg-gray-700 ring-2 ring-primary-500' : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/70'}`}
            onClick={() => onSelect(habit.id)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isCompletedToday) onComplete(habit.id);
                        }}
                        disabled={isCompletedToday}
                        className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mr-4 transition-colors duration-200 ${
                            isCompletedToday
                                ? 'bg-green-500 text-white cursor-default'
                                : 'bg-gray-200 dark:bg-gray-600 hover:bg-green-200 dark:hover:bg-green-700 text-gray-500 dark:text-gray-300'
                        }`}
                        aria-label={`Complete ${habit.name}`}
                    >
                        <CheckIcon className="w-6 h-6" />
                    </button>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{habit.name}</p>
                        <div className={`flex items-center text-sm ${habit.streak > 0 ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'}`}>
                           <FireIcon className="w-4 h-4 mr-1" />
                           <span>{habit.streak} {t('days')}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><PencilIcon className="w-4 h-4" /></button>
                    <button onClick={(e) => { e.stopPropagation(); if (window.confirm('Are you sure you want to delete this habit?')) { onDelete(habit.id); } }} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><Trash2Icon className="w-4 h-4 text-red-500" /></button>
                </div>
            </div>
        </div>
    );
};

export default HabitItem;
