import React, { useState, useRef, useEffect } from 'react';
import { PencilIcon, Trash2Icon, PlusIcon, MoreHorizontalIcon, XIcon, CheckIcon as SaveIcon } from './icons/Icons.js';

const CourseTag = ({ course }) => {
    const colors = {
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

const TaskItem = ({ task, level, onToggle, onDelete, onAddSubtask, onStartEdit, onSaveEdit, onCancelEdit, editingTask, setEditingTask }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const isEditing = editingTask?.id === task.id;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        
        // Remove time part for accurate date comparison
        today.setHours(0, 0, 0, 0);
        tomorrow.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        if (date.getTime() === today.getTime()) {
            return 'Today';
        }
        if (date.getTime() === tomorrow.getTime()) {
            return 'Tomorrow';
        }
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const handleTextChange = (e) => {
        if (setEditingTask && editingTask) {
            setEditingTask({ ...editingTask, text: e.target.value });
        }
    };
    
    const handleDateChange = (e) => {
        if (setEditingTask && editingTask) {
            setEditingTask({ ...editingTask, dueDate: e.target.value });
        }
    };

    if (isEditing && editingTask) {
        return (
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-white dark:bg-gray-700" style={{ marginLeft: `${level * 20}px` }}>
                <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} className="form-checkbox h-4 w-4 text-primary-600 rounded" />
                <input type="text" value={editingTask.text} onChange={handleTextChange} className="flex-1 bg-transparent focus:outline-none text-sm" autoFocus />
                <input type="date" value={editingTask.dueDate} onChange={handleDateChange} className="bg-transparent text-sm text-gray-500 dark:text-gray-400 focus:outline-none" />
                <button onClick={onSaveEdit} className="p-1 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full"><SaveIcon className="w-4 h-4" /></button>
                <button onClick={onCancelEdit} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><XIcon className="w-4 h-4" /></button>
            </div>
        );
    }
    
    return (
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 group" style={{ marginLeft: `${level * 20}px` }}>
            <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => onToggle(task.id)}
                className="form-checkbox h-4 w-4 text-primary-600 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-primary-500"
            />
            <div className="flex-1">
                <p className={`text-sm ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                    {task.text}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                    <CourseTag course={task.course} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(task.dueDate)}</span>
                </div>
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div ref={menuRef} className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 rounded-full hover:bg-gray-200/80 dark:hover:bg-gray-700">
                        <MoreHorizontalIcon className="w-4 h-4 text-gray-500" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            <button onClick={() => { onStartEdit(task); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"><PencilIcon className="w-4 h-4 mr-2"/> Edit</button>
                            <button onClick={() => { onAddSubtask(task.id); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"><PlusIcon className="w-4 h-4 mr-2"/> Add Subtask</button>
                            <button onClick={() => { onDelete(task.id); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50"><Trash2Icon className="w-4 h-4 mr-2"/> Delete</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskItem;