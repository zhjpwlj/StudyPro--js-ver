// Fix: Add missing import for React types to resolve 'Cannot find namespace React' error.
import type { FC, SVGProps } from 'react';

export type Theme = 'light' | 'dark';

export type Language = 'en' | 'zh' | 'ja';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string; // ISO date string
  course: string;
  parentId: number | null; // null for top-level tasks
}

export interface Habit {
  id: number;
  name: string;
  streak: number;
  lastCompleted: string | null; // ISO date string
  history: string[]; // Array of ISO date strings
}

export interface NavItem {
  key: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  children?: NavItem[];
}

export interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO String
  title: string;
  content: string; // Markdown content
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'awful';
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export type WidgetType = 'tasks' | 'habits' | 'pomodoro' | 'journal' | 'schedule' | 'chatbot' | 'clock' | 'calculator' | 'weather' | 'ambiance' | 'settings';

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export type PomodoroMode = 'pomodoro' | 'shortBreak' | 'longBreak';