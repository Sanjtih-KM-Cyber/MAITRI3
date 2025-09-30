import React from 'react';
import { useTranslation } from 'react-i18next';
import GlassWidget from '../../GlassWidget';
import { useMissionData } from '../../../hooks/useMissionData';

const MissionCadence: React.FC<{className?: string}> = ({ className }) => {
  const { t } = useTranslation();
  const { missionData } = useMissionData();

  return (
    <GlassWidget className={`p-6 ${className}`}>
      <h3 className="font-semibold mb-3">{t('dashboard.missionCadence.title')}</h3>
      <ul className="space-y-3">
        {missionData.missionCadence.map((event) => (
          <li key={event.name} className="flex items-center">
            <div className="w-1 h-8 rounded-full mr-3 bg-blue-500"></div>
            <div>
              <p className="font-medium text-sm text-primary-text-color">{event.name}</p>
              <p className="text-xs text-secondary-text-color">{event.time} MET</p>
            </div>
          </li>
        ))}
      </ul>
    </GlassWidget>
  );
};

export default MissionCadence;
