import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import MassProtocol from '../components/guardian/MassProtocol';
import SymptomLogger from '../components/guardian/SymptomLogger';
import PsycheStateMatrix from '../components/guardian/PsycheStateMatrix';
import { useTheme } from '../context/ThemeContext';
import GlassWidget from '../components/GlassWidget';
import { AppStateContext } from '../context/AppStateContext';
import PomodoroWidget from '../components/widgets/PomodoroWidget';
import { Workout } from '../types';
import { usePsycheState } from '../hooks/usePsycheState';

interface GuardianViewProps {
  onNavigateToDashboard: () => void;
}

interface LoggedSymptom {
    symptom: string;
    photo?: string;
    timestamp: string;
}

const GuardianView: React.FC<GuardianViewProps> = ({ onNavigateToDashboard }) => {
  const { t } = useTranslation();
  const { setSanctuaryActive } = useTheme();
  const { navigateToChatWithPrompt } = useContext(AppStateContext);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [loggedSymptoms, setLoggedSymptoms] = useState<LoggedSymptom[]>([]);
  const { wellness } = usePsycheState();
  const [uplinkStatus, setUplinkStatus] = useState<string>('');


  const handleSymptomLogged = (symptom: string, photo?: string) => {
    // Add to local list for uplink
    setLoggedSymptoms(prev => [...prev, { symptom, photo, timestamp: new Date().toISOString() }]);

    // Navigate to chat for immediate guidance
    let prompt = `The user has logged a new symptom: "${symptom}".`;
    if (photo) {
        prompt += ` They have also attached a photo for visual analysis. Please analyze the image and the description, ask clarifying questions, and provide immediate, calming guidance.`;
    } else {
        prompt += ` Please ask clarifying questions and provide immediate, calming guidance.`
    }
    navigateToChatWithPrompt(prompt);
  };
  
  const handleStartWorkout = (workout: Workout) => {
    setActiveWorkout(workout);
  };
  
  const handleClosePomodoro = () => {
    setActiveWorkout(null);
  };

  const handleUplink = async () => {
    setUplinkStatus('Transmitting...');
    const dailyReport = {
        timestamp: new Date().toISOString(),
        wellness_summary: wellness,
        symptoms: loggedSymptoms,
    };
    try {
        const response = await fetch('http://localhost:3001/api/uplink', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dailyReport),
        });
        if (!response.ok) throw new Error('Uplink failed');
        const result = await response.json();
        setUplinkStatus(`Success: ${result.message}`);
        setLoggedSymptoms([]); // Clear logs after successful uplink
    } catch (error) {
        setUplinkStatus('Error: Transmission failed.');
        console.error('Uplink error:', error);
    }
     setTimeout(() => setUplinkStatus(''), 5000);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {activeWorkout && <PomodoroWidget workout={activeWorkout} onClose={handleClosePomodoro} />}
      <header className="flex items-center mb-8">
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
        <h1 className="text-4xl font-bold text-primary-text-color ml-4">{t('roles.guardian')}</h1>
      </header>
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <SymptomLogger onSymptomLogged={handleSymptomLogged} />
        </div>
        <div className="space-y-6">
            <PsycheStateMatrix />
            <MassProtocol onStartWorkout={handleStartWorkout} />
            <GlassWidget className="p-4">
                <h3 className="font-semibold text-base mb-2">Data Uplink</h3>
                <p className="text-sm text-secondary-text-color mb-3">{loggedSymptoms.length} unsent symptom log(s).</p>
                <button
                    onClick={handleUplink}
                    disabled={!loggedSymptoms.length || !!uplinkStatus}
                    className="w-full px-4 py-2 bg-white/10 text-primary-text-color rounded-lg text-sm font-semibold hover:bg-white/20 disabled:opacity-50"
                >
                    {uplinkStatus || 'Transmit Daily Report'}
                </button>
            </GlassWidget>
            <GlassWidget className="p-4">
              <h3 className="font-semibold text-base mb-2">{t('guardian.sleepOptimizerTitle')}</h3>
              <p className="text-sm text-secondary-text-color mb-3">{t('guardian.sleepOptimizerDesc')}</p>
              <button
                  onClick={() => setSanctuaryActive(true)}
                  className="w-full px-4 py-2 bg-white/10 text-primary-text-color rounded-lg text-sm font-semibold hover:bg-white/20"
              >
                  {t('guardian.startSleepSession')}
              </button>
            </GlassWidget>
        </div>
      </main>
    </div>
  );
};

export default GuardianView;