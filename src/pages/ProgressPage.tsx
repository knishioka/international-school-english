import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';

interface Progress {
  alphabetViews: number;
  vocabularyViews: number;
  storiesRead: number;
  totalTime: number;
  lastVisit: string;
}

export function ProgressPage(): JSX.Element {
  const { t, language } = useLanguage();
  const { playSound } = useAudio();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [progress, setProgress] = useState<Progress>({
    alphabetViews: 0,
    vocabularyViews: 0,
    storiesRead: 0,
    totalTime: 0,
    lastVisit: new Date().toISOString(),
  });

  useEffect(() => {
    const name = localStorage.getItem('userName');
    setUserName(name ?? '');

    // 進捗データを取得（実際の実装では、各ゲームでカウントを保存）
    const savedProgress = localStorage.getItem('userProgress');
    if (savedProgress !== null) {
      setProgress(JSON.parse(savedProgress));
    } else {
      // デモ用のダミーデータ
      const demoProgress: Progress = {
        alphabetViews: Math.floor(Math.random() * 26),
        vocabularyViews: Math.floor(Math.random() * 20),
        storiesRead: Math.floor(Math.random() * 5),
        totalTime: Math.floor(Math.random() * 120),
        lastVisit: new Date().toISOString(),
      };
      setProgress(demoProgress);
    }
  }, []);

  const handleBack = async (): Promise<void> => {
    await playSound('click');
    navigate('/home');
  };

  const achievements = [
    {
      id: 'alphabet-beginner',
      title: language === 'ja' ? 'アルファベットビギナー' : 'Alphabet Beginner',
      description: language === 'ja' ? '5もじをまなんだ！' : 'Learned 5 letters!',
      icon: '🌟',
      achieved: progress.alphabetViews >= 5,
      progress: Math.min(progress.alphabetViews / 5, 1),
    },
    {
      id: 'alphabet-master',
      title: language === 'ja' ? 'アルファベットマスター' : 'Alphabet Master',
      description: language === 'ja' ? 'すべてのもじをまなんだ！' : 'Learned all letters!',
      icon: '🏆',
      achieved: progress.alphabetViews >= 26,
      progress: Math.min(progress.alphabetViews / 26, 1),
    },
    {
      id: 'vocabulary-explorer',
      title: language === 'ja' ? 'たんごエクスプローラー' : 'Vocabulary Explorer',
      description: language === 'ja' ? '10このたんごをまなんだ！' : 'Learned 10 words!',
      icon: '📚',
      achieved: progress.vocabularyViews >= 10,
      progress: Math.min(progress.vocabularyViews / 10, 1),
    },
    {
      id: 'story-lover',
      title: language === 'ja' ? 'おはなしだいすき' : 'Story Lover',
      description: language === 'ja' ? '3つのおはなしをよんだ！' : 'Read 3 stories!',
      icon: '📖',
      achieved: progress.storiesRead >= 3,
      progress: Math.min(progress.storiesRead / 3, 1),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="text-2xl p-2 hover:bg-white/50 rounded-lg transition-colors"
            aria-label="Back to home"
          >
            ←
          </button>
          <h1 className="text-3xl font-display font-bold text-gray-800">{t('myProgress')} 📊</h1>
          <div className="w-10" />
        </div>

        {/* ユーザー情報 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {userName !== '' ? `${userName}の` : ''}
            {language === 'ja' ? 'がくしゅうきろく' : 'Learning Record'}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🔤</div>
              <div className="text-2xl font-bold text-blue-600">{progress.alphabetViews}</div>
              <div className="text-sm text-gray-600">{language === 'ja' ? 'もじ' : 'Letters'}</div>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-green-600">{progress.vocabularyViews}</div>
              <div className="text-sm text-gray-600">{language === 'ja' ? 'たんご' : 'Words'}</div>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-2">📖</div>
              <div className="text-2xl font-bold text-purple-600">{progress.storiesRead}</div>
              <div className="text-sm text-gray-600">
                {language === 'ja' ? 'おはなし' : 'Stories'}
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-orange-600">{progress.totalTime}</div>
              <div className="text-sm text-gray-600">{language === 'ja' ? 'ぷん' : 'Minutes'}</div>
            </div>
          </div>
        </motion.div>

        {/* アチーブメント */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {language === 'ja' ? 'アチーブメント' : 'Achievements'} 🎯
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`
                  bg-white rounded-xl p-4 shadow-lg
                  ${achievement.achieved ? 'ring-2 ring-yellow-400' : 'opacity-75'}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`text-4xl ${achievement.achieved ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          achievement.achieved ? 'bg-yellow-400' : 'bg-gray-400'
                        }`}
                        style={{ width: `${achievement.progress * 100}%` }}
                      />
                    </div>
                  </div>
                  {achievement.achieved && <div className="text-2xl">✓</div>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 励ましのメッセージ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-lg text-gray-700 bg-white/50 rounded-lg p-4">
            {language === 'ja'
              ? 'まいにち すこしずつ がんばろう！ 🌈'
              : 'Keep learning a little every day! 🌈'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
