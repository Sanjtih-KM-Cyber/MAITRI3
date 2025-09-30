import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';
import { voiceService } from '../services/voiceService';

interface MissionEvent {
    time: string;
    name: string;
}

export const useNotificationScheduler = (missionCadence: MissionEvent[]) => {
    const { t } = useTranslation();
    const { notificationsEnabled, maitriVoice } = useSettings();
    const [activeAlert, setActiveAlert] = useState<string | null>(null);

    useEffect(() => {
        if (!notificationsEnabled) {
            return; // Don't schedule anything if disabled
        }

        const now = new Date();
        const alertIntervals = [15, 10, 5, 3, 1]; // minutes
        const timers: number[] = [];

        missionCadence.forEach(event => {
            const [hour, minute] = event.time.split(':').map(Number);
            const eventTime = new Date(now);
            eventTime.setHours(hour, minute, 0, 0);

            alertIntervals.forEach(interval => {
                const alertTime = new Date(eventTime.getTime() - interval * 60 * 1000);
                if (alertTime > now) {
                    const timeout = alertTime.getTime() - now.getTime();
                    const timerId = window.setTimeout(() => {
                        const alertMessage = t('copilot.alert', { task: event.name, time: interval });
                        setActiveAlert(alertMessage);
                        voiceService.speak(alertMessage, maitriVoice);
                        
                        // Hide alert after 7 seconds
                        setTimeout(() => setActiveAlert(null), 7000);
                    }, timeout);
                    timers.push(timerId);
                }
            });
        });

        // Cleanup function to clear all scheduled timeouts
        return () => {
            timers.forEach(clearTimeout);
        };

    }, [missionCadence, notificationsEnabled, t, maitriVoice]);

    return { activeAlert };
};
