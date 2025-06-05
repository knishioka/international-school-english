import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';

interface Letter {
  upper: string;
  lower: string;
  pronunciation: string;
  word: string;
  wordJa: string;
  emoji: string;
}

const ALPHABET_DATA: Letter[] = [
  { upper: 'A', lower: 'a', pronunciation: 'エイ', word: 'Apple', wordJa: 'りんご', emoji: '🍎' },
  { upper: 'B', lower: 'b', pronunciation: 'ビー', word: 'Ball', wordJa: 'ボール', emoji: '⚽' },
  { upper: 'C', lower: 'c', pronunciation: 'シー', word: 'Cat', wordJa: 'ねこ', emoji: '🐱' },
  { upper: 'D', lower: 'd', pronunciation: 'ディー', word: 'Dog', wordJa: 'いぬ', emoji: '🐶' },
  { upper: 'E', lower: 'e', pronunciation: 'イー', word: 'Elephant', wordJa: 'ぞう', emoji: '🐘' },
  { upper: 'F', lower: 'f', pronunciation: 'エフ', word: 'Fish', wordJa: 'さかな', emoji: '🐟' },
  { upper: 'G', lower: 'g', pronunciation: 'ジー', word: 'Giraffe', wordJa: 'きりん', emoji: '🦒' },
  { upper: 'H', lower: 'h', pronunciation: 'エイチ', word: 'House', wordJa: 'いえ', emoji: '🏠' },
  {
    upper: 'I',
    lower: 'i',
    pronunciation: 'アイ',
    word: 'Ice cream',
    wordJa: 'アイス',
    emoji: '🍦',
  },
  {
    upper: 'J',
    lower: 'j',
    pronunciation: 'ジェイ',
    word: 'Juice',
    wordJa: 'ジュース',
    emoji: '🧃',
  },
  { upper: 'K', lower: 'k', pronunciation: 'ケイ', word: 'Kite', wordJa: 'たこ', emoji: '🪁' },
  { upper: 'L', lower: 'l', pronunciation: 'エル', word: 'Lion', wordJa: 'ライオン', emoji: '🦁' },
  { upper: 'M', lower: 'm', pronunciation: 'エム', word: 'Mouse', wordJa: 'ねずみ', emoji: '🐭' },
  { upper: 'N', lower: 'n', pronunciation: 'エヌ', word: 'Nose', wordJa: 'はな', emoji: '👃' },
  {
    upper: 'O',
    lower: 'o',
    pronunciation: 'オー',
    word: 'Orange',
    wordJa: 'オレンジ',
    emoji: '🍊',
  },
  {
    upper: 'P',
    lower: 'p',
    pronunciation: 'ピー',
    word: 'Penguin',
    wordJa: 'ペンギン',
    emoji: '🐧',
  },
  {
    upper: 'Q',
    lower: 'q',
    pronunciation: 'キュー',
    word: 'Queen',
    wordJa: 'おうじょ',
    emoji: '👸',
  },
  { upper: 'R', lower: 'r', pronunciation: 'アール', word: 'Rainbow', wordJa: 'にじ', emoji: '🌈' },
  { upper: 'S', lower: 's', pronunciation: 'エス', word: 'Sun', wordJa: 'たいよう', emoji: '☀️' },
  { upper: 'T', lower: 't', pronunciation: 'ティー', word: 'Tree', wordJa: 'き', emoji: '🌳' },
  { upper: 'U', lower: 'u', pronunciation: 'ユー', word: 'Umbrella', wordJa: 'かさ', emoji: '☂️' },
  {
    upper: 'V',
    lower: 'v',
    pronunciation: 'ヴィー',
    word: 'Violin',
    wordJa: 'バイオリン',
    emoji: '🎻',
  },
  {
    upper: 'W',
    lower: 'w',
    pronunciation: 'ダブリュー',
    word: 'Water',
    wordJa: 'みず',
    emoji: '💧',
  },
  {
    upper: 'X',
    lower: 'x',
    pronunciation: 'エックス',
    word: 'X-ray',
    wordJa: 'レントゲン',
    emoji: '🩻',
  },
  { upper: 'Y', lower: 'y', pronunciation: 'ワイ', word: 'Yellow', wordJa: 'きいろ', emoji: '💛' },
  {
    upper: 'Z',
    lower: 'z',
    pronunciation: 'ゼット',
    word: 'Zebra',
    wordJa: 'しまうま',
    emoji: '🦓',
  },
];

export function AlphabetGamePage(): JSX.Element {
  const { language } = useLanguage();
  const { playSound, speak } = useAudio();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showUpperCase, setShowUpperCase] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentLetter = ALPHABET_DATA[currentIndex];
  const progress = ((currentIndex + 1) / ALPHABET_DATA.length) * 100;

  const playLetterSound = useCallback(async (): Promise<void> => {
    if (isPlaying) {
      return;
    }

    setIsPlaying(true);
    await playSound('success');

    // 文字の発音を読み上げ
    const textToSpeak =
      language === 'ja'
        ? `${currentLetter.upper}、${currentLetter.pronunciation}`
        : `${currentLetter.upper}`;

    speak(textToSpeak, language);

    setTimeout(() => setIsPlaying(false), 1000);
  }, [currentLetter, isPlaying, language, playSound, speak]);

  useEffect(() => {
    // 自動的に文字の音声を再生
    playLetterSound();
  }, [currentIndex, playLetterSound]);

  const handleBack = async (): Promise<void> => {
    await playSound('click');
    navigate('/home');
  };

  const playWordSound = async (): Promise<void> => {
    await playSound('click');
    const wordToSpeak =
      language === 'ja' ? `${currentLetter.word}、${currentLetter.wordJa}` : currentLetter.word;

    speak(wordToSpeak, language);
  };

  const nextLetter = async (): Promise<void> => {
    if (currentIndex < ALPHABET_DATA.length - 1) {
      await playSound('click');
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previousLetter = async (): Promise<void> => {
    if (currentIndex > 0) {
      await playSound('click');
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleCase = async (): Promise<void> => {
    await playSound('click');
    setShowUpperCase(!showUpperCase);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4">
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
            {language === 'ja' ? 'アルファベット' : 'Alphabet'} 🔤
          </h1>
          <div className="w-10" />
        </div>

        {/* プログレスバー */}
        <div className="bg-white rounded-lg p-4 mb-8 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {language === 'ja' ? 'しんちょく' : 'Progress'}
            </span>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {ALPHABET_DATA.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* メイン文字表示 */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="text-center mb-8"
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            {/* 文字表示 */}
            <motion.button
              onClick={playLetterSound}
              className="text-9xl font-bold text-blue-600 hover:text-blue-700 transition-colors mb-4 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              disabled={isPlaying}
            >
              {showUpperCase ? currentLetter.upper : currentLetter.lower}
            </motion.button>

            {/* 発音表示 */}
            {language === 'ja' && (
              <p className="text-xl text-gray-600 mb-4">[{currentLetter.pronunciation}]</p>
            )}

            {/* 大文字・小文字切り替え */}
            <button
              onClick={toggleCase}
              className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600 transition-colors mb-6"
            >
              {showUpperCase
                ? language === 'ja'
                  ? 'こもじ'
                  : 'lowercase'
                : language === 'ja'
                  ? 'おおもじ'
                  : 'UPPERCASE'}
            </button>
          </div>

          {/* 単語例 */}
          <motion.div className="bg-white rounded-2xl shadow-lg p-6" whileHover={{ scale: 1.02 }}>
            <button
              onClick={playWordSound}
              className="flex items-center justify-center gap-4 w-full hover:bg-gray-50 rounded-lg p-4 transition-colors"
            >
              <span className="text-6xl">{currentLetter.emoji}</span>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-800">{currentLetter.word}</div>
                {language === 'ja' && (
                  <div className="text-lg text-gray-600">{currentLetter.wordJa}</div>
                )}
              </div>
              <div className="text-3xl text-blue-500">🔊</div>
            </button>
          </motion.div>
        </motion.div>

        {/* ナビゲーションボタン */}
        <div className="flex justify-between items-center">
          <button
            onClick={previousLetter}
            disabled={currentIndex === 0}
            className={`
              px-6 py-3 rounded-full font-medium transition-all
              ${
                currentIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }
            `}
          >
            ← {language === 'ja' ? 'まえ' : 'Previous'}
          </button>

          <div className="text-center">
            <div className="text-4xl mb-2">
              {currentIndex === ALPHABET_DATA.length - 1 ? '🎉' : '👋'}
            </div>
            <p className="text-gray-600">
              {currentIndex === ALPHABET_DATA.length - 1
                ? language === 'ja'
                  ? 'おつかれさま！'
                  : 'Great job!'
                : language === 'ja'
                  ? 'がんばって！'
                  : 'Keep going!'}
            </p>
          </div>

          <button
            onClick={nextLetter}
            disabled={currentIndex === ALPHABET_DATA.length - 1}
            className={`
              px-6 py-3 rounded-full font-medium transition-all
              ${
                currentIndex === ALPHABET_DATA.length - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }
            `}
          >
            {language === 'ja' ? 'つぎ' : 'Next'} →
          </button>
        </div>
      </div>
    </div>
  );
}
