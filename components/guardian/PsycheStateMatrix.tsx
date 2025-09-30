import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePsycheState } from '../../hooks/usePsycheState';
import GlassWidget from '../GlassWidget';

const PsycheStateMatrix: React.FC = () => {
  const { t } = useTranslation();
  const { wellness, isInitializing, error } = usePsycheState();

  const getBarColor = (value: number) => {
    if (value > 75) return 'bg-red-500';
    if (value > 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <GlassWidget className="p-6">
      <h3 className="font-semibold mb-4">{t('guardian.psycheMatrixTitle')}</h3>
      
      {isInitializing && (
        <p className="text-sm text-secondary-text-color">{t('guardian.initializing')}</p>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {!isInitializing && !error && (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-sm font-medium">{t('guardian.stress')}</label>
              <span className="text-lg font-bold">{wellness.stress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${getBarColor(wellness.stress)}`}
                style={{ width: `${wellness.stress}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-sm font-medium">{t('guardian.fatigue')}</label>
              <span className="text-lg font-bold">{wellness.fatigue.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${getBarColor(wellness.fatigue)}`}
                style={{ width: `${wellness.fatigue}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </GlassWidget>
  );
};

export default PsycheStateMatrix;
