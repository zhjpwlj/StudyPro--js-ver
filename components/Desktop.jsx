import React, { useState, useCallback, useEffect } from 'react';
import TopBar from './TopBar.jsx';
import Dock from './Dock.jsx';
import Widget from './Widget.jsx';
import TaskList from './TaskList.jsx';
import Chatbot from './Chatbot.jsx';
import HabitTracker from './HabitTracker.jsx';
import PomodoroTimer from './PomodoroTimer.jsx';
import Schedule from './Schedule.jsx';
import Journal from './Journal.jsx';
import ClockWidget from './ClockWidget.jsx';
import CalculatorWidget from './CalculatorWidget.jsx';
import WeatherWidget from './WeatherWidget.jsx';
import AmbianceWidget from './AmbianceWidget.jsx';
import SettingsWidget from './SettingsWidget.jsx';
import { useLocalization } from '../hooks/useLocalization.jsx';
import { WIDGET_HEADER_HEIGHT, DOCK_AREA_HEIGHT } from '../constants.js';

const componentMap = {
    tasks: TaskList,
    chatbot: Chatbot,
    habits: HabitTracker,
    pomodoro: PomodoroTimer,
    schedule: Schedule,
    journal: Journal,
    clock: ClockWidget,
    calculator: CalculatorWidget,
    weather: WeatherWidget,
    ambiance: AmbianceWidget,
    settings: SettingsWidget,
};

const WIDGET_DEFAULT_SIZES = {
    tasks: { width: 550, height: 450 },
    habits: { width: 400, height: 550 },
    chatbot: { width: 400, height: 600 },
    pomodoro: { width: 300, height: 400 },
    schedule: { width: 800, height: 600 },
    journal: { width: 500, height: 600 },
    clock: { width: 280, height: 280 },
    calculator: { width: 320, height: 500 },
    weather: { width: 300, height: 420 },
    ambiance: { width: 350, height: 450 },
    settings: { width: 600, height: 500 },
};

const defaultWidgets = [
    { id: 'tasks-1', type: 'tasks', position: { x: 50, y: 50 }, size: WIDGET_DEFAULT_SIZES['tasks'], zIndex: 1 },
    { id: 'habits-1', type: 'habits', position: { x: 630, y: 50 }, size: WIDGET_DEFAULT_SIZES['habits'], zIndex: 2 },
    { id: 'chatbot-1', type: 'chatbot', position: { x: 1060, y: 50 }, size: WIDGET_DEFAULT_SIZES['chatbot'], zIndex: 3 },
];

const getTodayAtMidnight = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString();
};

const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString();
};

const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    return yesterday.toISOString();
};

const initialTasks = [
    { id: 1, text: 'Complete Algorithms Homework 3', completed: false, dueDate: getTodayAtMidnight(), course: 'CS 101', parentId: null },
    { id: 2, text: 'Read Chapter 5 of "Intro to AI"', completed: false, dueDate: getTodayAtMidnight(), course: 'CS 102', parentId: null },
    { id: 3, text: 'Prepare presentation for History class', completed: false, dueDate: getTomorrow(), course: 'HIST 201', parentId: null },
    { id: 6, text: 'Gather sources', completed: true, dueDate: getYesterday(), course: 'HIST 201', parentId: 3 },
    { id: 7, text: 'Create slide deck', completed: false, dueDate: getTodayAtMidnight(), course: 'HIST 201', parentId: 3 },
    { id: 8, text: 'Draft speaking notes', completed: false, dueDate: getTomorrow(), course: 'HIST 201', parentId: 7 },
    { id: 4, text: 'Start research for final project', completed: false, dueDate: getTomorrow(), course: 'CS 101', parentId: null },
    { id: 5, text: 'Review Calculus notes for quiz', completed: false, dueDate: getTomorrow(), course: 'MATH 103', parentId: null },
];

const initialHabits = [
    { id: 1, name: 'Read for 30 minutes', streak: 12, lastCompleted: '2024-07-20T10:00:00.000Z', history: ['2024-07-20T10:00:00.000Z', '2024-07-19T10:00:00.000Z', '2024-07-18T10:00:00.000Z', '2024-07-17T10:00:00.000Z', '2024-07-16T10:00:00.000Z', '2024-07-15T10:00:00.000Z', '2024-07-14T10:00:00.000Z', '2024-07-13T10:00:00.000Z', '2024-07-12T10:00:00.000Z', '2024-07-11T10:00:00.000Z', '2024-07-10T10:00:00.000Z', '2024-07-09T10:00:00.000Z'] },
    { id: 2, name: 'Morning Jog (3km)', streak: 5, lastCompleted: '2024-07-20T08:00:00.000Z', history: ['2024-07-20T08:00:00.000Z', '2024-07-19T08:00:00.000Z', '2024-07-18T08:00:00.000Z', '2024-07-17T08:00:00.000Z', '2024-07-16T08:00:00.000Z'] },
    { id: 3, name: 'Practice coding challenge', streak: 0, lastCompleted: '2024-07-18T15:00:00.000Z', history: ['2024-07-18T15:00:00.000Z', '2024-07-17T15:00:00.000Z'] },
    { id: 4, name: 'Drink 8 glasses of water', streak: 0, lastCompleted: null, history: [] },
];

const usePersistentState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
        try {
            const storedValue = localStorage.getItem(key);
            if (storedValue) {
                // Special handling for dates
                if (key === 'studypro-calendar-events') {
                    const parsed = JSON.parse(storedValue);
                    return parsed.map((e) => ({...e, start: new Date(e.start), end: new Date(e.end)}))
                }
                return JSON.parse(storedValue);
            }
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
        }
        return defaultValue;
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error writing to localStorage key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState];
};

const Desktop = ({ onLogout }) => {
    const { setLanguage } = useLocalization();
    const [widgets, setWidgets] = usePersistentState('studypro-widgets', defaultWidgets);
    const [tasks, setTasks] = usePersistentState('studypro-tasks', initialTasks);
    const [habits, setHabits] = usePersistentState('studypro-habits', initialHabits);
    const [journalEntries, setJournalEntries] = usePersistentState('studypro-journal', []);
    const [calendarEvents, setCalendarEvents] = usePersistentState('studypro-calendar-events', []);
    
    // Prompt for language change on first load if OS language is Chinese or Japanese
    useEffect(() => {
        const userLang = navigator.language || (navigator).userLanguage;
        if (localStorage.getItem('langPrompted') !== 'true') {
            if (userLang.startsWith('zh')) {
                if (window.confirm('检测到您的系统语言为中文。是否切换应用语言为中文？')) {
                    setLanguage('zh');
                }
            } else if (userLang.startsWith('ja')) {
                if (window.confirm('システムの言語が日本語に設定されています。アプリケーションの言語を日本語に切り替えますか？')) {
                    setLanguage('ja');
                }
            }
            localStorage.setItem('langPrompted', 'true');
        }
    }, [setLanguage]);

    const checkWidgetBounds = useCallback(() => {
        const desktop = document.getElementById('desktop-container');
        if (!desktop) return;

        const rect = desktop.getBoundingClientRect();
        
        setWidgets(currentWidgets => {
            let needsUpdate = false;
            const updatedWidgets = currentWidgets.map(w => {
                const maxX = rect.width - w.size.width;
                const newX = Math.max(0, Math.min(w.position.x, maxX));
                
                // Ensure the widget's HEADER is within the draggable vertical area
                const maxY = rect.height - WIDGET_HEADER_HEIGHT - DOCK_AREA_HEIGHT;
                const newY = Math.max(0, Math.min(w.position.y, maxY));

                if (newX !== w.position.x || newY !== w.position.y) {
                    needsUpdate = true;
                    return { ...w, position: { x: newX, y: newY } };
                }
                return w;
            });
            
            return needsUpdate ? updatedWidgets : currentWidgets;
        });
    }, [setWidgets]);

    // Ensure widgets are within bounds on load and resize
    useEffect(() => {
        checkWidgetBounds(); // Initial check
        window.addEventListener('resize', checkWidgetBounds);
        return () => {
            window.removeEventListener('resize', checkWidgetBounds);
        };
    }, [checkWidgetBounds]);

    const bringToFront = (id) => {
        setWidgets(currentWidgets => {
            const maxZ = Math.max(0, ...currentWidgets.map(w => w.zIndex));
            const targetWidget = currentWidgets.find(w => w.id === id);

            if (targetWidget && targetWidget.zIndex === maxZ && currentWidgets.length > 1) {
                return currentWidgets;
            }
            
            return currentWidgets.map(w => 
                w.id === id ? { ...w, zIndex: maxZ + 1 } : w
            );
        });
    };

    const openWidget = useCallback((widgetType) => {
        const existingWidget = widgets.find(w => w.type === widgetType);
        if (existingWidget) {
            bringToFront(existingWidget.id);
            return;
        }

        setWidgets(prevWidgets => {
            const maxZ = Math.max(0, ...prevWidgets.map(w => w.zIndex));
            
            const desktopContainer = document.getElementById('desktop-container');
            const containerRect = desktopContainer ? desktopContainer.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight, top: 0, left: 0 };
            
            const newWidgetSize = WIDGET_DEFAULT_SIZES[widgetType] || { width: 550, height: 500 };

            const x = Math.max(20, Math.min(
                (Math.random() * (containerRect.width - newWidgetSize.width - 40)) + 20, 
                containerRect.width - newWidgetSize.width - 20
            ));
            const y = Math.max(20, Math.min(
                (Math.random() * (containerRect.height - newWidgetSize.height - 100)) + 20, 
                containerRect.height - newWidgetSize.height - 20
            ));

            const newWidget = {
                id: `${widgetType}-${Date.now()}`,
                type: widgetType,
                position: { x, y },
                size: newWidgetSize,
                zIndex: maxZ + 1,
            };
            return [...prevWidgets, newWidget];
        });
    }, [widgets, setWidgets]);

    const closeWidget = (id) => {
        setWidgets(widgets.filter(w => w.id !== id));
    };

    const updateWidget = (id, updates) => {
        setWidgets(widgets.map(w => w.id === id ? { ...w, ...updates } : w));
    };

    const getWidgetProps = (widget) => {
        switch (widget.type) {
            case 'tasks': return { tasks, setTasks };
            case 'schedule': return { tasks, events: calendarEvents, setEvents: setCalendarEvents };
            case 'habits': return { habits, setHabits };
            case 'journal': return { entries: journalEntries, setEntries: setJournalEntries };
            default: return {};
        }
    };

    return (
        <div className="h-screen w-full flex flex-col">
            <TopBar onLogout={onLogout} />
            <main className="flex-1 relative" id="desktop-container">
                {widgets.map((widget) => {
                    const WidgetComponent = componentMap[widget.type];
                    if (!WidgetComponent) return null;
                    const specificProps = getWidgetProps(widget);
                    return (
                        <Widget
                            key={widget.id}
                            id={widget.id}
                            title={widget.type}
                            initialPosition={widget.position}
                            initialSize={widget.size}
                            zIndex={widget.zIndex}
                            onClose={closeWidget}
                            onFocus={bringToFront}
                            onUpdate={updateWidget}
                        >
                            <WidgetComponent {...specificProps} />
                        </Widget>
                    );
                })}
            </main>
            <Dock onWidgetSelect={openWidget} openWidgets={widgets.map(w => w.type)} />
        </div>
    );
};

export default Desktop;
