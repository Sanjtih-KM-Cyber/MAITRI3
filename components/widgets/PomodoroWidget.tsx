import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Workout } from '../../types';
import { voiceService } from '../../services/voiceService';
import { useSettings } from '../../context/SettingsContext';

interface PomodoroWidgetProps {
    workout: Workout;
    onClose: () => void;
}

const encouragingMessages = [
    "Keep pushing, you're doing great!",
    "Focus on your form, every rep counts.",
    "You're stronger than you think. Let's go!",
    "One more set! You've got this.",
    "Breathe. You are in control."
];

const PomodoroWidget: React.FC<PomodoroWidgetProps> = ({ workout, onClose }) => {
    const { t } = useTranslation();
    const { maitriVoice } = useSettings();
    const totalSeconds = workout.duration * 60;
    const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
    const [isActive, setIsActive] = useState(false);
    const milestonesSpokenRef = useRef<Set<number>>(new Set());

    const speakRandomMessage = useCallback(() => {
        const message = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
        voiceService.speak(message, maitriVoice);
    }, [maitriVoice]);

    // Effect to reset the timer when the workout prop changes
    useEffect(() => {
        setSecondsLeft(totalSeconds);
        setIsActive(false);
        milestonesSpokenRef.current.clear();
    }, [workout, totalSeconds]);


    useEffect(() => {
        let interval: number | null = null;
        if (isActive && secondsLeft > 0) {
            interval = window.setInterval(() => {
                setSecondsLeft(prev => prev - 1);
            }, 1000);
        } else if (isActive && secondsLeft === 0) {
            voiceService.speak(`${workout.name} complete. Well done!`, maitriVoice);
            setIsActive(false);
        }
        
        // Speak message at 25%, 50%, and 75% completion milestones.
        const milestones = {
            75: Math.floor(totalSeconds * 0.75),
            50: Math.floor(totalSeconds * 0.50),
            25: Math.floor(totalSeconds * 0.25),
        };

        if (isActive) {
            for (const [percent, time] of Object.entries(milestones)) {
                // Check if the current time matches a milestone that hasn't been spoken for yet.
                if (secondsLeft === time && !milestonesSpokenRef.current.has(Number(percent))) {
                    speakRandomMessage();
                    milestonesSpokenRef.current.add(Number(percent));
                    break; // Only speak once per second, even if milestones overlap
                }
            }
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, secondsLeft, workout.name, speakRandomMessage, totalSeconds, maitriVoice]);

    const toggle = () => setIsActive(!isActive);
    const reset = () => {
        setIsActive(false);
        setSecondsLeft(totalSeconds);
        milestonesSpokenRef.current.clear();
    };

    const percentage = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const seconds = (secondsLeft % 60).toString().padStart(2, '0');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[var(--widget-background-color)] border border-[var(--widget-border-color)] rounded-2xl shadow-lg p-8 w-full max-w-sm m-4 text-center">
                <h2 className="text-xl font-bold mb-2">{t('pomodoro.title')}</h2>
                <p className="text-secondary-text-color mb-6">{workout.name}</p>

                <div className="relative w-48 h-48 mx-auto mb-6">
                    <svg className="w-full h-full" viewBox="0 0 180 180">
                        <circle className="text-gray-700/50" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="90" cy="90" />
                        <circle
                            className="text-[var(--primary-accent-color)]"
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="90"
                            cy="90"
                            transform="rotate(-90 90 90)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl font-mono text-primary-text-color">{minutes}:{seconds}</span>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <button onClick={toggle} className="px-6 py-2 bg-[var(--primary-accent-color)] text-white rounded-lg font-semibold">
                        {isActive ? t('pomodoro.pause') : t('pomodoro.start')}
                    </button>
                    <button onClick={reset} className="px-4 py-2 bg-white/10 rounded-lg">{t('pomodoro.reset')}</button>
                    <button onClick={onClose} className="absolute top-4 right-4 text-secondary-text-color hover:text-primary-text-color">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PomodoroWidget;