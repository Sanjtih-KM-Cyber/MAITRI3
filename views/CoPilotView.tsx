import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ProcedureAssistant from '../components/copilot/ProcedureAssistant';
import MessageBubble from '../components/chat/MessageBubble';
import SmartInput from '../components/chat/SmartInput';
import GlassWidget from '../components/GlassWidget';
import { useMissionData } from '../hooks/useMissionData';
import { localAIService } from '../services/localAIService';
import { AppStateContext } from '../context/AppStateContext';
import { useNotificationScheduler } from '../hooks/useNotificationScheduler';
import VoiceCommandHelper from '../components/chat/VoiceCommandHelper';

interface CoPilotViewProps {
  onNavigateToDashboard: () => void;
}

interface CadenceTask {
  time: string;
  task: string;
}

const CoPilotView: React.FC<CoPilotViewProps> = ({ onNavigateToDashboard }) => {
  const { t } = useTranslation();
  const { setActiveRole } = useContext(AppStateContext);
  const { missionData } = useMissionData();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tomorrowsCadence, setTomorrowsCadence] = useState<CadenceTask[]>([]);
  const [isCommandHelperOpen, setIsCommandHelperOpen] = useState(false);
  
  const { activeAlert } = useNotificationScheduler(missionData.missionCadence);

  useEffect(() => {
    setActiveRole('coPilot');
    return () => setActiveRole('companion');
  }, [setActiveRole]);
  
  const handleSendMessage = async (message: string) => {
    const userMessage = { text: message, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    const response = await localAIService.runCoPilotMAITRI(message);
    setIsLoading(false);

    if (response.startsWith("JSON:")) {
      try {
        const jsonString = response.substring(5);
        const newTask: CadenceTask = JSON.parse(jsonString);
        setTomorrowsCadence(prev => [...prev, newTask].sort((a, b) => a.time.localeCompare(b.time)));
        const confirmationMsg = { text: `OK, I've added "${newTask.task}" to tomorrow's schedule at ${newTask.time}.`, sender: 'maitri' };
        setMessages(prev => [...prev, confirmationMsg]);
      } catch (e) {
        console.error("Failed to parse AI schedule JSON", e);
        const errorMsg = { text: "I tried to update the schedule but something went wrong. Please try again.", sender: 'maitri' };
        setMessages(prev => [...prev, errorMsg]);
      }
    } else {
       const maitriMessage = { text: response, sender: 'maitri' };
       setMessages(prev => [...prev, maitriMessage]);
    }
  };


  return (
    <div className="flex flex-col h-full animate-fade-in">
       <header className="flex items-center justify-between mb-8">
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
            <h1 className="text-4xl font-bold text-primary-text-color ml-4">{t('roles.coPilot')}</h1>
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
       <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          {activeAlert && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl p-4 bg-yellow-500/80 border-2 border-yellow-300 rounded-lg text-center text-black font-semibold animate-pulse z-10">
                {activeAlert}
            </div>
          )}
          <ProcedureAssistant />

          <div className="flex flex-col h-full">
            <GlassWidget className="p-6 flex-grow flex flex-col">
              <h3 className="font-semibold mb-3">{t('copilot.schedulerTitle')}</h3>
              <div className="flex-grow overflow-y-auto pr-2 space-y-2 mb-4">
                  <MessageBubble text={t('copilot.schedulerPrompt')} sender="maitri" />
                  {messages.map((msg, index) => <MessageBubble key={index} text={msg.text} sender={msg.sender} />)}
                  {isLoading && <MessageBubble text="..." sender="maitri" />}
              </div>
               <SmartInput onSend={handleSendMessage} disabled={isLoading} />
            </GlassWidget>
            <GlassWidget className="p-6 mt-6">
                <h3 className="font-semibold mb-3">{t('copilot.tomorrowsCadence')}</h3>
                {tomorrowsCadence.length === 0 ? (
                  <p className="text-sm text-secondary-text-color">{t('copilot.noTasks')}</p>
                ) : (
                  <ul className="space-y-2">
                    {tomorrowsCadence.map((item, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-mono text-[var(--primary-accent-color)] mr-3">{item.time}</span>
                        <span>{item.task}</span>
                      </li>
                    ))}
                  </ul>
                )}
            </GlassWidget>
          </div>
       </main>
       {isCommandHelperOpen && <VoiceCommandHelper onClose={() => setIsCommandHelperOpen(false)} />}
    </div>
  );
};
export default CoPilotView;