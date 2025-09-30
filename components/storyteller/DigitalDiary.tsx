import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { voiceService } from '../../services/voiceService';
import { localAIService } from '../../services/localAIService';
import { useLocalMediaStore, StoredMedia } from '../../hooks/useLocalMediaStore';
import { useAppState } from '../../context/AppStateContext';
import { cryptoService } from '../../services/cryptoService';

interface EncryptedEntry {
    id: string;
    encryptedText: string;
}

const DigitalDiary: React.FC = () => {
  const { t } = useTranslation();
  const { videoRef } = useAppState();
  const [entry, setEntry] = useState('');
  const [isDictating, setIsDictating] = useState(false);
  const [aiResult, setAiResult] = useState<{title: string, content: string} | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { startVideoRecording, stopVideoRecording, isRecording, savedMedia } = useLocalMediaStore(videoRef);
  const [savedEntries, setSavedEntries] = useState<EncryptedEntry[]>([]);
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const [decryptionError, setDecryptionError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const DEMO_PASSWORD = 'password123'; // For demonstration purposes

  const handleDictate = () => {
    if (isDictating) {
      recognitionRef.current?.stop();
      setIsDictating(false);
      return;
    }
    setIsDictating(true);
    recognitionRef.current = voiceService.startDictation(
      (transcript) => setEntry(transcript),
      () => setIsDictating(false)
    ) as SpeechRecognition;
  };

  const handleGenerateLegacyLog = async () => {
    if(!entry.trim()) return;
    setIsGenerating(true);
    setAiResult(null);
    const result = await localAIService.generateLegacyLog(entry);
    setAiResult({ title: t('storyteller.legacyResult'), content: result });
    setIsGenerating(false);
  };

  const handleCreateEarthLinkMessage = async () => {
    if(!entry.trim()) return;
    setIsGenerating(true);
    setAiResult(null);
    const result = await localAIService.createEarthLinkMessage(entry);
    setAiResult({ title: t('storyteller.earthlinkResult'), content: result });
    setIsGenerating(false);
  };

  const handleSaveEncrypted = async () => {
    if (!entry.trim()) return;
    try {
        const encryptedText = await cryptoService.encryptData(entry, DEMO_PASSWORD);
        setSavedEntries(prev => [...prev, { id: `entry-${Date.now()}`, encryptedText }]);
        setEntry('');
        setDecryptedContent(null);
        setDecryptionError(null);
    } catch (error) {
        console.error("Encryption failed:", error);
        alert("Could not save entry securely.");
    }
  };
  
  const handleDecryptLastEntry = async () => {
      if (savedEntries.length === 0) return;
      const lastEntry = savedEntries[savedEntries.length - 1];
      try {
          const decryptedText = await cryptoService.decryptData(lastEntry.encryptedText, DEMO_PASSWORD);
          setDecryptedContent(decryptedText);
          setDecryptionError(null);
      } catch (error) {
          console.error("Decryption failed:", error);
          setDecryptionError("Decryption failed. Invalid key or corrupted data.");
          setDecryptedContent(null);
      }
  };


  return (
    <div className="h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-3">{t('storyteller.diaryTitle')}</h3>
      <div className="flex-grow flex flex-col">
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder={t('storyteller.entryPlaceholder')}
          className="w-full flex-grow bg-black/20 rounded-lg p-3 border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent-color)] resize-none"
        />
        <div className="mt-4 space-y-2">
            {/* Saved media logs display */}
            {savedMedia.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-secondary-text-color mb-2">{t('storyteller.savedLogs')}</h4>
                    <ul className="space-y-1">
                    {savedMedia.map((media: StoredMedia) => (
                        <li key={media.id} className="text-xs text-primary-text-color p-2 bg-black/20 rounded">
                        {media.type === 'video' ? '📹' : '📸'} Video Log - {new Date(media.timestamp).toLocaleTimeString()} ({media.duration}s)
                        </li>
                    ))}
                    </ul>
                </div>
            )}
            {/* Encrypted entries display */}
            {savedEntries.length > 0 && (
                 <div>
                    <h4 className="text-sm font-semibold text-secondary-text-color mb-2">Saved Entries (Encrypted)</h4>
                    <ul className="space-y-1">
                    {savedEntries.map((savedEntry) => (
                        <li key={savedEntry.id} className="text-xs text-primary-text-color p-2 bg-black/20 rounded truncate flex justify-between items-center">
                            <span>📝 Entry - {new Date(parseInt(savedEntry.id.split('-')[1])).toLocaleTimeString()}</span>
                            {savedEntries.indexOf(savedEntry) === savedEntries.length -1 && (
                                <button onClick={handleDecryptLastEntry} className="text-xs bg-white/20 px-2 py-0.5 rounded ml-2">Decrypt</button>
                            )}
                        </li>
                    ))}
                    </ul>
                </div>
            )}
        </div>
      </div>
       <div className="flex flex-wrap gap-2 mt-3">
        {/* Action buttons */}
        <button onClick={handleDictate} disabled={isGenerating || isRecording} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${isDictating ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}>{isDictating ? t('storyteller.dictating') : t('storyteller.dictate')}</button>
        <button onClick={isRecording ? stopVideoRecording : startVideoRecording} disabled={isGenerating || isDictating} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}>{isRecording ? t('storyteller.stopRecording') : t('storyteller.recordLog')}</button>
        <button onClick={handleSaveEncrypted} disabled={!entry.trim() || isGenerating} className="px-4 py-2 bg-white/10 text-primary-text-color rounded-lg text-sm font-semibold hover:bg-white/20 disabled:opacity-50">Save Encrypted</button>
        <button onClick={handleGenerateLegacyLog} disabled={!entry.trim() || isGenerating} className="px-4 py-2 bg-white/10 text-primary-text-color rounded-lg text-sm font-semibold hover:bg-white/20 disabled:opacity-50">{t('storyteller.generateLegacy')}</button>
        <button onClick={handleCreateEarthLinkMessage} disabled={!entry.trim() || isGenerating} className="px-4 py-2 bg-white/10 text-primary-text-color rounded-lg text-sm font-semibold hover:bg-white/20 disabled:opacity-50">{t('storyteller.createMessage')}</button>
      </div>
      {/* AI and Decryption results */}
      {(isGenerating || aiResult || decryptedContent || decryptionError) && (
        <div className="mt-4 bg-black/20 p-4 rounded-lg animate-fade-in space-y-3">
          {isGenerating && <p className="text-sm text-secondary-text-color">{t('storyteller.generating')}</p>}
          {aiResult && (
            <div>
              <h4 className="font-semibold text-sm mb-2 text-[var(--primary-accent-color)]">{aiResult.title}</h4>
              <p className="text-primary-text-color text-sm whitespace-pre-line">{aiResult.content}</p>
            </div>
          )}
          {decryptedContent && (
             <div>
                <h4 className="font-semibold text-sm mb-2 text-green-400">Decrypted Entry</h4>
                <p className="text-primary-text-color text-sm whitespace-pre-line">{decryptedContent}</p>
             </div>
          )}
          {decryptionError && <p className="text-sm text-red-400">{decryptionError}</p>}
        </div>
      )}
    </div>
  );
};

export default DigitalDiary;
