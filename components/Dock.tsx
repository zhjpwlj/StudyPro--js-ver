import React, { useState, useEffect, useRef } from 'react';
import { NAV_ITEMS } from '../constants';
import { useLocalization } from '../hooks/useLocalization';
import { WidgetType, NavItem } from '../types';

interface DockProps {
    onWidgetSelect: (widget: WidgetType) => void;
    openWidgets: WidgetType[];
}

const Dock: React.FC<DockProps> = ({ onWidgetSelect, openWidgets }) => {
    const { t } = useLocalization();
    const [openFolderKey, setOpenFolderKey] = useState<string | null>(null);
    const dockRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
                setOpenFolderKey(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleItemClick = (item: NavItem) => {
        if (item.children) {
            setOpenFolderKey(current => current === item.key ? null : item.key);
        } else {
            onWidgetSelect(item.key as WidgetType);
        }
    };
    
    const handleFolderItemClick = (widgetType: WidgetType) => {
        onWidgetSelect(widgetType);
        setOpenFolderKey(null);
    };

    const isFolderActive = (item: NavItem): boolean => {
        if (!item.children) return false;
        return item.children.some(child => openWidgets.includes(child.key as WidgetType));
    };

    return (
        <footer className="flex justify-center w-full absolute bottom-4 z-40">
            <div className="dock-container flex items-end h-20 p-2 space-x-2 rounded-2xl" ref={dockRef}>
                {NAV_ITEMS.map((item) => (
                    <div
                        key={item.key}
                        className="dock-item-container relative flex flex-col items-center"
                    >
                        {openFolderKey === item.key && item.children && (
                            <div className="absolute bottom-full mb-4 w-52 p-3 rounded-2xl dock-container grid grid-cols-3 gap-y-3 gap-x-2">
                                {item.children.map(child => (
                                     <div key={child.key} className="flex flex-col items-center text-center relative">
                                        <button
                                            onClick={() => handleFolderItemClick(child.key as WidgetType)}
                                            title={t(child.key)}
                                            className="dock-item bg-black/10 dark:bg-white/10 p-2 rounded-xl hover:scale-110 transition-transform"
                                        >
                                            <child.icon className="w-8 h-8 text-gray-700 dark:text-gray-200" />
                                        </button>
                                        <span className="text-xs mt-1 text-gray-800 dark:text-gray-200 capitalize truncate w-full">{t(child.key)}</span>
                                        {openWidgets.includes(child.key as WidgetType) && (
                                            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => handleItemClick(item)}
                            title={t(item.key)}
                            className="dock-item bg-black/10 dark:bg-white/10 p-3 rounded-xl"
                        >
                            <item.icon className="w-10 h-10 text-gray-700 dark:text-gray-200" />
                            <span className="sr-only">{t(item.key)}</span>
                        </button>
                        {(openWidgets.includes(item.key as WidgetType) || isFolderActive(item)) && (
                             <div className="w-1.5 h-1.5 bg-gray-600 dark:bg-gray-300 rounded-full mt-1.5"></div>
                        )}
                    </div>
                ))}
            </div>
        </footer>
    );
};

export default Dock;