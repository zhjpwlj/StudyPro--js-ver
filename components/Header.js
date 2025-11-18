import React from 'react';
import { useLocalization } from '../hooks/useLocalization.js';
import { SunIcon, MoonIcon, LogoutIcon } from './icons/Icons.js';

const Header = ({ onLogout, theme, toggleTheme }) => {
    const { language, setLanguage, t } = useLocalization();

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    return (
        <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
                {/* Search bar can be added here */}
            </div>
            <div className="flex items-center space-x-4">
                <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                </select>

                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                </button>
                
                <div className="flex items-center space-x-3">
                    <img className="h-9 w-9 rounded-full object-cover" src="https://picsum.photos/100" alt="User avatar" />
                    <div>
                        <p className="text-sm font-medium">Alex Turner</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Student</p>
                    </div>
                </div>

                <button onClick={onLogout} title={t('logout')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <LogoutIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
            </div>
        </header>
    );
};

export default Header;