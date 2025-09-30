import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { voiceService } from '../../services/voiceService';

interface SmartInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const SmartInput: React.FC<SmartInputProps> = ({ onSend, disabled }) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [isDictating, setIsDictating] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSend(inputValue);
      setInputValue('');
    }
  };

  const handleDictate = () => {
    if (isDictating) {
      recognitionRef.current?.stop();
      setIsDictating(false);
      return;
    }

    setIsDictating(true);
    recognitionRef.current = voiceService.startDictation(
      (transcript) => setInputValue(transcript),
      () => setIsDictating(false)
    ) as SpeechRecognition;
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 p-2 bg-[var(--widget-background-color)] border border-[var(--widget-border-color)] rounded-xl">
      <button
        type="button"
        onClick={handleDictate}
        disabled={disabled}
        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isDictating ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}
        aria-label={t('chat.dictate')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={t('chat.placeholder')}
        disabled={disabled}
        className="w-full bg-transparent focus:outline-none text-primary-text-color placeholder-secondary-text-color"
      />
      <button
        type="submit"
        disabled={!inputValue.trim() || disabled}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary-accent-color)] text-white disabled:opacity-50 transition-opacity"
        aria-label={t('chat.send')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" transform="rotate(90)">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </form>
  );
};

export default SmartInput;
