import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';
import { progressService } from '@/services/progressService';

interface ProgressStats {
  totalScore: number;
  completedSentences: number;
  totalSentenceAttempts: number;
  accuracy: number;
  completedStories: number;
  totalStoriesRead: number;
  streakDays: number;
  totalTimeSpent: number;
  achievements: string[];
  activitiesLast7Days: number;
  kanjiGrade: number;
}

export function ProgressPage(): JSX.Element {
  const { t, language } = useLanguage();
  const { playSound } = useAudio();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState<ProgressStats | null>(null);

  useEffect(() => {
    const name = localStorage.getItem('userName');
    setUserName(name ?? '');

    if (name !== null && name.length > 0) {
      const progressStats = progressService.getProgressStats(name);
      setStats(progressStats);
    }
  }, []);

  const handleBack = async (): Promise<void> => {
    await playSound('click');
    navigate('/home');
  };

  const getAchievementInfo = (
    achievementId: string,
  ): { title: string; description: string; icon: string } => {
    const achievements = {
      first_sentence: {
        title: language === 'ja' ? 'はじめての ぶんしょう' : 'First Sentence',
        description:
          language === 'ja'
            ? 'はじめての ぶんしょうを かんせい！'
            : 'Completed your first sentence!',
        icon: '🌟',
      },
      first_story: {
        title: language === 'ja' ? 'はじめての おはなし' : 'First Story',
        description:
          language === 'ja' ? 'はじめての おはなしを よんだ！' : 'Read your first story!',
        icon: '📖',
      },
      sentence_master: {
        title: language === 'ja' ? 'ぶんしょう マスター' : 'Sentence Master',
        description:
          language === 'ja' ? '10この ぶんしょうを かんせい！' : 'Completed 10 sentences!',
        icon: '🏆',
      },
      story_reader: {
        title: language === 'ja' ? 'おはなし はかせ' : 'Story Expert',
        description: language === 'ja' ? 'すべての おはなしを よんだ！' : 'Read all stories!',
        icon: '📚',
      },
      week_streak: {
        title: language === 'ja' ? 'しゅうかん チャンピオン' : 'Week Champion',
        description: language === 'ja' ? '7にち れんぞく がくしゅう！' : '7 days learning streak!',
        icon: '🔥',
      },
      score_champion: {
        title: language === 'ja' ? 'スコア チャンピオン' : 'Score Champion',
        description: language === 'ja' ? '1000ポイント たっせい！' : 'Reached 1000 points!',
        icon: '💎',
      },
    };
    const achievement = achievements[achievementId as keyof typeof achievements];
    return (
      achievement ?? {
        title: achievementId,
        description: '',
        icon: '🎯',
      }
    );
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-lg text-gray-600">
            {language === 'ja' ? 'がくしゅうきろくを よみこみちゅう...' : 'Loading progress...'}
          </p>
        </div>
      </div>
    );
  }

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
            {userName !== '' ? `${userName}の ` : ''}
            {language === 'ja' ? 'がくしゅう きろく' : 'Learning Record'}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center bg-blue-50 rounded-lg p-4">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalScore}</div>
              <div className="text-sm text-gray-600">
                {language === 'ja' ? 'ごうけい スコア' : 'Total Score'}
              </div>
            </div>

            <div className="text-center bg-green-50 rounded-lg p-4">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-2xl font-bold text-green-600">{stats.completedSentences}</div>
              <div className="text-sm text-gray-600">
                {language === 'ja' ? 'かんせい ぶんしょう' : 'Completed Sentences'}
              </div>
            </div>

            <div className="text-center bg-purple-50 rounded-lg p-4">
              <div className="text-3xl mb-2">📖</div>
              <div className="text-2xl font-bold text-purple-600">{stats.completedStories}</div>
              <div className="text-sm text-gray-600">
                {language === 'ja' ? 'よんだ おはなし' : 'Stories Read'}
              </div>
            </div>

            <div className="text-center bg-orange-50 rounded-lg p-4">
              <div className="text-3xl mb-2">🔥</div>
              <div className="text-2xl font-bold text-orange-600">{stats.streakDays}</div>
              <div className="text-sm text-gray-600">
                {language === 'ja' ? 'れんぞく にっすう' : 'Day Streak'}
              </div>
            </div>
          </div>

          {/* 詳細統計 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-gray-700">
                {language === 'ja' ? 'せいかいりつ' : 'Accuracy'}
              </div>
              <div className="text-lg font-bold text-green-600">{stats.accuracy}%</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-700">
                {language === 'ja' ? 'がくしゅう じかん' : 'Study Time'}
              </div>
              <div className="text-lg font-bold text-blue-600">{stats.totalTimeSpent} min</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-700">
                {language === 'ja' ? 'かんじ レベル' : 'Kanji Level'}
              </div>
              <div className="text-lg font-bold text-purple-600">
                {language === 'ja' ? `${stats.kanjiGrade}年生` : `Grade ${stats.kanjiGrade}`}
              </div>
            </div>
          </div>
        </motion.div>

        {/* アチーブメント */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {language === 'ja' ? 'アチーブメント' : 'Achievements'} 🏆
          </h3>

          {stats.achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {stats.achievements.map((achievementId, index) => {
                const achievement = getAchievementInfo(achievementId);
                return (
                  <motion.div
                    key={achievementId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white rounded-xl p-4 shadow-lg ring-2 ring-yellow-400"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                      <div className="text-2xl text-green-500">✓</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-lg text-center mb-6">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-gray-600">
                {language === 'ja'
                  ? 'がくしゅうを つづけて アチーブメントを かくとく しよう！'
                  : 'Keep learning to unlock achievements!'}
              </p>
            </div>
          )}
        </motion.div>

        {/* 今週の活動 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {language === 'ja' ? 'こんしゅうの かつどう' : "This Week's Activity"} 📈
          </h3>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">📅</div>
              <div className="text-3xl font-bold text-indigo-600">{stats.activitiesLast7Days}</div>
              <p className="text-gray-600">
                {language === 'ja'
                  ? 'かこ 7にかんの がくしゅう かいすう'
                  : 'Learning activities in the last 7 days'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 励ましのメッセージ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
