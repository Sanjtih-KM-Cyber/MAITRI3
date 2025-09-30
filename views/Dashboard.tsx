import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CompanionWidget from '../components/dashboard/widgets/CompanionWidget';
import PsycheStateMatrix from '../components/guardian/PsycheStateMatrix';
import MissionCadence from '../components/dashboard/widgets/MissionCadence';
import EarthLink from '../components/dashboard/widgets/EarthLink';
import SettingsPanel from '../components/SettingsPanel';


interface DashboardProps {
  userName: string;
  onNavigateToChat: () => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userName, onNavigateToChat, onLogout }) => {
    const { t } = useTranslation();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex flex-col h-full animate-fade-in">
        <header className="mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-bold text-primary-text-color">{t('dashboard.welcome', { name: userName })}</h1>
                <p className="text-lg text-secondary-text-color">{t('dashboard.subtitle')}</p>
            </div>
            <div>
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    aria-label={t('settings.title')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <CompanionWidget 
                className="md:col-span-2 lg:col-span-2 row-span-2"
                onClick={onNavigateToChat}
            />

            <PsycheStateMatrix />

            <EarthLink />
            
            <MissionCadence className="lg:col-span-2" />
        </div>

        {isSettingsOpen && <SettingsPanel onClose={() => setIsSettingsOpen(false)} onLogout={onLogout} />}
    </div>
  );
};

export default Dashboard;
