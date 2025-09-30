import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { View } from './types';

import Dashboard from './views/Dashboard';
import CompanionView from './views/CompanionView';
import GuardianView from './views/GuardianView';
import CoPilotView from './views/CoPilotView';
import StorytellerView from './views/StorytellerView';
import PlaymateView from './views/PlaymateView';
import TacticalDial from './components/nav/TacticalDial';
import { voiceService } from './services/voiceService';
import { commandService } from './services/commandService';
import { useDraggable } from './hooks/useDraggable';
// import LoginView from './views/LoginView'; // Commented out for now

const SanctuaryComponent: React.FC = () => {
    const { isSanctuaryActive, setSanctuaryActive, sanctuaryMemory } = useTheme();
    if (!isSanctuaryActive) return null;

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center animate-fade-in" onClick={() => setSanctuaryActive(false)}>
            <h2 className="text-3xl font-bold text-white mb-4">Sanctuary Active</h2>
            {sanctuaryMemory && <p className="text-lg text-gray-300 max-w-lg text-center">"{sanctuaryMemory}"</p>}
            <p className="text-sm text-gray-500 mt-8">Click anywhere to exit</p>
        </div>
    );
};

const VideoFeed: React.FC = () => {
    const { videoRef } = useAppState();
    const { showVideoFeed } = useSettings();
    const { position, dragHandlers, isDragging } = useDraggable(
        { x: 16, y: 16 }, // Initial position (top-4 left-4)
        { width: 192, height: 144 } // w-48, h-36
    );

    return (
        <video 
            ref={videoRef}
            {...dragHandlers}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            className={`fixed w-48 h-36 rounded-lg object-cover border-2 border-white/20 transition-opacity duration-300 z-50 ${showVideoFeed ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${isDragging ? 'cursor-grabbing shadow-2xl shadow-[var(--glow-color)]' : 'cursor-grab'}`}
            playsInline 
            muted 
        />
    );
}


const AppContent: React.FC<{ userName: string; onLogout: () => void }> = ({ userName, onLogout }) => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [chatPrompt, setChatPrompt] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const navigateToView = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  const navigateToChatWithPrompt = useCallback((prompt: string) => {
    setChatPrompt(prompt);
    setCurrentView('chat');
  }, []);

  useEffect(() => {
    const handleGlobalVoiceCommand = (transcript: string) => {
      const command = commandService.parse(transcript);
      if (command) {
        const target = command.split('open ')[1];
        let view: View | null = null;
        switch (target) {
          case 'dashboard': view = 'dashboard'; break;
          case 'chat': view = 'chat'; break;
          case 'guardian': view = 'guardian'; break;
          case 'co-pilot': view = 'coPilot'; break;
          case 'storyteller': view = 'storyteller'; break;
          case 'playmate': view = 'playmate'; break;
          default: break;
        }
        if (view) {
          navigateToView(view);
        }
      }
    };

    voiceService.startListening(handleGlobalVoiceCommand);

    return () => {
      voiceService.stopListening();
    };
  }, [navigateToView]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard userName={userName} onNavigateToChat={() => navigateToView('chat')} onLogout={onLogout} />;
      case 'chat':
        return <CompanionView onNavigateToDashboard={() => navigateToView('dashboard')} initialPrompt={chatPrompt} />;
      case 'guardian':
        return <GuardianView onNavigateToDashboard={() => navigateToView('dashboard')} />;
      case 'coPilot':
        return <CoPilotView onNavigateToDashboard={() => navigateToView('dashboard')} />;
      case 'storyteller':
        return <StorytellerView onNavigateToDashboard={() => navigateToView('dashboard')} />;
      case 'playmate':
        return <PlaymateView onNavigateToDashboard={() => navigateToView('dashboard')} />;
      default:
        return <Dashboard userName={userName} onNavigateToChat={() => navigateToView('chat')} onLogout={onLogout} />;
    }
  };

  return (
    <AppStateProvider videoRef={videoRef} navigateToChatWithPrompt={navigateToChatWithPrompt}>
      <div className="bg-background-color text-primary-text-color min-h-screen font-sans p-6 md:p-8 relative">
        <VideoFeed />
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
        <TacticalDial onRoleSelect={navigateToView} />
        <SanctuaryComponent />
      </div>
    </AppStateProvider>
  );
};


const App: React.FC = () => {
    // const [user, setUser] = useState<{name: string} | null>(null);

    // const handleLogin = (name: string) => {
    //     setUser({ name });
    // };

    // const handleLogout = () => {
    //     setUser(null);
    // };
    
    return (
        <ThemeProvider>
            <SettingsProvider>
                {/* {user ? ( */}
                    <AppContent userName="Captain" onLogout={() => alert('Logout functionality is currently disabled.')} />
                {/* ) : (
                    <LoginView onLogin={handleLogin} />
                )} */}
            </SettingsProvider>
        </ThemeProvider>
    );
};

export default App;