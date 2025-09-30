import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChat } from '../hooks/useChat';
import MessageBubble from '../components/chat/MessageBubble';
import SmartInput from '../components/chat/SmartInput';
import { AppStateContext } from '../context/AppStateContext';
import VoiceCommandHelper from '../components/chat/VoiceCommandHelper';

interface PlaymateViewProps {
  onNavigateToDashboard: () => void;
}

const PlaymateView: React.FC<PlaymateViewProps> = ({ onNavigateToDashboard }) => {
  const { t } = useTranslation();
  const { setActiveRole } = useContext(AppStateContext);
  const { messages, sendMessage, isLoading } = useChat();
  const [isCommandHelperOpen, setIsCommandHelperOpen] = useState(false);
  
  useEffect(() => {
    setActiveRole('playmate');
    // Reset to default when leaving the view
    return () => setActiveRole('companion');
  }, [setActiveRole]);

  return (
    <div className="flex flex-col h-full max-h-screen animate-fade-in">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button
            onClick={onNavigateToDashboard}
            aria-label={t('navigation.backToDashboard')}
            className="flex items-center text-secondary-text-color hover:text-primary-text-color transition-colors p-2 rounded-full -ml-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="ml-1 font-medium hidden sm:inline">{t('navigation.dashboard')}</span>
          </button>
          <h1 className="text-4xl font-bold text-primary-text-color ml-4">{t('roles.playmate')}</h1>
        </div>
        <button 
            onClick={() => setIsCommandHelperOpen(true)}
            className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            aria-label={t('chat.voiceCommands')}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 10c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4h-1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5v.01" />
            </svg>
        </button>
      </header>
      <main className="flex-grow overflow-y-auto pr-2 space-y-4">
        <MessageBubble text="Hi there! Ready to play a game? We could play 'Cosmic Chronicles', a storytelling adventure, or maybe some riddles. What are you in the mood for?" sender="maitri" />
        {messages.map((msg, index) => (
          <MessageBubble key={index} text={msg.text} sender={msg.sender} />
        ))}
        {isLoading && <MessageBubble text="..." sender="maitri" />}
      </main>
      <footer className="mt-4">
        <SmartInput onSend={sendMessage} disabled={isLoading} />
      </footer>
      {isCommandHelperOpen && <VoiceCommandHelper onClose={() => setIsCommandHelperOpen(false)} />}
    </div>
  );
};

export default PlaymateView;