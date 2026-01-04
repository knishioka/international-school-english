import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';
import { spellingWords } from '@/data/spellingWords';
import { shuffleArrayWithSeed, getHourlyShuffleSeed } from '@/utils/arrayUtils';
import type { SpellingWord } from '@/types/vocabulary';

const difficulties = [
  { id: 'easy', name: { en: 'Easy (3-4 letters)', ja: 'かんたん (3-4もじ)' }, emoji: '😊' },
  { id: 'medium', name: { en: 'Medium (5-6 letters)', ja: 'ふつう (5-6もじ)' }, emoji: '🤔' },
  { id: 'hard', name: { en: 'Hard (7+ letters)', ja: 'むずかしい (7もじ以上)' }, emoji: '🤯' },
];

export function SpellingGamePage(): JSX.Element {
  const { language } = useLanguage();
  const { playSound, speak } = useAudio();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentWord, setCurrentWord] = useState<SpellingWord | null>(null);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredWords = spellingWords.filter((word) => word.difficulty === selectedDifficulty);

  // メモ化してシャッフルされた単語を取得
  const shuffledWords = useMemo(
    () => shuffleArrayWithSeed(filteredWords, getHourlyShuffleSeed()),
    [filteredWords],
  );

  useEffect(() => {
    if (gameStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameStarted, currentWord]);

  const startGame = (): void => {
    if (shuffledWords.length > 0) {
      setCurrentWord(shuffledWords[0]);
      setCurrentIndex(0);
      setGameStarted(true);
      setUserInput('');
      setShowHint(false);
      setIsCorrect(null);
      setScore(0);
    }
  };

  const handleBack = async (): Promise<void> => {
    await playSound('click');
    navigate('/home');
  };

  const handleDifficultySelect = async (difficulty: 'easy' | 'medium' | 'hard'): Promise<void> => {
    await playSound('click');
    setSelectedDifficulty(difficulty);
    setGameStarted(false);
  };

  const handleInputChange = (value: string): void => {
    setUserInput(value.toLowerCase());
  };

  const handleSubmit = async (): Promise<void> => {
    if (!currentWord || userInput.trim() === '') {
      return;
    }

    const correct = userInput.trim() === currentWord.word;
    setIsCorrect(correct);

    if (correct) {
      await playSound('success');
      // Add delay for iOS compatibility
      setTimeout(() => {
        speak(currentWord.word);
      }, 100);

      // Calculate score based on difficulty and hint usage
      let points = 10;
      if (selectedDifficulty === 'medium') {
        points = 15;
      }
      if (selectedDifficulty === 'hard') {
        points = 20;
      }
      if (!showHint) {
        points += 5;
      } // Bonus for not using hint

      setScore(score + points);
    } else {
      await playSound('error');
    }
  };

  const handleNext = async (): Promise<void> => {
    await playSound('click');

    const nextIndex = currentIndex + 1;
    if (nextIndex < shuffledWords.length) {
      setCurrentWord(shuffledWords[nextIndex]);
      setCurrentIndex(nextIndex);
      setUserInput('');
      setShowHint(false);
      setIsCorrect(null);
    } else {
      // Game completed
      setGameStarted(false);
    }
  };

  const handlePlayAudio = async (): Promise<void> => {
    if (!currentWord) {
      return;
    }
    await playSound('click');
    // Add a small delay for better iOS compatibility
    setTimeout(() => {
      speak(currentWord.word);
    }, 100);
  };

  const toggleHint = async (): Promise<void> => {
    await playSound('click');
    setShowHint(!showHint);
  };

  const handleTryAgain = async (): Promise<void> => {
    await playSound('click');
    setUserInput('');
    setIsCorrect(null);
  };

  const handleAlphabetClick = async (letter: string): Promise<void> => {
    await playSound('click');
    if (isCorrect === null) {
      setUserInput(userInput + letter.toLowerCase());
    }
  };

  const handleBackspace = async (): Promise<void> => {
    await playSound('click');
    if (isCorrect === null && userInput.length > 0) {
      setUserInput(userInput.slice(0, -1));
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-100 p-4">
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
              {language === 'ja' ? 'スペルチェック' : 'Spelling Game'} ✏️
            </h1>
            <div className="w-10" />
          </div>

          {/* 難易度選択 */}
          <motion.div initial={false} className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {language === 'ja' ? 'レベルを えらんでね' : 'Choose Your Level'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              {difficulties.map((difficulty) => (
                <motion.button
                  key={difficulty.id}
                  initial={false}
                  onClick={() =>
                    handleDifficultySelect(difficulty.id as 'easy' | 'medium' | 'hard')
                  }
                  className={`
                    p-6 rounded-2xl transition-all hover:scale-105
                    ${
                      selectedDifficulty === difficulty.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white text-gray-800 hover:bg-blue-50 shadow-md'
                    }
                  `}
                >
                  <div className="text-4xl mb-2">{difficulty.emoji}</div>
                  <div className="font-medium">
                    {language === 'ja' ? difficulty.name.ja : difficulty.name.en}
                  </div>
                  <div className="text-sm mt-1 opacity-75">
                    {spellingWords.filter((w) => w.difficulty === difficulty.id).length}{' '}
                    {language === 'ja' ? 'ことば' : 'words'}
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.button
              initial={false}
              transition={{ delay: 0.5 }}
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xl font-bold rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-lg"
            >
              {language === 'ja' ? 'はじめる！' : 'Start Game!'} 🚀
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setGameStarted(false)}
            className="text-2xl p-2 hover:bg-white/50 rounded-lg transition-colors"
            aria-label="Back to menu"
          >
            ←
          </button>
          <h1 className="text-2xl font-display font-bold text-gray-800">
            {language === 'ja' ? 'スペルチェック' : 'Spelling Game'}
          </h1>
          <div className="text-lg font-bold text-blue-600">Score: {score}</div>
        </div>

        {/* プログレス */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {language === 'ja' ? 'しんちょく' : 'Progress'}
            </span>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {filteredWords.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / filteredWords.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* メインコンテンツ */}
        <motion.div
          key={currentWord.id}
          initial={false}
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        >
          {/* 単語情報 */}
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">{currentWord.emoji}</div>
            <div className="text-2xl font-bold text-gray-800 mb-2">{currentWord.japanese}</div>
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={handlePlayAudio}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔊 {language === 'ja' ? 'きく' : 'Listen'}
              </button>
              <button
                onClick={toggleHint}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                💡 {language === 'ja' ? 'ヒント' : 'Hint'}
              </button>
            </div>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-gray-600 italic mb-4"
              >
                {currentWord.hint}
              </motion.div>
            )}
          </div>

          {/* 入力エリア */}
          <div className="max-w-md mx-auto">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              {language === 'ja' ? 'スペルを いれてね:' : 'Type the spelling:'}
            </label>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-center font-mono"
              placeholder={language === 'ja' ? 'ここに かいてね...' : 'Type here...'}
              disabled={isCorrect !== null}
            />

            {/* ヒント表示: 文字数 */}
            <div className="text-center mt-2 text-gray-500">
              {currentWord.word.length} {language === 'ja' ? 'もじ' : 'letters'}
            </div>

            {/* アルファベットボタン */}
            <div className="mt-6">
              <div className="grid grid-cols-7 gap-2 max-w-lg mx-auto">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleAlphabetClick(letter)}
                    disabled={isCorrect !== null}
                    className={`
                      p-3 text-lg font-bold rounded-lg transition-all
                      ${
                        isCorrect !== null
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95 shadow-sm'
                      }
                    `}
                  >
                    {letter}
                  </button>
                ))}
                <button
                  onClick={handleBackspace}
                  disabled={isCorrect !== null || userInput.length === 0}
                  className={`
                    col-span-2 p-3 text-lg font-bold rounded-lg transition-all
                    ${
                      isCorrect !== null || userInput.length === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600 active:scale-95 shadow-sm'
                    }
                  `}
                >
                  ⌫
                </button>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-center mt-6">
            {isCorrect === null ? (
              <button
                onClick={handleSubmit}
                disabled={userInput.trim() === ''}
                className={`
                  px-8 py-3 rounded-full text-lg font-medium transition-all
                  ${
                    userInput.trim() === ''
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600 shadow-lg'
                  }
                `}
              >
                {language === 'ja' ? 'こたえをみる' : 'Check Answer'}
              </button>
            ) : (
              <div className="flex gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`
                    px-6 py-3 rounded-full text-lg font-medium
                    ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                  `}
                >
                  {isCorrect
                    ? language === 'ja'
                      ? 'せいかい！ 🎉'
                      : 'Correct! 🎉'
                    : language === 'ja'
                      ? 'ちがうよ 😅'
                      : 'Try again 😅'}
                </motion.div>

                {isCorrect ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                  >
                    {currentIndex === filteredWords.length - 1
                      ? language === 'ja'
                        ? 'おわり'
                        : 'Finish'
                      : language === 'ja'
                        ? 'つぎへ'
                        : 'Next'}
                  </button>
                ) : (
                  <button
                    onClick={handleTryAgain}
                    className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-lg"
                  >
                    {language === 'ja' ? 'もういちど' : 'Try Again'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 正解表示 */}
          {isCorrect === false && (
            <motion.div initial={false} className="mt-4 p-4 bg-yellow-50 rounded-lg text-center">
              <p className="text-gray-700">
                {language === 'ja' ? 'せいかい:' : 'Correct spelling:'}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">{currentWord.word}</p>
            </motion.div>
          )}
        </motion.div>

        {/* 完了画面 */}
        <AnimatePresence mode="wait">
          {currentIndex === filteredWords.length - 1 && isCorrect === true && (
            <motion.div initial={false} exit={{ opacity: 0, y: -20 }} className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {language === 'ja' ? 'おつかれさま！' : 'Great Job!'}
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                {language === 'ja' ? `スコア: ${score} てん！` : `Final Score: ${score} points!`}
              </p>
              <button
                onClick={() => setGameStarted(false)}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg"
              >
                {language === 'ja' ? 'もういちど' : 'Play Again'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
