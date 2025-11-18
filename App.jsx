import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ThemeContext, THEMES, WALLPAPERS } from './hooks/useDarkMode.js';
import { LocalizationProvider } from './hooks/useLocalization.jsx';
import Login from './components/Login.jsx';
import Desktop from './components/Desktop.jsx';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // --- Theme Provider Logic ---
    const [mode, setMode] = useState(() => localStorage.getItem('mode') || 'light');
    const [colorTheme, setColorThemeState] = useState(() => localStorage.getItem('colorTheme') || 'blue');
    const [wallpaper, setWallpaperState] = useState(() => localStorage.getItem('wallpaper') || 'default');

    const toggleMode = useCallback(() => {
        setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
    }, []);
    
    const setColorTheme = useCallback((theme) => {
        setColorThemeState(theme);
    }, []);
    
    const setWallpaper = useCallback((wallpaper) => {
        setWallpaperState(wallpaper);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        // Handle light/dark mode
        root.classList.remove(mode === 'light' ? 'dark' : 'light');
        root.classList.add(mode);
        localStorage.setItem('mode', mode);
        // Handle color theme
        Object.keys(THEMES).forEach(themeKey => {
            root.classList.remove(`theme-${themeKey}`);
        });
        root.classList.add(`theme-${colorTheme}`);
        localStorage.setItem('colorTheme', colorTheme);
        // Handle wallpaper
        const wallpaperUrls = WALLPAPERS[wallpaper];
        if (wallpaperUrls) {
            root.style.setProperty('--wallpaper-light', `url('${wallpaperUrls.light}')`);
            root.style.setProperty('--wallpaper-dark', `url('${wallpaperUrls.dark}')`);
        }
        localStorage.setItem('wallpaper', wallpaper);
    }, [mode, colorTheme, wallpaper]);

    const themeValue = useMemo(() => ({
        mode,
        toggleMode,
        colorTheme,
        setColorTheme,
        wallpaper,
        setWallpaper
    }), [mode, toggleMode, colorTheme, setColorTheme, wallpaper, setWallpaper]);
    // --- End Theme Provider Logic ---

    const MainApp = () => {
        if (!isAuthenticated) {
            return <Login onLogin={() => setIsAuthenticated(true)} />;
        }
        return <Desktop onLogout={() => setIsAuthenticated(false)} />;
    };
    
    return (
        <ThemeContext.Provider value={themeValue}>
            <LocalizationProvider>
                <MainApp />
            </LocalizationProvider>
        </ThemeContext.Provider>
    );
};

export default App;
