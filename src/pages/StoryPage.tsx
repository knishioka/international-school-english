import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';
import { KanjiGradeSelector } from '@/components/KanjiGradeSelector';
import { PageFlip } from '@/components/PageFlip';
import { useProgressStore } from '@/stores/progressStore';
import { stories } from '@/data/stories';
import type { Story } from '@/types';

const getCategoryEmoji = (category: Story['category']): string => {
  const emojis = {
    moral: '⚖️',
    friendship: '🤝',
    nature: '🌿',
    responsibility: '📋',
    courage: '💪',
    patience: '⏰',
    imagination: '🎨',
    empathy: '💖',
    logic: '🧩',
    'self-esteem': '⭐',
    diversity: '🌈',
  };
  return emojis[category] || '📖';
};

const getCategoryName = (category: Story['category'], language: 'en' | 'ja'): string => {
  const names = {
    moral: { en: 'Moral', ja: 'どうとく' },
    friendship: { en: 'Friendship', ja: 'ゆうじょう' },
    nature: { en: 'Nature', ja: 'しぜん' },
    responsibility: { en: 'Responsibility', ja: 'せきにん' },
    courage: { en: 'Courage', ja: 'ゆうき' },
    patience: { en: 'Patience', ja: 'しんぼう' },
    imagination: { en: 'Imagination', ja: 'そうぞう' },
    empathy: { en: 'Empathy', ja: 'きょうかん' },
    logic: { en: 'Logic', ja: 'ろんり' },
    'self-esteem': { en: 'Self-esteem', ja: 'じしん' },
    diversity: { en: 'Diversity', ja: 'たようせい' },
  };
  return names[category]?.[language] || 'Story';
};

export function StoryPage(): JSX.Element {
  const { t, language, kanjiGrade } = useLanguage();
  const { playSound, speak } = useAudio();
  const navigate = useNavigate();
  const updateStoryProgress = useProgressStore((state) => state.updateStoryProgress);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [userName, setUserName] = useState('');
  const [pageDirection, setPageDirection] = useState<'left' | 'right'>('right');
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('userName');
    setUserName(name ?? '');
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || !selectedStory || isReading) {
      return;
    }

    const autoPlayTimer = setTimeout(() => {
      if (currentPage < selectedStory.pages.length - 1) {
        void handleNextPage();
      } else {
        // Story finished
        setIsAutoPlay(false);
        void playSound('success');
      }
    }, 5000); // 5 seconds per page

    return () => clearTimeout(autoPlayTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoPlay, currentPage, selectedStory, isReading]);

  const handleBack = async (): Promise<void> => {
    await playSound('click');
    if (selectedStory) {
      setSelectedStory(null);
      setCurrentPage(0);
    } else {
      navigate('/home');
    }
  };

  const handleStorySelect = async (story: Story): Promise<void> => {
    await playSound('click');
    setSelectedStory(story);
    setCurrentPage(0);

    // Save initial reading progress
    if (userName.length > 0) {
      updateStoryProgress(
        userName,
        story.id,
        1, // First page
        story.pages.length,
      );
    }
  };

  const handleNextPage = async (): Promise<void> => {
    if (!selectedStory) {
      return;
    }

    await playSound('pageFlip');
    const newPage = currentPage + 1;

    if (newPage < selectedStory.pages.length) {
      setPageDirection('right');
      setCurrentPage(newPage);
    }

    // Save reading progress
    if (userName.length > 0 && selectedStory !== null) {
      updateStoryProgress(
        userName,
        selectedStory.id,
        newPage + 1, // Pages read (1-indexed)
        selectedStory.pages.length,
      );
    }
  };

  const handlePrevPage = async (): Promise<void> => {
    await playSound('pageFlip');
    if (currentPage > 0) {
      setPageDirection('left');
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRead = async (): Promise<void> => {
    if (!selectedStory || isReading) {
      return;
    }

    setIsReading(true);
    await playSound('click');

    const currentPageData = selectedStory.pages[currentPage];
    const textToRead = language === 'ja' ? currentPageData.text.ja : currentPageData.text.en;

    speak(textToRead, language);

    // 読み上げ中の表示を3秒後に解除
    setTimeout(() => {
      setIsReading(false);
    }, 3000);
  };

  const toggleAutoPlay = async (): Promise<void> => {
    await playSound('click');
    setIsAutoPlay(!isAutoPlay);

    // If starting auto-play and not on a page, start reading current page
    if (!isAutoPlay && selectedStory) {
      handleRead();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="text-2xl p-2 hover:bg-white/50 rounded-lg transition-colors"
            aria-label="Back"
          >
            ←
          </button>
          <h1 className="text-3xl font-display font-bold text-gray-800">
            {selectedStory
              ? language === 'ja'
                ? selectedStory.title.jaKanji[kanjiGrade]
                : selectedStory.title.en
              : t('stories')}{' '}
            📖
          </h1>
          <div className="w-10" />
        </div>

        {!selectedStory ? (
          <>
            {/* 漢字レベル選択 */}
            <div className="flex justify-center mb-6">
              <KanjiGradeSelector />
            </div>

            {/* ストーリー選択画面 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stories.map((story) => (
                <motion.button
                  key={story.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStorySelect(story)}
                  className="bg-white rounded-2xl shadow-lg p-8 text-left hover:shadow-xl transition-shadow"
                >
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    {language === 'ja' ? story.title.jaKanji[kanjiGrade] : story.title.en}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {language === 'ja'
                      ? story.description.jaKanji[kanjiGrade]
                      : story.description.en}
                  </p>
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-blue-800">
                      <span className="text-xs">📚 </span>
                      {language === 'ja' ? story.lesson.jaKanji[kanjiGrade] : story.lesson.en}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {story.pages.slice(0, 4).map((page, index) => (
                        <span key={index} className="text-2xl">
                          {page.emoji}
                        </span>
                      ))}
                      {story.pages.length > 4 && <span className="text-xl">...</span>}
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {getCategoryEmoji(story.category)} {getCategoryName(story.category, language)}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          // ストーリー表示画面
          <PageFlip
            pageKey={currentPage}
            direction={pageDirection}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            {/* ページ内容 */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="text-8xl mb-6"
              >
                {selectedStory.pages[currentPage].emoji}
              </motion.div>
              <motion.p
                initial={false}
                className={`font-medium text-gray-800 leading-relaxed ${
                  language === 'ja' ? 'text-2xl' : 'text-3xl'
                }`}
              >
                {language === 'ja'
                  ? selectedStory.pages[currentPage].jaKanji[kanjiGrade]
                  : selectedStory.pages[currentPage].text.en}
              </motion.p>
              {language === 'ja' && (
                <motion.p
                  initial={false}
                  className="text-xl text-gray-600 mt-6 leading-relaxed font-medium"
                >
                  {selectedStory.pages[currentPage].text.en}
                </motion.p>
              )}
            </div>

            {/* コントロール */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`
                    px-4 py-2 rounded-lg font-medium transition-all
                    ${
                      currentPage === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }
                  `}
              >
                ←
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleRead}
                  disabled={isReading}
                  className={`
                      px-6 py-3 rounded-full font-medium transition-all
                      ${
                        isReading
                          ? 'bg-yellow-300 text-gray-700 animate-pulse'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }
                    `}
                >
                  {isReading ? '🔊' : '▶️'}
                  {language === 'ja' ? 'よむ' : 'Read'}
                </button>

                <button
                  onClick={toggleAutoPlay}
                  className={`
                      px-4 py-3 rounded-full font-medium transition-all
                      ${
                        isAutoPlay
                          ? 'bg-orange-500 text-white animate-pulse'
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }
                    `}
                  title={language === 'ja' ? 'じどうさいせい' : 'Auto-play'}
                >
                  {isAutoPlay ? '⏸️' : '🎬'}
                </button>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === selectedStory.pages.length - 1}
                className={`
                    px-4 py-2 rounded-lg font-medium transition-all
                    ${
                      currentPage === selectedStory.pages.length - 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }
                  `}
              >
                →
              </button>
            </div>

            {/* ページインジケーター */}
            <div className="flex justify-center gap-2 mt-6">
              {selectedStory.pages.map((_, index) => (
                <div
                  key={index}
                  className={`
                      w-2 h-2 rounded-full transition-all
                      ${index === currentPage ? 'bg-blue-500 w-8' : 'bg-gray-300'}
                    `}
                />
              ))}
            </div>

            {/* 最後のページで教訓を表示 */}
            {currentPage === selectedStory.pages.length - 1 && (
              <motion.div
                initial={false}
                className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                  {language === 'ja' ? 'きょうの まなび' : "Today's Lesson"} 🌟
                </h3>
                <p className="text-center text-lg font-medium text-blue-800">
                  {language === 'ja'
                    ? selectedStory.lesson.jaKanji[kanjiGrade]
                    : selectedStory.lesson.en}
                </p>
              </motion.div>
            )}
          </PageFlip>
        )}
      </div>
    </div>
  );
}
