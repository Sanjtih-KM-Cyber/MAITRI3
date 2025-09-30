import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from './context/ThemeContext';
import CompanionWidget from './components/dashboard/widgets/CompanionWidget';
import PsycheStateRing from './components/dashboard/widgets/PsycheStateRing';
import MissionCadence from './components/dashboard/widgets/MissionCadence';
import EarthLink from './components/dashboard/widgets/EarthLink';
import GlassWidget from './components/GlassWidget';


interface DashboardProps {
  onNavigateToChat: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToChat }) => {
    const { changeAccentColor } = useTheme();
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

  return (
    <div className="flex flex-col h-full animate-fade-in">
        <header className="mb-8">
            <h1 className="text-4xl font-bold text-primary-text-color">{t('dashboard.title')}</h1>
            <p className="text-lg text-secondary-text-color">{t('dashboard.subtitle')}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <CompanionWidget 
                className="md:col-span-2 lg:col-span-2 row-span-2"
                onClick={onNavigateToChat}
            />

            <PsycheStateRing />

            <MissionCadence />

            <EarthLink />
            
             <GlassWidget className="p-6">
                <h3 className="font-semibold mb-2">{t('dashboard.themeControl.title')}</h3>
                <p className="text-sm text-secondary-text-color mb-3">{t('dashboard.themeControl.accent')}</p>
                <div className="flex space-x-3">
                    <button aria-label={t('dashboard.themeControl.blueAria')} onClick={() => changeAccentColor('#4A90E2')} className="w-8 h-8 rounded-full bg-[#4A90E2] ring-2 ring-offset-2 ring-offset-[var(--background-color)] ring-transparent focus:ring-white transition-all"></button>
                    <button aria-label={t('dashboard.themeControl.redAria')} onClick={() => changeAccentColor('#E24A4A')} className="w-8 h-8 rounded-full bg-[#E24A4A] ring-2 ring-offset-2 ring-offset-[var(--background-color)] ring-transparent focus:ring-white transition-all"></button>
                    <button aria-label={t('dashboard.themeControl.greenAria')} onClick={() => changeAccentColor('#4AE290')} className="w-8 h-8 rounded-full bg-[#4AE290] ring-2 ring-offset-2 ring-offset-[var(--background-color)] ring-transparent focus:ring-white transition-all"></button>
                </div>

                <p className="text-sm text-secondary-text-color mt-4 mb-2">{t('dashboard.themeControl.language')}</p>
                <div className="flex space-x-2">
                    <button onClick={() => changeLanguage('en')} className={`px-3 py-1 text-sm rounded-md ${currentLang === 'en' ? 'bg-[var(--primary-accent-color)] text-white' : 'bg-white/10'}`}>EN</button>
                    <button onClick={() => changeLanguage('hi')} className={`px-3 py-1 text-sm rounded-md ${currentLang === 'hi' ? 'bg-[var(--primary-accent-color)] text-white' : 'bg-white/10'}`}>HI</button>
                </div>
            </GlassWidget>
        </div>
    </div>
  );
};

export default Dashboard;
