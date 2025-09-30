import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GlassWidget from '../GlassWidget';
import { useMissionData } from '../../hooks/useMissionData';
import { Workout } from '../../types';

interface MassProtocolProps {
    onStartWorkout: (workout: Workout) => void;
}

const MassProtocol: React.FC<MassProtocolProps> = ({ onStartWorkout }) => {
  const { t } = useTranslation();
  const { missionData } = useMissionData();
  const [completed, setCompleted] = useState<string[]>([]);

  const toggleExercise = (id: string) => {
    setCompleted(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <GlassWidget className="p-6">
      <h3 className="font-semibold mb-3">{t('guardian.massProtocolTitle')}</h3>
      <ul className="space-y-3">
        {missionData.workoutPlan.map(exercise => (
          <li key={exercise.id} className="flex items-center justify-between">
            <div className="flex items-center">
                <input
                  type="checkbox"
                  id={exercise.id}
                  checked={completed.includes(exercise.id)}
                  onChange={() => toggleExercise(exercise.id)}
                  className="h-5 w-5 rounded bg-transparent border-2 border-secondary-text-color text-[var(--primary-accent-color)] focus:ring-[var(--primary-accent-color)]"
                />
                <label
                  htmlFor={exercise.id}
                  className={`ml-3 text-primary-text-color ${
                    completed.includes(exercise.id) ? 'line-through text-secondary-text-color' : ''
                  }`}
                >
                  {exercise.name}
                </label>
            </div>
            <button onClick={() => onStartWorkout(exercise)} className="text-xs font-semibold bg-white/10 px-2 py-1 rounded hover:bg-white/20">
                {t('guardian.start')}
            </button>
          </li>
        ))}
      </ul>
    </GlassWidget>
  );
};

export default MassProtocol;
