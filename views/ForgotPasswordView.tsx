import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ForgotPasswordViewProps {
  onBackToLogin: () => void;
}

const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onBackToLogin }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1); // 1: enter username, 2: answer question, 3: reset password
  const [username, setUsername] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleGetQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/security-question/${username}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSecurityQuestion(data.securityQuestion);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
        const response = await fetch('http://localhost:3001/api/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, securityAnswer, newPassword }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setMessage('Password reset successfully! You can now log in.');
        setTimeout(() => onBackToLogin(), 3000);
    } catch(err: any) {
        setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-fade-in p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-4xl font-bold text-center mb-8">{t('auth.resetPassword')}</h1>
        {step === 1 && (
          <form onSubmit={handleGetQuestion} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-secondary-text-color">{t('auth.username')}</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full mt-1 p-3 bg-white/5 rounded-lg border-2 border-[var(--widget-border-color)] focus:outline-none focus:border-[var(--primary-accent-color)]" />
            </div>
            <button type="submit" className="w-full p-3 bg-[var(--primary-accent-color)] text-white font-semibold rounded-lg hover:opacity-90">{t('auth.getQuestion')}</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
                <p className="text-sm font-medium text-secondary-text-color mb-2">{t('auth.securityQuestion')}:</p>
                <p className="p-3 bg-black/20 rounded-lg">{securityQuestion}</p>
            </div>
             <div>
              <label className="text-sm font-medium text-secondary-text-color">{t('auth.securityAnswer')}</label>
              <input type="text" value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)} required className="w-full mt-1 p-3 bg-white/5 rounded-lg border-2 border-[var(--widget-border-color)] focus:outline-none focus:border-[var(--primary-accent-color)]" />
            </div>
            <div>
              <label className="text-sm font-medium text-secondary-text-color">{t('auth.newPassword')}</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full mt-1 p-3 bg-white/5 rounded-lg border-2 border-[var(--widget-border-color)] focus:outline-none focus:border-[var(--primary-accent-color)]" />
            </div>
            <button type="submit" className="w-full p-3 bg-[var(--primary-accent-color)] text-white font-semibold rounded-lg hover:opacity-90">{t('auth.resetPassword')}</button>
          </form>
        )}
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        {message && <p className="text-green-400 text-center mt-4">{message}</p>}
        <button onClick={onBackToLogin} className="block w-full text-center mt-6 text-sm text-secondary-text-color hover:text-primary-text-color">
          {t('auth.backToLogin')}
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordView;
