import React from 'react';
import { NAV_ITEMS } from '../constants.js';
import { useLocalization } from '../hooks/useLocalization.jsx';
import { BrainCircuitIcon } from './icons/Icons.jsx';

const Sidebar = ({ activeView, setActiveView }) => {
    const { t } = useLocalization();

    return (
        <div className="flex flex-col w-20 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 items-center py-4">
            <div className="flex-shrink-0 mb-10">
                <BrainCircuitIcon className="w-10 h-10 text-primary-500" />
            </div>
            <nav className="flex flex-col items-center space-y-4">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setActiveView(item.key)}
                        title={t(item.key)}
                        className={`p-3 rounded-xl transition-colors duration-200 ${
                            activeView === item.key
                                ? 'bg-primary-500 text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="sr-only">{t(item.key)}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
