import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface SettingsContextType {
    notificationsEnabled: boolean;
    setNotificationsEnabled: (enabled: boolean) => void;
    maitriVoice: string;
    setMaitriVoice: (voice: string) => void;
    showVideoFeed: boolean;
    setShowVideoFeed: (show: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Custom hook to persist settings in localStorage
const usePersistentState = <T,>(key: string, defaultValue: T): [T, (value: T) => void] => {
    const [state, setState] = useState<T>(() => {
        try {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, state]);

    return [state, setState];
};


export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notificationsEnabled, setNotificationsEnabled] = usePersistentState<boolean>('settings:notifications', true);
    const [maitriVoice, setMaitriVoice] = usePersistentState<string>('settings:voice', 'default');
    const [showVideoFeed, setShowVideoFeed] = usePersistentState<boolean>('settings:videoFeed', false);

    const value = {
        notificationsEnabled,
        setNotificationsEnabled,
        maitriVoice,
        setMaitriVoice,
        showVideoFeed,
        setShowVideoFeed,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
