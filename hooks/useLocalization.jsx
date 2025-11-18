import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { translations } from '../constants.js';

const LocalizationContext = createContext(undefined);

export const LocalizationProvider = ({ children }) => {
    const [language, setLanguageState] = useState(() => {
        return localStorage.getItem('language') || 'en';
    });

    const setLanguage = (lang) => {
        localStorage.setItem('language', lang);
        setLanguageState(lang);
    };

    const t = useCallback((key) => {
        return translations[key]?.[language] || key;
    }, [language]);

    const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

    return (
        <LocalizationContext.Provider value={value}>
            {children}
        </LocalizationContext.Provider>
    );
};

export const useLocalization = () => {
    const context = useContext(LocalizationContext);
    if (!context) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};
