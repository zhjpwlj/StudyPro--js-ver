import { createContext, useContext } from 'react';

export const THEMES = {
    'blue': { name: 'StudyPro Blue', color: 'bg-blue-500' },
    'rose': { name: 'Sunset Rose', color: 'bg-rose-500' },
    'emerald': { name: 'Mint Emerald', color: 'bg-emerald-500' },
};

export const WALLPAPERS = {
    'default': { 
        name: 'Default Gradient', 
        light: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2940&auto=format&fit=crop', 
        dark: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?q=80&w=2859&auto=format&fit=crop'
    },
    'mountain': { 
        name: 'Mountain Peak', 
        light: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=2940&auto=format&fit=crop', 
        dark: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop'
    },
     'abstract': { 
        name: 'Abstract Curves', 
        light: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2832&auto=format&fit=crop',
        dark: 'https://images.unsplash.com/photo-1554034483-04fda0d3507b?q=80&w=2940&auto=format&fit=crop'
    },
};

export const ThemeContext = createContext(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
