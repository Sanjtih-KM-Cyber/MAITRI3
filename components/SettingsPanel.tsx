import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';
import { voiceService } from '../services/voiceService';
import Modal from './Modal';

interface SettingsPanelProps {
    onClose: () => void;
    onLogout: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose, onLogout }) => {
    const { t, i18n } = useTranslation();
    const {
        notificationsEnabled, setNotificationsEnabled,
        maitriVoice, setMaitriVoice,
        showVideoFeed, setShowVideoFeed
    } = useSettings();
    const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        // Voices might load asynchronously, so we check on mount and also set up a listener.
        const updateVoices = () => {
             setAvailableVoices(voiceService.getAvailableVoices());
        };
        updateVoices();
        window.speechSynthesis.onvoiceschanged = updateVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        }
    }, []);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <Modal title={t('settings.title')} onClose={onClose}>
            <div className="space-y-6">
                {/* Notifications Toggle */}
                <div className="flex justify-between items-center">
                    <label htmlFor="notifications" className="font-medium">{t('settings.notifications')}</label>
                    <button id="notifications" onClick={() => setNotificationsEnabled(!notificationsEnabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationsEnabled ? 'bg-[var(--primary-accent-color)]' : 'bg-gray-600'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                {/* Video Feed Toggle */}
                <div className="flex justify-between items-center">
                    <label htmlFor="videoFeed" className="font-medium">{t('settings.video')}</label>
                    <button id="videoFeed" onClick={() => setShowVideoFeed(!showVideoFeed)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showVideoFeed ? 'bg-[var(--primary-accent-color)]' : 'bg-gray-600'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showVideoFeed ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                {/* Voice Selector */}
                <div className="flex justify-between items-center">
                    <label htmlFor="voice" className="font-medium">{t('settings.voice')}</label>
                    <select id="voice" value={maitriVoice} onChange={e => setMaitriVoice(e.target.value)} className="w-1/2 p-2 bg-white/5 rounded-lg border-2 border-[var(--widget-border-color)] focus:outline-none focus:border-[var(--primary-accent-color)] appearance-none">
                        <option value="default">{t('settings.defaultVoice')}</option>
                        {availableVoices.map(voice => (
                            <option key={voice.name} value={voice.name}>{voice.name}</option>
                        ))}
                    </select>
                </div>

                {/* Language Selector */}
                <div className="flex justify-between items-center">
                    <label htmlFor="language" className="font-medium">{t('settings.language')}</label>
                    <select id="language" value={i18n.language} onChange={handleLanguageChange} className="w-1/2 p-2 bg-white/5 rounded-lg border-2 border-[var(--widget-border-color)] focus:outline-none focus:border-[var(--primary-accent-color)] appearance-none">
                        <option value="en">English</option>
                        <option value="hi">हिंदी (Hindi)</option>
                    </select>
                </div>

                {/* Logout Button */}
                <div className="border-t border-[var(--widget-border-color)] pt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-white/10 rounded-lg">{t('settings.close')}</button>
                    <button onClick={onLogout} className="px-4 py-2 bg-red-600/80 text-white rounded-lg">{t('settings.logout')}</button>
                </div>
            </div>
        </Modal>
    );
};

export default SettingsPanel;
