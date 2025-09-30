import React from 'react';
import { useTranslation } from 'react-i18next';
import GlassWidget from '../../GlassWidget';

interface CompanionWidgetProps {
  className?: string;
  onClick: () => void;
}

const CompanionWidget: React.FC<CompanionWidgetProps> = ({ className, onClick }) => {
  const { t } = useTranslation();
  return (
    <GlassWidget
      className={`flex flex-col justify-center items-center p-8 cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <div className="w-24 h-24 mb-4 rounded-full border-2 border-[var(--primary-accent-color)] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--widget-border-color)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-[var(--primary-accent-color)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold mb-1 group-hover:text-[var(--primary-accent-color)] transition-colors">
        {t('dashboard.companionWidget.title')}
      </h2>
      <p className="text-secondary-text-color text-center">
        {t('dashboard.companionWidget.subtitle')}
      </p>
    </GlassWidget>
  );
};

export default CompanionWidget;