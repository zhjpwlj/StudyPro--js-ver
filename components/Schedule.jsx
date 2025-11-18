import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization.jsx';
import { ChevronLeftIcon, ChevronRightIcon, XIcon, PlusIcon, Trash2Icon } from './icons/Icons.jsx';

const DayDetailModal = ({
    date,
    tasks,
    events,
    onClose,
    onAddEvent,
    onDeleteEvent,
}) => {
    const [newEventTitle, setNewEventTitle] = useState('');

    const handleAdd = () => {
        if (newEventTitle.trim()) {
            onAddEvent(newEventTitle.trim());
            setNewEventTitle('');
        }
    };
    
    return (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <XIcon className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold mb-1">{date.toLocaleDateString(undefined, { weekday: 'long' })}</h3>
                <p className="text-md text-gray-500 dark:text-gray-400 mb-4">{date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
                
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    <h4 className="font-semibold text-sm">Tasks Due</h4>
                    {tasks.length > 0 ? tasks.map(task => (
                        <div key={`task-${task.id}`} className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 p-2 rounded text-sm">
                           {task.text}
                        </div>
                    )) : <p className="text-sm text-gray-400">No tasks due.</p>}
                    
                    <h4 className="font-semibold text-sm pt-2">Events</h4>
                     {events.length > 0 ? events.map(event => (
                        <div key={`event-${event.id}`} className="flex items-center justify-between bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 p-2 rounded text-sm">
                           <span>{event.title}</span>
                           <button onClick={() => onDeleteEvent(event.id)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><Trash2Icon className="w-4 h-4"/></button>
                        </div>
                    )) : <p className="text-sm text-gray-400">No events scheduled.</p>}
                </div>
                
                <div className="mt-4 border-t border-gray-200/50 dark:border-gray-700/50 pt-3 flex items-center space-x-2">
                    <input 
                        type="text"
                        value={newEventTitle}
                        onChange={e => setNewEventTitle(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleAdd()}
                        placeholder="Add a new event..."
                        className="flex-1 w-full bg-transparent focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <button onClick={handleAdd} className="p-1 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-full">
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Schedule = ({ tasks, events, setEvents }) => {
    const { t } = useLocalization();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [modalState, setModalState] = useState({isOpen: false, date: null});

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const changeMonth = (amount) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + amount, 1));
    };

    const handleDayClick = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setModalState({isOpen: true, date });
    };

    const handleAddEvent = (title) => {
        if (!modalState.date) return;
        const newEvent = {
            id: Date.now().toString(),
            title,
            start: modalState.date,
            end: modalState.date,
        };
        setEvents([...events, newEvent]);
    };

    const handleDeleteEvent = (id) => {
        setEvents(events.filter(e => e.id !== id));
    };

    const renderMonthView = () => {
        const blanks = Array.from({ length: startDay }, (_, i) => <div key={`blank-${i}`} className="border-r border-b border-gray-200/50 dark:border-gray-700/50"></div>);
        const days = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isToday = new Date().toDateString() === date.toDateString();

            const dayTasks = tasks.filter(task => new Date(task.dueDate).toDateString() === date.toDateString());
            const dayEvents = events.filter(event => new Date(event.start).toDateString() === date.toDateString());

            return (
                <div key={`day-${i}`} className="p-1 border-r border-b border-gray-200/50 dark:border-gray-700/50 min-h-[90px] text-xs flex flex-col cursor-pointer hover:bg-black/5 dark:hover:bg-white/5" onClick={() => handleDayClick(day)}>
                    <span className={`flex items-center justify-center h-6 w-6 rounded-full self-end text-sm ${isToday ? 'bg-primary-500 text-white' : ''}`}>{day}</span>
                    <div className="flex-1 overflow-y-auto mt-1 space-y-1">
                        {dayTasks.map(task => (
                            <div key={`task-${task.id}`} className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 p-1 rounded text-center truncate" title={task.text}>
                                {task.text}
                            </div>
                        ))}
                         {dayEvents.map(event => (
                            <div key={`event-${event.id}`} className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 p-1 rounded text-center truncate" title={event.title}>
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        });
        return <div className="grid grid-cols-7 flex-1 border-t border-l border-gray-200/50 dark:border-gray-700/50">{[...blanks, ...days]}</div>;
    };

    return (
        <div className="h-full flex flex-col relative">
            {modalState.isOpen && modalState.date && (
                <DayDetailModal 
                    date={modalState.date}
                    tasks={tasks.filter(task => new Date(task.dueDate).toDateString() === modalState.date?.toDateString())}
                    events={events.filter(event => new Date(event.start).toDateString() === modalState.date?.toDateString())}
                    onClose={() => setModalState({isOpen: false, date: null})}
                    onAddEvent={handleAddEvent}
                    onDeleteEvent={handleDeleteEvent}
                />
            )}
            <header className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <button onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50">
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-semibold mx-4 w-40 text-center">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50">
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
                <div>
                     <button onClick={() => setCurrentDate(new Date())} className="text-sm font-medium px-3 py-1 rounded-md hover:bg-gray-200/50 dark:hover:bg-gray-700/50">{t('schedule_today')}</button>
                </div>
            </header>
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                {daysOfWeek.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="flex-1 overflow-y-auto">
                 {renderMonthView()}
            </div>
        </div>
    );
};

export default Schedule;
