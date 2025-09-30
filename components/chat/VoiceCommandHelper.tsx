import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppState } from '../../context/AppStateContext';
import Modal from '../Modal';

interface VoiceCommandHelperProps {
    onClose: () => void;
}

const VoiceCommandHelper: React.FC<VoiceCommandHelperProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const { activeRole } = useAppState();

    const generalCommands = [
        "\"Hey MAITRI, open dashboard.\"",
        "\"Hey MAITRI, open guardian.\"",
        "\"Hey MAITRI, open co-pilot.\"",
        "\"Hey MAITRI, open storyteller.\"",
        "\"Hey MAITRI, open playmate.\"",
    ];

    const getRoleSpecificCommands = () => {
        switch(activeRole) {
            case 'companion':
                return ["This is a conversational chat. You can talk to MAITRI naturally about your day or ask for mission support."];
            case 'guardian':
                 return ["Try saying: \"I'm logging a new symptom: I have a mild headache.\"", "MAITRI will then ask clarifying questions."];
            case 'coPilot':
                 return ["During a procedure, say \"Confirm\" to move to the next step, or \"Repeat\" to hear the current step again.", "Try scheduling: \"Add a systems diagnostic for 16:00 tomorrow.\"", ];
            case 'storyteller':
                 return ["You can dictate your logs using the button, then ask MAITRI to process it.", "Try saying: \"Turn this log into a message for my family.\"", ];
            case 'playmate':
                 return ["Suggest a game to play.", "Example: \"Let's play Cosmic Chronicles\" or \"Tell me a space riddle.\"", ];
            default:
                return [];
        }
    };
    
    const roleCommands = getRoleSpecificCommands();

    return (
        <Modal title={t('chat.voiceCommands')} onClose={onClose}>
            <div className="space-y-6">
                <div>
                    <h4 className="font-semibold text-lg mb-2 text-[var(--primary-accent-color)]">Contextual Hints ({t(`roles.${activeRole}`)})</h4>
                    <ul className="space-y-2 list-disc list-inside text-secondary-text-color">
                        {roleCommands.map((cmd, i) => <li key={`role-${i}`}><span className="text-primary-text-color">{cmd}</span></li>)}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-lg mb-2 text-[var(--primary-accent-color)]">Global Navigation</h4>
                     <ul className="space-y-2 list-disc list-inside text-secondary-text-color">
                        {generalCommands.map((cmd, i) => <li key={`gen-${i}`}><span className="text-primary-text-color">{cmd}</span></li>)}
                    </ul>
                </div>
            </div>
        </Modal>
    );
};

export default VoiceCommandHelper;
