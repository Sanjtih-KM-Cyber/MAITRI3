import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface OnboardingViewProps {
  onComplete: (name: string) => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-fade-in">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-primary-text-color mb-4">
          {t('onboarding.title')}
        </h1>
        <p className="text-xl text-secondary-text-color mb-8">
          {t('onboarding.prompt')}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('onboarding.placeholder')}
            className="w-full text-center text-2xl bg-transparent border-b-2 border-[var(--widget-border-color)] focus:outline-none focus:border-[var(--primary-accent-color)] py-3 mb-8 transition-colors"
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-8 py-3 bg-[var(--primary-accent-color)] text-white text-lg font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {t('onboarding.button')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingView;
