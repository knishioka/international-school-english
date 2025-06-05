import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';

interface Badge {
  id: string;
  name: { en: string; ja: string };
  description: { en: string; ja: string };
  icon: string;
  color: string;
  requirement: number;
  type: 'score' | 'streak' | 'completion' | 'accuracy';
}

interface BadgeRewardProps {
  totalScore: number;
  streakDays: number;
  completedActivities: number;
  accuracy: number;
  unlockedBadges: string[];
}

const badges: Badge[] = [
  // Score badges
  {
    id: 'rookie',
    name: { en: 'Rookie Learner', ja: 'しんじん がくしゅうしゃ' },
    description: { en: 'Earn 100 points', ja: '100ポイント かくとく' },
    icon: '🌱',
    color: 'bg-green-500',
    requirement: 100,
    type: 'score',
  },
  {
    id: 'rising_star',
    name: { en: 'Rising Star', ja: 'のびざかりスター' },
    description: { en: 'Earn 500 points', ja: '500ポイント かくとく' },
    icon: '⭐',
    color: 'bg-yellow-500',
    requirement: 500,
    type: 'score',
  },
  {
    id: 'champion',
    name: { en: 'Learning Champion', ja: 'がくしゅう チャンピオン' },
    description: { en: 'Earn 1000 points', ja: '1000ポイント かくとく' },
    icon: '🏆',
    color: 'bg-purple-500',
    requirement: 1000,
    type: 'score',
  },
  {
    id: 'legend',
    name: { en: 'Learning Legend', ja: 'でんせつの がくしゅうしゃ' },
    description: { en: 'Earn 2000 points', ja: '2000ポイント かくとく' },
    icon: '👑',
    color: 'bg-indigo-500',
    requirement: 2000,
    type: 'score',
  },

  // Streak badges
  {
    id: 'consistent',
    name: { en: 'Consistent Learner', ja: 'まいにち がくしゅう' },
    description: { en: '3 day streak', ja: '3にち れんぞく' },
    icon: '🔥',
    color: 'bg-orange-500',
    requirement: 3,
    type: 'streak',
  },
  {
    id: 'dedicated',
    name: { en: 'Dedicated Student', ja: 'ねっしんな せいと' },
    description: { en: '7 day streak', ja: '7にち れんぞく' },
    icon: '💪',
    color: 'bg-red-500',
    requirement: 7,
    type: 'streak',
  },
  {
    id: 'unstoppable',
    name: { en: 'Unstoppable', ja: 'とまらない がくしゅう' },
    description: { en: '14 day streak', ja: '14にち れんぞく' },
    icon: '🚀',
    color: 'bg-pink-500',
    requirement: 14,
    type: 'streak',
  },

  // Completion badges
  {
    id: 'explorer',
    name: { en: 'Explorer', ja: 'たんけんか' },
    description: { en: 'Complete 10 activities', ja: '10こ かつどう かんせい' },
    icon: '🗺️',
    color: 'bg-blue-500',
    requirement: 10,
    type: 'completion',
  },
  {
    id: 'achiever',
    name: { en: 'Achiever', ja: 'たっせいしゃ' },
    description: { en: 'Complete 25 activities', ja: '25こ かつどう かんせい' },
    icon: '🎯',
    color: 'bg-teal-500',
    requirement: 25,
    type: 'completion',
  },
  {
    id: 'master',
    name: { en: 'Master Learner', ja: 'マスター がくしゅうしゃ' },
    description: { en: 'Complete 50 activities', ja: '50こ かつどう かんせい' },
    icon: '🎓',
    color: 'bg-emerald-500',
    requirement: 50,
    type: 'completion',
  },

  // Accuracy badges
  {
    id: 'sharp',
    name: { en: 'Sharp Mind', ja: 'するどい あたま' },
    description: { en: '80% accuracy', ja: '80% せいかいりつ' },
    icon: '🎯',
    color: 'bg-cyan-500',
    requirement: 80,
    type: 'accuracy',
  },
  {
    id: 'precise',
    name: { en: 'Precise Thinker', ja: 'せいかくな しこう' },
    description: { en: '90% accuracy', ja: '90% せいかいりつ' },
    icon: '💎',
    color: 'bg-violet-500',
    requirement: 90,
    type: 'accuracy',
  },
];

export function BadgeReward({
  totalScore,
  streakDays,
  completedActivities,
  accuracy,
  unlockedBadges,
}: BadgeRewardProps): JSX.Element {
  const { language } = useLanguage();
  const { playSound } = useAudio();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const checkBadgeUnlock = (badge: Badge): boolean => {
    let value = 0;
    switch (badge.type) {
      case 'score':
        value = totalScore;
        break;
      case 'streak':
        value = streakDays;
        break;
      case 'completion':
        value = completedActivities;
        break;
      case 'accuracy':
        value = accuracy;
        break;
    }
    return value >= badge.requirement;
  };

  const handleBadgeClick = async (badge: Badge): Promise<void> => {
    await playSound('click');
    setSelectedBadge(badge);
  };

  const getProgress = (badge: Badge): number => {
    let current = 0;
    switch (badge.type) {
      case 'score':
        current = totalScore;
        break;
      case 'streak':
        current = streakDays;
        break;
      case 'completion':
        current = completedActivities;
        break;
      case 'accuracy':
        current = accuracy;
        break;
    }
    return Math.min((current / badge.requirement) * 100, 100);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {language === 'ja' ? 'バッジ コレクション' : 'Badge Collection'} 🏅
        </h3>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id) || checkBadgeUnlock(badge);
            const progress = getProgress(badge);

            return (
              <motion.button
                key={badge.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBadgeClick(badge)}
                className={`
                  relative p-4 rounded-xl transition-all
                  ${
                    isUnlocked ? `${badge.color} text-white shadow-lg` : 'bg-gray-100 text-gray-400'
                  }
                `}
              >
                <div className="text-3xl mb-1">{badge.icon}</div>
                <div className="text-xs font-medium">
                  {language === 'ja' ? badge.name.ja : badge.name.en}
                </div>

                {!isUnlocked && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300 rounded-b-xl overflow-hidden">
                    <motion.div
                      className="h-full bg-gray-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}

                {isUnlocked && !unlockedBadges.includes(badge.id) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    NEW
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {language === 'ja'
              ? `${unlockedBadges.length} / ${badges.length} バッジ かくとく`
              : `${unlockedBadges.length} / ${badges.length} badges unlocked`}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedBadges.length / badges.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBadge(null)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`
                bg-white rounded-2xl p-8 max-w-sm w-full text-center
                ${checkBadgeUnlock(selectedBadge) ? 'ring-4 ring-yellow-400' : ''}
              `}
            >
              <div className="text-6xl mb-4">{selectedBadge.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {language === 'ja' ? selectedBadge.name.ja : selectedBadge.name.en}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'ja' ? selectedBadge.description.ja : selectedBadge.description.en}
              </p>

              {checkBadgeUnlock(selectedBadge) ? (
                <div className="text-green-600 font-bold text-lg">
                  {language === 'ja' ? 'かくとく ずみ！' : 'Unlocked!'}
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    {language === 'ja' ? 'しんちょく:' : 'Progress:'}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                      style={{ width: `${getProgress(selectedBadge)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(getProgress(selectedBadge))}%
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedBadge(null)}
                className="mt-6 px-6 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
              >
                {language === 'ja' ? 'とじる' : 'Close'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
