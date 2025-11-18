import React, { useState, useMemo } from 'react';
import { useLocalization } from '../hooks/useLocalization.js';
import TaskItem from './TaskItem.js';
import { FilterIcon, ArrowUpIcon, ArrowDownIcon, MicrophoneIcon } from './icons/Icons.js';
import useDictation from '../hooks/useDictation.js';

const TaskList = ({ tasks, setTasks }) => {
    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
    
    const [editingTask, setEditingTask] = useState(null);
    
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCourse, setFilterCourse] = useState('all');
    const [sortBy, setSortBy] = useState('dueDate');
    const [sortOrder, setSortOrder] = useState('asc');

    const { t } = useLocalization();
    const { isListening, start, stop, hasRecognitionSupport } = useDictation();
    
    const courses = useMemo(() => ['all', ...Array.from(new Set(tasks.map(t => t.course)))], [tasks]);

    const getDescendantIds = (taskId) => {
        const descendants = [];
        const children = tasks.filter(t => t.parentId === taskId);
        for (const child of children) {
            descendants.push(child.id);
            descendants.push(...getDescendantIds(child.id));
        }
        return descendants;
    };

    const handleToggleTask = (taskId) => {
        const taskToToggle = tasks.find(t => t.id === taskId);
        if (!taskToToggle) return;

        const newCompletedStatus = !taskToToggle.completed;
        const descendantIds = getDescendantIds(taskId);
        const idsToUpdate = [taskId, ...descendantIds];

        setTasks(prevTasks =>
            prevTasks.map(task =>
                idsToUpdate.includes(task.id) ? { ...task, completed: newCompletedStatus } : task
            )
        );
    };

    const addTask = (parentId = null) => {
        if (newTaskText.trim() === '') return;

        const newTaskItem = {
            id: Date.now(),
            text: newTaskText,
            completed: false,
            dueDate: new Date(newTaskDueDate).toISOString(),
            course: 'General',
            parentId,
        };
        setTasks(prevTasks => [...prevTasks, newTaskItem]);
        setNewTaskText('');
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    };
    
    const handleAddSubtask = (parentId) => {
        const text = prompt("Enter subtask description:");
        if (text) {
             const parentTask = tasks.find(t => t.id === parentId);
             const newTaskItem = {
                id: Date.now(),
                text,
                completed: false,
                dueDate: parentTask?.dueDate || new Date().toISOString(),
                course: parentTask?.course || 'General',
                parentId,
            };
            setTasks(prevTasks => [...prevTasks, newTaskItem]);
        }
    }

    const handleDeleteTask = (taskId) => {
        if (window.confirm("Are you sure you want to delete this task and all its subtasks?")) {
            const idsToDelete = [taskId, ...getDescendantIds(taskId)];
            setTasks(prevTasks => prevTasks.filter(task => !idsToDelete.includes(task.id)));
        }
    };
    
    const handleStartEdit = (task) => {
        setEditingTask({ id: task.id, text: task.text, dueDate: task.dueDate.split('T')[0] });
    };

    const handleSaveEdit = () => {
        if (!editingTask) return;
        setTasks(prevTasks => prevTasks.map(task => 
            task.id === editingTask.id 
                ? { ...task, text: editingTask.text, dueDate: new Date(editingTask.dueDate).toISOString() } 
                : task
        ));
        setEditingTask(null);
    };

    const handleDictation = () => {
        if (isListening) {
            stop();
        } else {
            setNewTaskText('');
            start((result) => {
                setNewTaskText(result);
            });
        }
    };

    const taskTree = useMemo(() => {
        const taskMap = new Map(tasks.map(task => [task.id, { ...task, subtasks: [] }]));
        const rootTasks = [];

        for (const task of taskMap.values()) {
            if (task.parentId && taskMap.has(task.parentId)) {
                taskMap.get(task.parentId).subtasks.push(task);
            } else {
                rootTasks.push(task);
            }
        }
        
        const sorter = (a, b) => {
            let comparison = 0;
            if (sortBy === 'dueDate') {
                comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            } else {
                comparison = a.text.localeCompare(b.text);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        };
        
        const sortRecursive = (taskList) => {
            taskList.sort(sorter);
            taskList.forEach(task => sortRecursive(task.subtasks));
        };

        sortRecursive(rootTasks);
        
        const filterRecursive = (taskList) => {
            return taskList.filter(task => {
                const subtasks = task.subtasks;
                if (subtasks && subtasks.length > 0) {
                     task.subtasks = filterRecursive(subtasks);
                }

                const statusMatch = filterStatus === 'all' || (filterStatus === 'completed' && task.completed) || (filterStatus === 'active' && !task.completed);
                const courseMatch = filterCourse === 'all' || task.course === filterCourse;

                return (statusMatch && courseMatch) || (task.subtasks && task.subtasks.length > 0);
            });
        };
        
        return filterRecursive(rootTasks);

    }, [tasks, filterStatus, filterCourse, sortBy, sortOrder]);

    const renderTaskNodes = (taskList, level) => {
        return taskList.map(task => (
            <React.Fragment key={task.id}>
                <TaskItem
                    task={task}
                    level={level}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    onAddSubtask={handleAddSubtask}
                    onStartEdit={handleStartEdit}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={() => setEditingTask(null)}
                    editingTask={editingTask}
                    setEditingTask={setEditingTask}
                />
                {task.subtasks && renderTaskNodes(task.subtasks, level + 1)}
            </React.Fragment>
        ));
    };

    const selectClassName = "bg-gray-200/50 dark:bg-gray-700/50 border-none focus:outline-none focus:ring-0 text-sm text-gray-700 dark:text-gray-300 rounded-md px-1 py-0.5";

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{t('tasks')}</h3>
            
            <div className="flex items-center space-x-4 mb-4 text-sm">
                <div className="flex items-center space-x-2">
                    <FilterIcon className="w-4 h-4 text-gray-500" />
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={selectClassName}>
                        <option className="bg-white dark:bg-gray-800" value="all">All Status</option>
                        <option className="bg-white dark:bg-gray-800" value="active">Active</option>
                        <option className="bg-white dark:bg-gray-800" value="completed">Completed</option>
                    </select>
                     <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} className={selectClassName}>
                        {courses.map(c => <option className="bg-white dark:bg-gray-800" key={c} value={c}>{c === 'all' ? 'All Courses' : c}</option>)}
                    </select>
                </div>
                 <div className="flex items-center space-x-2">
                    <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="p-1 text-gray-500 dark:text-gray-400">
                        {sortOrder === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                    </button>
                     <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={selectClassName}>
                        <option className="bg-white dark:bg-gray-800" value="dueDate">Sort by Due Date</option>
                        <option className="bg-white dark:bg-gray-800" value="alphabetical">Sort Alphabetical</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-1">
                {renderTaskNodes(taskTree, 0)}
            </div>
             <div className="mt-4 border-t border-gray-200/50 dark:border-gray-700/50 pt-3 flex items-center space-x-2">
                <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('add_a_task')}
                    className="flex-1 w-full bg-transparent focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-white"
                />
                 {hasRecognitionSupport && (
                    <button
                        onClick={handleDictation}
                        title={isListening ? 'Stop dictation' : 'Dictate task'}
                        className={`p-1 rounded-full ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        <MicrophoneIcon className="w-5 h-5" />
                    </button>
                )}
                <input 
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="bg-transparent text-sm text-gray-500 dark:text-gray-400 focus:outline-none"
                />
                <button onClick={() => addTask()} className="px-4 py-1 text-sm font-semibold bg-primary-500 text-white rounded-md hover:bg-primary-600">
                    Add
                </button>
            </div>
        </div>
    );
};

export default TaskList;