import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ThemeContext, THEMES, WALLPAPERS, ColorTheme, Wallpaper } from './hooks/useDarkMode';
import { LocalizationProvider } from './hooks/useLocalization';
import Login from './components/Login';
import Desktop from './components/Desktop';
import type { Theme } from './types';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // --- Theme Provider Logic ---
    const [mode, setMode] = useState<Theme>(() => (localStorage.getItem('mode') as Theme) || 'light');
    const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => (localStorage.getItem('colorTheme') as ColorTheme) || 'blue');
    const [wallpaper, setWallpaperState] = useState<Wallpaper>(() => (localStorage.getItem('wallpaper') as Wallpaper) || 'default');

    const toggleMode = useCallback(() => {
        setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
    }, []);
    
    const setColorTheme = useCallback((theme: ColorTheme) => {
        setColorThemeState(theme);
    }, []);
    
    const setWallpaper = useCallback((wallpaper: Wallpaper) => {
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
