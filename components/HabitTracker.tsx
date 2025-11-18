import React, { useState } from 'react';
import { Habit } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import HabitItem from './HabitItem';
import HabitCalendar from './HabitCalendar';
import { PlusIcon } from './icons/Icons';

interface HabitTrackerProps {
    habits: Habit[];
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

const isYesterday = (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
};

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, setHabits }) => {
    const [selectedHabitId, setSelectedHabitId] = useState<number | null>(habits.length > 0 ? habits[0].id : null);
    const [motivation, setMotivation] = useState<string>('');
    const [newHabitName, setNewHabitName] = useState('');
    const { t } = useLocalization();

    const handleCompleteHabit = (id: number) => {
        setHabits(habits.map(habit => {
            if (habit.id === id) {
                const today = new Date();
                const todayISO = today.toISOString();
                
                const lastCompletedDate = habit.lastCompleted ? new Date(habit.lastCompleted) : null;
                
                let newStreak = 1;
                if (lastCompletedDate && isYesterday(lastCompletedDate)) {
                    newStreak = habit.streak + 1;
                    setMotivation(`${t('great_job')} ${t('streak_kept')}`);
                } else if (lastCompletedDate && lastCompletedDate.toDateString() !== today.toDateString()) {
                     setMotivation(t('great_job'));
                } else {
                     newStreak = habit.streak + 1;
                     setMotivation(t('great_job'));
                }

                setTimeout(() => setMotivation(''), 3000);

                return {
                    ...habit,
                    streak: newStreak,
                    lastCompleted: todayISO,
                    history: [...habit.history, todayISO],
                };
            }
            return habit;
        }));
    };
    
    const handleAddHabit = () => {
        if (newHabitName.trim() === '') return;
        const newHabit: Habit = {
            id: Date.now(),
            name: newHabitName.trim(),
            streak: 0,
            lastCompleted: null,
            history: [],
        };
        setHabits([...habits, newHabit]);
        setNewHabitName('');
        if (!selectedHabitId) {
            setSelectedHabitId(newHabit.id);
        }
    };

    const handleDeleteHabit = (id: number) => {
        setHabits(habits.filter(h => h.id !== id));
        if (selectedHabitId === id) {
            const remainingHabits = habits.filter(h => h.id !== id);
            setSelectedHabitId(remainingHabits.length > 0 ? remainingHabits[0].id : null);
        }
    };
    
    const handleUpdateHabit = (id: number, name: string) => {
        setHabits(habits.map(h => h.id === id ? {...h, name} : h));
    };

    const selectedHabit = habits.find(h => h.id === selectedHabitId);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{t('habit_tracker')}</h3>
                 {motivation && <p className="text-sm text-green-500 animate-pulse font-medium">{motivation}</p>}
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                {habits.map(habit => (
                    <HabitItem 
                        key={habit.id} 
                        habit={habit} 
                        onComplete={handleCompleteHabit}
                        onSelect={setSelectedHabitId}
                        onDelete={handleDeleteHabit}
                        onUpdate={handleUpdateHabit}
                        isSelected={selectedHabitId === habit.id}
                    />
                ))}
                 {selectedHabit && <HabitCalendar history={selectedHabit.history} />}
            </div>
             <div className="mt-4 border-t border-gray-200/50 dark:border-gray-700/50 pt-3 flex items-center space-x-2">
                <input
                    type="text"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
                    placeholder="Add a new habit..."
                    className="flex-1 w-full bg-transparent focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
                />
                 <button onClick={handleAddHabit} className="p-1 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-full">
                    <PlusIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default HabitTracker;