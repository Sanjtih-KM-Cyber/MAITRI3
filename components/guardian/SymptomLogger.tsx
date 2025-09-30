import React, { useState, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import GlassWidget from '../GlassWidget';
import { AppStateContext } from '../../context/AppStateContext';

interface SymptomLoggerProps {
    onSymptomLogged: (symptom: string, photoDataUrl?: string) => void;
}

const SymptomLogger: React.FC<SymptomLoggerProps> = ({ onSymptomLogged }) => {
  const { t } = useTranslation();
  const { videoRef } = useContext(AppStateContext);
  const [symptom, setSymptom] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleLog = () => {
    if (!symptom.trim()) return;
    onSymptomLogged(symptom, photo || undefined);
    setSymptom('');
    setPhoto(null);
  };
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPhoto(dataUrl);
    }
  };

  return (
    <GlassWidget className="p-6 flex flex-col h-full">
      <h3 className="font-semibold mb-3">{t('guardian.symptomLoggerTitle')}</h3>
      <textarea
        value={symptom}
        onChange={(e) => setSymptom(e.target.value)}
        placeholder={t('guardian.logSymptomPlaceholder')}
        rows={4}
        className="w-full bg-black/20 rounded-lg p-3 border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent-color)] resize-none mb-3"
      />
      <div className="flex gap-2 mb-4">
        {/* Hidden canvas for capturing photo */}
        <canvas ref={canvasRef} className="hidden" />
        <button onClick={handleCapture} className="flex-1 px-4 py-2 bg-white/10 text-primary-text-color rounded-lg text-sm font-semibold hover:bg-white/20">
            {photo ? t('guardian.recapturePhoto') : t('guardian.capturePhoto')}
        </button>
        <button onClick={handleLog} disabled={!symptom.trim()} className="flex-1 px-4 py-2 bg-[var(--primary-accent-color)] text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50">
            {t('guardian.logAndAnalyze')}
        </button>
      </div>

      {photo && (
        <div className="animate-fade-in">
           <p className="text-xs text-secondary-text-color mb-2">{t('guardian.photoAttached')}</p>
           <img src={photo} alt="Symptom capture" className="rounded-lg w-32 h-32 object-cover" />
        </div>
      )}
    </GlassWidget>
  );
};

export default SymptomLogger;
