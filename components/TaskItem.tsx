import React, { useState, useRef, useEffect } from 'react';
import type { Task } from '../types';
import { PencilIcon, Trash2Icon, PlusIcon, MoreHorizontalIcon, XIcon, CheckIcon as SaveIcon } from './icons/Icons';

interface TaskItemProps {
    task: Task;
    level: number;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onAddSubtask: (parentId: number) => void;
    onStartEdit: (task: Task) => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    editingTask: { id: number; text: string; dueDate: string } | null;
    setEditingTask: React.Dispatch<React.SetStateAction<{ id: number; text: string; dueDate: string } | null>>;
}

const CourseTag: React.FC<{ course: string }> = ({ course }) => {
    const colors: { [key: string]: string } = {
        'CS 101': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'CS 102': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'HIST 201': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'MATH 103': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        'General': 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200',
    };

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[course] || 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'}`}>
            {course}
        </span>
    );
};


const TaskItem: React.FC<TaskItemProps> = ({ task, level, onToggle, onDelete, onAddSubtask, onStartEdit, onSaveEdit, onCancelEdit, editingTask, setEditingTask }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const isEditing = editingTask?.id === task.id;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
        
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    if (isEditing) {
        return (
             <div className="flex items-center p-2 rounded-lg bg-primary-100/50 dark:bg-gray-700/50" style={{ marginLeft: `${level * 1.5}rem` }}>
                <div className="flex-1 flex items-center space-x-2">
                    <input
                        type="text"
                        value={editingTask!.text}
                        onChange={(e) => setEditingTask({...editingTask!, text: e.target.value})}
                        className="w-full text-sm bg-transparent focus:outline-none"
                    />
                     <input 
                        type="date"
                        value={editingTask!.dueDate}
                        onChange={(e) => setEditingTask({...editingTask!, dueDate: e.target.value})}
                        className="bg-transparent text-xs text-gray-500 dark:text-gray-400 focus:outline-none"
                    />
                </div>
                 <div className="flex items-center space-x-1">
                     <button onClick={onSaveEdit} className="p-1 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full"><SaveIcon className="w-4 h-4"/></button>
                     <button onClick={onCancelEdit} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><XIcon className="w-4 h-4"/></button>
                 </div>
            </div>
        )
    }

    return (
        <div 
            className={`flex items-center justify-between p-2 rounded-lg transition-colors duration-200 group ${task.completed ? 'bg-black/5 dark:bg-white/5' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
            style={{ marginLeft: `${level * 1.5}rem` }}
        >
            <div className="flex items-center flex-1 min-w-0">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                    className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer flex-shrink-0"
                />
                <div className="ml-4 min-w-0">
                    <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`} title={task.text}>
                        {task.text}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(task.dueDate)}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                <CourseTag course={task.course} />
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <MoreHorizontalIcon className="w-4 h-4" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 z-10 text-sm">
                            <button onClick={() => { onStartEdit(task); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"><PencilIcon className="w-4 h-4 mr-2"/>Edit</button>
                            <button onClick={() => { onAddSubtask(task.id); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"><PlusIcon className="w-4 h-4 mr-2"/>Add Subtask</button>
                            <button onClick={() => { onDelete(task.id); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-3 py-1.5 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50"><Trash2Icon className="w-4 h-4 mr-2"/>Delete</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
