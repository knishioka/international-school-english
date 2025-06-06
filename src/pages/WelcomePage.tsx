import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';

export function WelcomePage(): JSX.Element {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { playSound } = useAudio();
  const [name, setName] = useState('');

  const handleStart = async (): Promise<void> => {
    if (!name.trim()) {
      return;
    }

    await playSound('click');
    localStorage.setItem('userName', name);
    navigate('/home');
  };

  const handleLanguageToggle = async (): Promise<void> => {
    await playSound('click');
    setLanguage(language === 'ja' ? 'en' : 'ja');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-purple-200 flex items-center justify-center p-4">
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
      >
        <motion.h1
          initial={false}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-4xl font-display font-bold text-center mb-8 text-primary-600"
        >
          {t('welcome')}
        </motion.h1>

        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">{t('name')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('enterName')}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          disabled={!name.trim()}
          className="btn-primary w-full mb-4"
        >
          {t('letsPlay')}
        </motion.button>

        <button
          onClick={handleLanguageToggle}
          className="w-full text-center text-gray-600 hover:text-gray-800"
        >
          {language === 'ja' ? 'English' : '日本語'}
        </button>
      </motion.div>
    </div>
  );
}
