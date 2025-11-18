import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { useTheme, THEMES, WALLPAPERS } from '../hooks/useDarkMode';

const SettingsWidget: React.FC = () => {
    const { t, language, setLanguage } = useLocalization();
    const { colorTheme, setColorTheme, wallpaper, setWallpaper } = useTheme();
    const [activeTab, setActiveTab] = useState('appearance');

    const TabButton: React.FC<{tabKey: string; children: React.ReactNode}> = ({tabKey, children}) => (
         <button 
            onClick={() => setActiveTab(tabKey)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 ${activeTab === tabKey ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
        >
            {children}
        </button>
    )

    return (
        <div className="h-full flex flex-col">
            <div className="border-b border-gray-200/80 dark:border-gray-700/80">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <TabButton tabKey="appearance">{t('appearance')}</TabButton>
                    <TabButton tabKey="general">{t('general')}</TabButton>
                </nav>
            </div>
            <div className="flex-1 overflow-y-auto pt-6">
                {activeTab === 'appearance' && (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-md font-semibold mb-3">{t('accent_color')}</h3>
                            <div className="flex space-x-4">
                                {Object.entries(THEMES).map(([key, theme]) => (
                                    <button key={key} onClick={() => setColorTheme(key as keyof typeof THEMES)} className="flex flex-col items-center space-y-2">
                                        <div className={`w-10 h-10 rounded-full ${theme.color} ring-2 ${colorTheme === key ? 'ring-primary-500' : 'ring-transparent'}`}></div>
                                        <span className="text-xs">{theme.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                         <div>
                            <h3 className="text-md font-semibold mb-3">{t('wallpaper')}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(WALLPAPERS).map(([key, wp]) => (
                                     <button key={key} onClick={() => setWallpaper(key as keyof typeof WALLPAPERS)} className={`relative rounded-lg overflow-hidden aspect-video ring-2 ${wallpaper === key ? 'ring-primary-500' : 'ring-transparent'}`}>
                                        <img src={wp.light} alt={wp.name} className="w-full h-full object-cover"/>
                                        <div className="absolute inset-0 bg-black/30 flex items-end justify-center p-2">
                                            <p className="text-white text-xs font-semibold">{wp.name}</p>
                                        </div>
                                     </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                 {activeTab === 'general' && (
                    <div>
                        <h3 className="text-md font-semibold mb-3">Language</h3>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="en">English</option>
                            <option value="zh">中文</option>
                            <option value="ja">日本語</option>
                        </select>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default SettingsWidget;
