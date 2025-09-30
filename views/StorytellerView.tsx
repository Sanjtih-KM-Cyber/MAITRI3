import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GlassWidget from '../components/GlassWidget';
import DigitalDiary from '../components/storyteller/DigitalDiary';
import Modal from '../components/Modal';
import { useTheme } from '../context/ThemeContext';

interface StorytellerViewProps {
  onNavigateToDashboard: () => void;
}

const StorytellerView: React.FC<StorytellerViewProps> = ({ onNavigateToDashboard }) => {
  const { t } = useTranslation();
  const { setSanctuaryActive } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memory, setMemory] = useState('');

  const handleActivateSanctuary = () => {
    setSanctuaryActive(true, memory);
    setIsModalOpen(false);
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
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
        <h1 className="text-4xl font-bold text-primary-text-color ml-4">{t('roles.storyteller')}</h1>
      </header>
      <main className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-full">
            <GlassWidget className="p-6 h-full">
                <DigitalDiary />
            </GlassWidget>
        </div>
        <div className="h-full">
            <GlassWidget className="p-6 h-full flex flex-col">
                <h3 className="text-xl font-semibold mb-3">{t('storyteller.sensoryTitle')}</h3>
                <p className="text-secondary-text-color text-sm mb-4 flex-grow">{t('storyteller.sensoryDesc')}</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full px-4 py-3 bg-[var(--primary-accent-color)] text-white rounded-lg font-semibold hover:opacity-90"
                >
                  {t('storyteller.activateSanctuary')}
                </button>
            </GlassWidget>
        </div>
      </main>
      {isModalOpen && (
        <Modal
          title={t('storyteller.modalTitle')}
          onClose={() => setIsModalOpen(false)}
        >
          <p className="text-secondary-text-color mb-4">{t('storyteller.modalDesc')}</p>
          <textarea
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            placeholder={t('storyteller.memoryPlaceholder')}
            rows={3}
            className="w-full bg-black/20 rounded-lg p-3 border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent-color)] resize-none mb-6"
          />
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white/10 rounded-lg">{t('storyteller.modalCancel')}</button>
            <button onClick={handleActivateSanctuary} className="px-4 py-2 bg-[var(--primary-accent-color)] text-white rounded-lg">{t('storyteller.modalConfirm')}</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StorytellerView;
