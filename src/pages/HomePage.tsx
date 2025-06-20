import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';
import { GameCard } from '@/components/GameCard';
import { KanjiGradeSelector } from '@/components/KanjiGradeSelector';

export function HomePage(): JSX.Element {
  const { t, language } = useLanguage();
  const { playSound } = useAudio();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName');
    setUserName(name ?? '');
  }, []);

  const games = [
    {
      id: 'flashcards',
      title: language === 'ja' ? 'たんごカード' : 'Flash Cards',
      icon: '📚',
      color: 'bg-green-100',
      route: '/games/flashcards',
    },
    {
      id: 'spelling',
      title: language === 'ja' ? 'スペルチェック' : 'Spelling',
      icon: '✏️',
      color: 'bg-blue-100',
      route: '/games/spelling',
    },
    {
      id: 'sentencePractice',
      title: t('sentencePractice'),
      icon: '📝',
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

  const handleGameClick = async (route: string): Promise<void> => {
    await playSound('click');
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center py-8">
          <div className="flex justify-end mb-4">
            <KanjiGradeSelector />
          </div>
          <h1 className="text-5xl font-display font-bold text-gray-800 mb-2">
            {t('hello')}, {userName}! 👋
          </h1>
          <p className="text-xl text-gray-600">{t('letsPlay')}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-6xl mx-auto">
          {games.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              icon={game.icon}
              color={game.color}
              onClick={() => handleGameClick(game.route)}
            />
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={async () => {
              await playSound('click');
              navigate('/progress');
            }}
            className="btn-secondary"
          >
            {t('myProgress')} 📊
          </button>
        </div>
      </div>
    </div>
  );
}
