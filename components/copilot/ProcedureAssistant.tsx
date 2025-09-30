import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import GlassWidget from '../GlassWidget';
import { voiceService } from '../../services/voiceService';

interface ProcedureStep {
  id: number;
  title: string;
  details: string;
}

const ProcedureAssistant: React.FC = () => {
  const { t } = useTranslation();
  const [steps, setSteps] = useState<ProcedureStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1); // -1 for start screen
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/mission-checklist.json')
      .then(res => res.json())
      .then(data => {
        setSteps(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load mission checklist", err);
        setIsLoading(false);
      });
  }, []);

  const handleNext = () => setCurrentStepIndex(prev => Math.min(prev + 1, steps.length));
  
  const announceStep = (step: ProcedureStep) => {
    voiceService.speak(`Step ${step.id}: ${step.title}. ${step.details}`);
  };

  // Announce step when it changes
  useEffect(() => {
    const currentStep = steps[currentStepIndex];
    if (currentStep) {
        announceStep(currentStep);
    }
  }, [currentStepIndex, steps]);

  // Voice command listener
  useEffect(() => {
    const isInteractiveStep = currentStepIndex > -1 && currentStepIndex < steps.length;
    if (!isInteractiveStep) return;

    const handleVoiceResult = (transcript: string) => {
        const lowerTranscript = transcript.toLowerCase();
        if (lowerTranscript.includes('confirm')) {
            handleNext();
        } else if (lowerTranscript.includes('repeat')) {
            const currentStep = steps[currentStepIndex];
            if (currentStep) {
                announceStep(currentStep);
            }
        }
    };
    
    // Use the global listener but set a specific callback for this view
    voiceService.startListening(handleVoiceResult);
    
    // We don't return a cleanup function here, as voiceService is a singleton.
    // The App component manages its lifecycle.
  }, [currentStepIndex, steps]);

  const handleStart = () => setCurrentStepIndex(0);
  const handlePrev = () => setCurrentStepIndex(prev => Math.max(0, prev - 1));

  if (isLoading) {
    return <GlassWidget className="p-6 text-center">{t('copilot.loading')}</GlassWidget>;
  }

  const isStarted = currentStepIndex > -1;
  const isFinished = currentStepIndex >= steps.length;
  const currentStep = steps[currentStepIndex];

  return (
    <GlassWidget className="p-8 flex flex-col h-full">
      <h2 className="text-2xl font-semibold mb-4 text-center">{t('copilot.assistantTitle')}</h2>
      
      {!isStarted && (
        <div className="m-auto text-center">
            <p className="mb-4 text-secondary-text-color">{t('copilot.startPrompt')}</p>
            <button onClick={handleStart} className="px-6 py-3 bg-[var(--primary-accent-color)] text-white rounded-lg font-semibold hover:opacity-90">{t('copilot.start')}</button>
        </div>
      )}

      {isStarted && !isFinished && currentStep && (
         <div className="flex flex-col flex-grow">
            <div className="flex-grow">
                <p className="text-sm text-[var(--primary-accent-color)] font-semibold">STEP {currentStep.id} / {steps.length}</p>
                <h3 className="text-3xl font-bold mt-1 mb-4">{currentStep.title}</h3>
                <p className="text-lg text-secondary-text-color whitespace-pre-line">{currentStep.details}</p>
                <p className="text-center mt-8 text-sm text-secondary-text-color">{t('copilot.voiceCommands')}</p>
            </div>
            <div className="flex justify-between mt-auto">
                <button onClick={handlePrev} disabled={currentStepIndex === 0} className="px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50">{t('copilot.previous')}</button>
                <button onClick={handleNext} className="px-4 py-2 bg-[var(--primary-accent-color)] text-white rounded-lg">{t('copilot.next')}</button>
            </div>
         </div>
      )}

      {isFinished && (
        <div className="m-auto text-center">
            <h3 className="text-3xl font-bold text-green-400">{t('copilot.completed')}</h3>
            <p className="text-secondary-text-color mt-2">{t('copilot.completedSubtitle')}</p>
        </div>
      )}
    </GlassWidget>
  );
};

export default ProcedureAssistant;
