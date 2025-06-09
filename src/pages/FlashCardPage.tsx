import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';
import { FlashCard } from '@/components/FlashCard';
import { vocabularyCategories, getVocabularyByCategory } from '@/data/vocabularyWords';
import { shuffleArrayWithSeed, getHourlyShuffleSeed } from '@/utils/arrayUtils';

export function FlashCardPage(): JSX.Element {
  const { language } = useLanguage();
  const { playSound } = useAudio();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const filteredWords = getVocabularyByCategory(selectedCategory);

  // メモ化して再計算を防ぐ
  const shuffledWords = useMemo(
    () => shuffleArrayWithSeed(filteredWords, getHourlyShuffleSeed()),
    [filteredWords],
  );

  const currentWord = shuffledWords[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const handleBack = async (): Promise<void> => {
    await playSound('click');
    navigate('/home');
  };

  const handleCategorySelect = async (categoryId: string): Promise<void> => {
    await playSound('click');
    setSelectedCategory(categoryId);
    setGameStarted(false);
  };

  const handleStartGame = async (): Promise<void> => {
    await playSound('click');
    setGameStarted(true);
  };

  const handleNext = (): void => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleBackToMenu = async (): Promise<void> => {
    await playSound('click');
    setGameStarted(false);
    setCurrentIndex(0);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4">
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
            <h1 className="text-3xl font-display font-bold text-gray-800">
              {language === 'ja' ? 'たんごカード' : 'Flash Cards'} 📚
            </h1>
            <div className="w-10" />
          </div>

          {/* カテゴリー選択 */}
          <motion.div initial={false} className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {language === 'ja' ? 'カテゴリーを えらんでね' : 'Choose a Category'}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {vocabularyCategories.map((category) => (
                <motion.button
                  key={category.id}
                  initial={false}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`
                    p-6 rounded-2xl transition-all hover:scale-105
                    ${
                      selectedCategory === category.id
                        ? `${category.color} ring-4 ring-blue-300`
                        : 'bg-white hover:shadow-lg'
                    }
                  `}
                >
                  <div className="text-4xl mb-2">{category.emoji}</div>
                  <div className="text-lg font-medium text-gray-800">
                    {language === 'ja' ? category.name.ja : category.name.en}
                  </div>
                  <div className="text-sm mt-1 text-gray-600">
                    {getVocabularyByCategory(category.id).length}{' '}
                    {language === 'ja' ? 'ことば' : 'words'}
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.button
              initial={false}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartGame}
              disabled={!selectedCategory}
              className={`
                mt-8 px-8 py-4 text-xl font-bold rounded-full transition-all transform shadow-lg
                ${
                  selectedCategory
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {language === 'ja' ? 'はじめる！' : 'Start Learning!'} ✨
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <motion.button
            initial={false}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBackToMenu}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Back to menu"
          >
            <span className="text-xl">←</span>
          </motion.button>
          <motion.h1
            initial={false}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 px-4"
          >
            {vocabularyCategories.find((c) => c.id === selectedCategory)?.emoji}{' '}
            {language === 'ja'
              ? vocabularyCategories.find((c) => c.id === selectedCategory)?.name.ja
              : vocabularyCategories.find((c) => c.id === selectedCategory)?.name.en}
          </motion.h1>
          <div className="w-10 h-10 flex items-center justify-center">
            <span className="text-sm text-gray-600">
              {currentIndex + 1}/{shuffledWords.length}
            </span>
          </div>
        </div>

        {/* 進捗バー */}
        <div className="text-center mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">{language === 'ja' ? '進捗' : 'Progress'}</span>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {shuffledWords.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / shuffledWords.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* フラッシュカード */}
        <motion.div initial={false} className="flex justify-center">
          {currentWord !== undefined ? (
            <FlashCard
              key={currentWord.id}
              word={currentWord}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isFirst={currentIndex === 0}
              isLast={currentIndex === shuffledWords.length - 1}
              currentIndex={currentIndex}
              totalCount={shuffledWords.length}
            />
          ) : null}
        </motion.div>

        {/* ナビゲーションボタン */}
        <div className="flex justify-center gap-4 mt-8">
          <motion.button
            initial={false}
            whileHover={currentIndex > 0 ? { scale: 1.05 } : {}}
            whileTap={currentIndex > 0 ? { scale: 0.95 } : {}}
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`
              px-6 py-3 rounded-full font-bold transition-all
              ${
                currentIndex === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl'
              }
            `}
          >
            ← {language === 'ja' ? 'まえ' : 'Previous'}
          </motion.button>

          <motion.button
            initial={false}
            whileHover={currentIndex < shuffledWords.length - 1 ? { scale: 1.05 } : {}}
            whileTap={currentIndex < shuffledWords.length - 1 ? { scale: 0.95 } : {}}
            onClick={handleNext}
            disabled={currentIndex === shuffledWords.length - 1}
            className={`
              px-6 py-3 rounded-full font-bold transition-all
              ${
                currentIndex === shuffledWords.length - 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl'
              }
            `}
          >
            {language === 'ja' ? 'つぎ' : 'Next'} →
          </motion.button>
        </div>
      </div>
    </div>
  );
}
