import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';
import { GameCard } from '@/components/GameCard';

export function HomePage(): JSX.Element {
  const { t } = useLanguage();
  const { playSound } = useAudio();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName');
    setUserName(name ?? '');
  }, []);

  const games = [
    {
      id: 'alphabet',
      title: t('alphabet'),
      icon: '🔤',
      color: 'bg-primary-100',
      route: '/games/alphabet',
    },
    {
      id: 'vocabulary',
      title: t('vocabulary'),
      icon: '📚',
      color: 'bg-secondary-100',
      route: '/games/vocabulary',
    },
    {
      id: 'stories',
      title: t('stories'),
      icon: '📖',
      color: 'bg-purple-100',
      route: '/games/stories',
    },
  ];

  const handleGameClick = async (_route: string): Promise<void> => {
    await playSound('click');
    // Navigation will be implemented later
    // TODO: Implement navigation to game routes
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h1 className="text-5xl font-display font-bold text-gray-800 mb-2">
            {t('hello')}, {userName}! 👋
          </h1>
          <p className="text-xl text-gray-600">{t('letsPlay')}</p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GameCard
                title={game.title}
                icon={game.icon}
                color={game.color}
                onClick={() => handleGameClick(game.route)}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <button onClick={() => handleGameClick('/progress')} className="btn-secondary">
            {t('myProgress')} 📊
          </button>
        </motion.div>
      </div>
    </div>
  );
}
