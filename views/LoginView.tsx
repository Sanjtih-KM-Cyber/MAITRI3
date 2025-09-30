import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ForgotPasswordView from './ForgotPasswordView';

interface LoginViewProps {
  onLogin: (name: string) => void;
}

const securityQuestions = [
  "What was your childhood nickname?",
  "What is the name of your favorite childhood friend?",
  "In what city or town did your parents meet?",
  "What was the name of your first pet?",
  "What is your favorite movie?",
  "What was the make and model of your first car?",
  "What is your mother's maiden name?",
  "What was the name of the street you lived on in third grade?",
];

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const { t } = useTranslation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState(securityQuestions[0]);
  const [securityAnswer, setSecurityAnswer] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        onLogin(data.user.name);
    } catch (err: any) {
        setError(err.message);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
        const response = await fetch('http://localhost:3001/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, securityQuestion, securityAnswer }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setMessage('Registration successful! Please log in.');
        setIsRegistering(false);
        setError(null);
    } catch (err: any) {
        setError(err.message);
    }
  };

  if (isForgotPassword) {
      return <ForgotPasswordView onBackToLogin={() => setIsForgotPassword(false)} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-fade-in p-4">
        <div className="w-full max-w-sm">
            <h1 className="text-5xl font-bold text-center mb-8">{isRegistering ? t('auth.register') : t('auth.login')}</h1>
            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-6">
                <div>
                    <label className="text-sm font-medium text-secondary-text-color">{t('auth.username')}</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full mt-1 p-3 bg-white/5 rounded-lg border-2 border-[var(--widget-border-color)] focus:outline-none focus:border-[var(--primary-accent-color)]" />
                </div>
                <div>
                    <label className="text-sm font-medium text-secondary-text-color">{t('auth.password')}</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full mt-1 p-3 bg-white/5 rounded-lg border-2 border-[var(--widget-border-color)] focus:outline-none focus:border-[var(--primary-accent-color)]" />
                </div>

                {isRegistering && (
                    <>
                        <div>
                            <label className="text-sm font-medium text-secondary-text-color">{t('auth.securityQuestion')}</label>
                            <select value={securityQuestion} onChange={e => setSecurityQuestion(e.target.value)} className="w-full mt-1 p-3 bg-white/5 rounded-lg border-2 border-[var(--widget-border-color)] focus:outline-none focus:border-[var(--primary-accent-color)] appearance-none">
                                <option disabled>{t('auth.selectQuestion')}</option>
                                {securityQuestions.map(q => <option key={q} value={q}>{q}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-secondary-text-color">{t('auth.securityAnswer')}</label>
                            <input type="text" value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)} required className="w-full mt-1 p-3 bg-white/5 rounded-lg border-2 border-[var(--widget-border-color)] focus:outline-none focus:border-[var(--primary-accent-color)]" />
                        </div>
                    </>
                )}

                <button type="submit" className="w-full p-3 bg-[var(--primary-accent-color)] text-white font-semibold rounded-lg hover:opacity-90">{isRegistering ? t('auth.register') : t('auth.login')}</button>
                
                {error && <p className="text-red-400 text-center">{error}</p>}
                {message && <p className="text-green-400 text-center">{message}</p>}
            </form>
            <div className="text-center mt-6 space-y-2">
                <button onClick={() => { setIsRegistering(!isRegistering); setError(null); setMessage(null); }} className="text-sm text-secondary-text-color hover:text-primary-text-color">
                    {isRegistering ? t('auth.backToLogin') : t('auth.needAccount')}
                </button>
                {!isRegistering && (
                    <button onClick={() => { setIsForgotPassword(true); setError(null); setMessage(null); }} className="block w-full text-sm text-secondary-text-color hover:text-primary-text-color">
                        {t('auth.forgotPassword')}
                    </button>
                )}
            </div>
        </div>
    </div>
  );
};

export default LoginView;
