import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';

interface VocabularyWord {
  id: string;
  english: string;
  japanese: string;
  romaji: string;
  category: string;
  image: string;
  emoji: string;
  example?: {
    english: string;
    japanese: string;
  };
}

interface FlashCardProps {
  word: VocabularyWord;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  currentIndex: number;
  totalCount: number;
}

export function FlashCard({
  word,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  currentIndex,
  totalCount,
}: FlashCardProps): JSX.Element {
  const { language } = useLanguage();
  const { playSound, speak } = useAudio();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExample, setShowExample] = useState(false);

  const handleFlip = async (): Promise<void> => {
    await playSound('click');
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = async (e?: React.MouseEvent | React.TouchEvent): Promise<void> => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    await playSound('click');
    const textToSpeak = isFlipped
      ? language === 'ja'
        ? word.japanese
        : word.english
      : word.english;

    speak(textToSpeak, isFlipped && language === 'ja' ? 'ja' : 'en');
  };

  const handleNext = async (): Promise<void> => {
    await playSound('click');
    setIsFlipped(false);
    setShowExample(false);
    onNext();
  };

  const handlePrevious = async (): Promise<void> => {
    await playSound('click');
    setIsFlipped(false);
    setShowExample(false);
    onPrevious();
  };

  const toggleExample = async (): Promise<void> => {
    await playSound('click');
    setShowExample(!showExample);
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      {/* プログレス表示 */}
      <div className="w-full mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {language === 'ja' ? 'しんちょく' : 'Progress'}
          </span>
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {totalCount}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* フラッシュカード */}
      <motion.div
        initial={false}
        className="relative w-80 h-96 cursor-pointer perspective-1000"
        onClick={handleFlip}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          initial={false}
          className="absolute inset-0 w-full h-full preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 表面（英語） */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border-4 border-blue-200">
            <div className="flex flex-col items-center justify-center h-full p-6">
              <div className="text-6xl mb-4">{word.emoji}</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">{word.english}</h2>
              <p className="text-lg text-gray-600 text-center">
                {language === 'ja' ? 'タップして日本語を見る' : 'Tap to see Japanese'}
              </p>
              <div className="absolute bottom-4 right-4">
                <button
                  type="button"
                  onClick={handleSpeak}
                  className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  🔊
                </button>
              </div>
            </div>
          </div>

          {/* 裏面（日本語） */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border-4 border-pink-200 rotate-y-180">
            <div className="flex flex-col items-center justify-center h-full p-6">
              <div className="text-6xl mb-4">{word.emoji}</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">{word.japanese}</h2>
              <p className="text-lg text-gray-600 mb-2 text-center">{word.romaji}</p>
              <p className="text-sm text-gray-500 text-center">
                {language === 'ja' ? 'タップして英語に戻る' : 'Tap to see English'}
              </p>
              <div className="absolute bottom-4 right-4">
                <button
                  type="button"
                  onClick={handleSpeak}
                  className="p-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                >
                  🔊
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* 例文表示 */}
      {word.example && (
        <motion.div
          className="mt-6 w-full"
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: showExample ? 1 : 0,
            height: showExample ? 'auto' : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">
              {language === 'ja' ? 'れいぶん' : 'Example'}
            </h4>
            <p className="text-gray-800 mb-1">{word.example.english}</p>
            <p className="text-gray-600 text-sm">{word.example.japanese}</p>
          </div>
        </motion.div>
      )}

      {/* コントロールボタン */}
      <div className="flex justify-between items-center w-full mt-6 relative z-10">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isFirst) {
              handlePrevious();
            }
          }}
          disabled={isFirst}
          className={`
            px-6 py-3 rounded-full font-medium transition-all select-none
            ${
              isFirst
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700'
            }
          `}
        >
          ← {language === 'ja' ? 'まえ' : 'Previous'}
        </button>

        <div className="flex gap-3">
          {word.example && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleExample();
              }}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 active:bg-yellow-700 transition-colors select-none"
            >
              {showExample
                ? language === 'ja'
                  ? 'かくす'
                  : 'Hide'
                : language === 'ja'
                  ? 'れいぶん'
                  : 'Example'}
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleFlip();
            }}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 active:bg-purple-700 transition-colors select-none"
          >
            {language === 'ja' ? 'ひっくりかえす' : 'Flip'}
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isLast) {
              handleNext();
            }
          }}
          disabled={isLast}
          className={`
            px-6 py-3 rounded-full font-medium transition-all select-none
            ${
              isLast
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
            }
          `}
        >
          {language === 'ja' ? 'つぎ' : 'Next'} →
        </button>
      </div>
    </div>
  );
}
