import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import GlassWidget from '../../GlassWidget';

const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    return `${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
};

const EarthLink: React.FC = () => {
    const { t } = useTranslation();
    const initialSeconds = 4 * 3600 + 12 * 60;
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

    useEffect(() => {
        if (secondsLeft <= 0) return;

        const intervalId = setInterval(() => {
            setSecondsLeft(secondsLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [secondsLeft]);


  return (
    <GlassWidget className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{t('dashboard.earthLink.title')}</h3>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary-text-color" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.758 16.586l.002-.001M16.242 16.586l-.002-.001M12 19.586V21M12 3v1.586m0 0v2.065m0-2.065a2 2 0 012 2v2.5a2 2 0 01-2 2H8a2 2 0 01-2-2v-2.5a2 2 0 012-2z" />
        </svg>
      </div>
      <p className="text-2xl font-mono tracking-wider text-[var(--primary-accent-color)]">{formatTime(secondsLeft)}</p>
      <p className="text-xs text-secondary-text-color mt-1">{t('dashboard.earthLink.subtitle')}</p>
    </GlassWidget>
  );
};

export default EarthLink;