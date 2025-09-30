import React, { createContext, useState, ReactNode, RefObject, useContext } from 'react';
import { Role, AppStateContextType } from '../types';

export const AppStateContext = createContext<AppStateContextType>({
  activeRole: 'companion',
  setActiveRole: () => {},
  videoRef: { current: null },
  navigateToChatWithPrompt: () => {},
});

interface AppStateProviderProps {
  children: ReactNode;
  videoRef: RefObject<HTMLVideoElement>;
  navigateToChatWithPrompt: (prompt: string) => void;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children, videoRef, navigateToChatWithPrompt }) => {
  const [activeRole, setActiveRole] = useState<Role>('companion');

  const value = {
    activeRole,
    setActiveRole,
    videoRef,
    navigateToChatWithPrompt,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

// Convenience hook for consuming the context
export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
