import React from 'react';
import { useTranslation } from 'react-i18next';
import GlassWidget from '../../GlassWidget';

const PsycheStateRing: React.FC = () => {
    const { t } = useTranslation();
    const percentage = 91;
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

  return (
    <GlassWidget className="p-6 flex flex-col items-center justify-center">
        <h3 className="font-semibold mb-4 text-center">{t('dashboard.psycheState.title')}</h3>
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-gray-700/50"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className="text-[var(--primary-accent-color)]"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-primary-text-color">{percentage}</span>
                <span className="text-sm font-medium text-secondary-text-color">{t('dashboard.psycheState.status')}</span>
            </div>
        </div>
    </GlassWidget>
  );
};

export default PsycheStateRing;