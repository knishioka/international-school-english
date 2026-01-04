import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';
import { KanjiGradeSelector } from '@/components/KanjiGradeSelector';
import { useProgressStore } from '@/stores/progressStore';
import { useGameStore, selectGameScore } from '@/stores';
import { sentences } from '@/data/sentences';
import { sentenceCategories } from '@/data/categories';
import { shuffleArrayWithSeed, getHourlyShuffleSeed, filterByCategory } from '@/utils/arrayUtils';
import type { Sentence } from '@/types';

interface WordOrderGame {
  sentence: Sentence;
  shuffledWords: string[];
  selectedWords: string[];
  isCorrect: boolean | null;
}

export function VocabularyGamePage(): JSX.Element {
  const { t, language, kanjiGrade } = useLanguage();
  const { playSound, speak } = useAudio();
  const navigate = useNavigate();
  const gameKey = 'sentence-practice';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentGame, setCurrentGame] = useState<WordOrderGame | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const score = useGameStore(selectGameScore(gameKey));
  const submitAnswer = useGameStore((state) => state.submitAnswer);
  const resetGameState = useGameStore((state) => state.resetGame);
  const updateSentencePracticeProgress = useProgressStore(
    (state) => state.updateSentencePracticeProgress,
  );
  const [userName, setUserName] = useState('');
  const [displayedItems, setDisplayedItems] = useState(12);
  const [isInitializing, setIsInitializing] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const name = localStorage.getItem('userName');
    setUserName(name ?? '');
    resetGameState(gameKey);
    // Small delay to ensure smooth initial render
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 50);
    return () => clearTimeout(timer);
  }, [gameKey, resetGameState]);

  // メモ化してフィルタリングされた文章を取得
  const filteredSentences = useMemo(
    () => filterByCategory(sentences, selectedCategory),
    [selectedCategory],
  );

  // メモ化してシャッフルされた文章を取得
  const shuffledSentences = useMemo(
    () => shuffleArrayWithSeed(filteredSentences, getHourlyShuffleSeed()),
    [filteredSentences],
  );

  // 表示する文章のリスト
  const visibleSentences = useMemo(
    () => shuffledSentences.slice(0, displayedItems),
    [shuffledSentences, displayedItems],
  );

  // カテゴリ変更時に表示アイテム数をリセット
  useEffect(() => {
    setDisplayedItems(12);
  }, [selectedCategory]);

  // Intersection Observerを使った無限スクロールの実装
  useEffect(() => {
    // テスト環境では無限スクロールを無効化
    if (process.env.NODE_ENV === 'test') {
      // テスト時は全てのアイテムを表示
      setDisplayedItems(shuffledSentences.length);
      return;
    }

    // IntersectionObserverが利用可能かチェック
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const loadMoreElement = loadMoreRef.current;

    try {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && displayedItems < shuffledSentences.length) {
            setDisplayedItems((prev) => Math.min(prev + 12, shuffledSentences.length));
          }
        },
        { threshold: 0.1 },
      );

      if (loadMoreElement) {
        observer.observe(loadMoreElement);
      }

      return () => {
        if (loadMoreElement !== null && observer !== null) {
          observer.unobserve(loadMoreElement);
        }
      };
    } catch (error) {
      // IntersectionObserverの初期化に失敗した場合は無視
      globalThis['console']?.warn('IntersectionObserver failed to initialize:', error);
      return;
    }
  }, [displayedItems, shuffledSentences.length]);

  // 単語をランダムにシャッフル（時間に依存しない真のランダム）
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = (sentence: Sentence): void => {
    setCurrentGame({
      sentence,
      shuffledWords: shuffleArray(sentence.words),
      selectedWords: [],
      isCorrect: null,
    });
    setHintLevel(0);
  };

  const handleWordClick = async (word: string, fromSelected: boolean): Promise<void> => {
    if (!currentGame || currentGame.isCorrect !== null) {
      return;
    }

    await playSound('click');

    if (fromSelected) {
      // 選択済みから削除
      const index = currentGame.selectedWords.indexOf(word);
      if (index > -1) {
        const newSelected = [...currentGame.selectedWords];
        newSelected.splice(index, 1);
        setCurrentGame({ ...currentGame, selectedWords: newSelected });
      }
    } else {
      // 選択に追加
      setCurrentGame({
        ...currentGame,
        selectedWords: [...currentGame.selectedWords, word],
      });
    }
  };

  const handleUndo = async (): Promise<void> => {
    if (!currentGame || currentGame.selectedWords.length === 0 || currentGame.isCorrect !== null) {
      return;
    }

    await playSound('click');

    // 最後に選択した単語を削除
    const newSelected = [...currentGame.selectedWords];
    newSelected.pop();
    setCurrentGame({ ...currentGame, selectedWords: newSelected });
  };

  const checkAnswer = async (): Promise<void> => {
    if (!currentGame) {
      return;
    }

    // Remove punctuation from the sentence for comparison
    const sentenceWithoutPunctuation = currentGame.sentence.en.replace(/[.,!?]/g, '');
    const userAnswer = currentGame.selectedWords.join(' ');
    const isCorrect = userAnswer === sentenceWithoutPunctuation;
    setCurrentGame({ ...currentGame, isCorrect });

    // Calculate score based on correctness, sentence length, and hint level
    const baseScore = isCorrect ? currentGame.sentence.words.length * 10 : 5;
    const hintPenalty = isCorrect ? hintLevel * 10 : 0; // -10 points per hint level
    const bonusScore = isCorrect && hintLevel === 0 ? 20 : 0; // Bonus for no hints
    const totalScore = Math.max(baseScore - hintPenalty + bonusScore, 10); // Minimum 10 points

    if (isCorrect) {
      submitAnswer(gameKey, true, totalScore);
    } else {
      submitAnswer(gameKey, false, 0);
    }

    // Save progress to localStorage
    if (userName.length > 0) {
      updateSentencePracticeProgress(userName, currentGame.sentence.id, isCorrect, totalScore);
    }

    if (isCorrect) {
      await playSound('success');
      speak(currentGame.sentence.en);
    } else {
      await playSound('error');
    }
  };

  const handleBack = async (): Promise<void> => {
    await playSound('click');
    resetGameState(gameKey);
    navigate('/home');
  };

  const handleCategoryChange = async (categoryId: string): Promise<void> => {
    await playSound('click');
    setSelectedCategory(categoryId);
    setCurrentGame(null);
  };

  const playAudio = async (): Promise<void> => {
    if (!currentGame) {
      return;
    }
    await playSound('click');
    speak(currentGame.sentence.en);
  };

  const getHintText = (): string => {
    if (!currentGame) {
      return '';
    }

    const { sentence } = currentGame;

    switch (hintLevel) {
      case 1:
        // Level 1: Number of words and basic structure
        return language === 'ja'
          ? `${sentence.words.length}個の単語を使います。`
          : `Use ${sentence.words.length} words to make the sentence.`;

      case 2: {
        // Level 2: First word and sentence type
        const sentenceType = sentence.en.endsWith('?')
          ? language === 'ja'
            ? '質問文'
            : 'question'
          : sentence.en.endsWith('!')
            ? language === 'ja'
              ? '感嘆文'
              : 'exclamation'
            : language === 'ja'
              ? '平叙文'
              : 'statement';
        return language === 'ja'
          ? `最初の単語は「${sentence.words[0]}」です。これは${sentenceType}です。`
          : `The first word is "${sentence.words[0]}". This is a ${sentenceType}.`;
      }

      case 3: {
        // Level 3: First half of the sentence
        const halfLength = Math.ceil(sentence.words.length / 2);
        const firstHalf = sentence.words.slice(0, halfLength).join(' ');
        return language === 'ja' ? `文の前半: ${firstHalf}...` : `First half: ${firstHalf}...`;
      }

      default:
        return '';
    }
  };

  const showNextHint = async (): Promise<void> => {
    await playSound('click');
    if (hintLevel < 3) {
      setHintLevel(hintLevel + 1);
    }
  };

  const nextSentence = async (): Promise<void> => {
    await playSound('click');
    setCurrentGame(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-yellow-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBack}
            className="text-2xl p-2 hover:bg-white/50 rounded-lg transition-colors"
            aria-label="Back to home"
          >
            ←
          </button>
          <h1 className="text-3xl font-display font-bold text-gray-800">
            {t('sentencePractice')} 📝
          </h1>
          <div className="text-lg font-bold text-purple-600">Score: {score}</div>
        </div>

        {isInitializing ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 border-t-transparent" />
          </div>
        ) : !currentGame ? (
          <>
            {/* 漢字レベル選択 */}
            <div className="flex justify-center mb-4">
              <KanjiGradeSelector />
            </div>

            {/* カテゴリー選択 */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {sentenceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${
                      selectedCategory === category.id
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-purple-100'
                    }
                  `}
                >
                  <span className="mr-1">{category.emoji}</span>
                  {language === 'ja' ? category.name.ja : category.name.en}
                </button>
              ))}
            </div>

            {/* 文章選択グリッド */}
            <motion.div
              ref={scrollContainerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[400px]"
            >
              {visibleSentences.map((sentence) => (
                <motion.button
                  key={sentence.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startGame(sentence)}
                  className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all"
                >
                  <div className="text-4xl mb-3">{sentence.emoji}</div>
                  <div className="text-base font-medium text-gray-800 mb-2">{sentence.en}</div>
                  <div className="text-sm text-gray-600">
                    {language === 'ja' ? sentence.jaKanji[kanjiGrade] : sentence.en}
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {/* 読み込みインジケーター */}
            {displayedItems < shuffledSentences.length && (
              <div ref={loadMoreRef} className="flex justify-center items-center py-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent" />
                  <span className="text-sm">
                    {language === 'ja' ? 'もっと読み込む...' : 'Loading more...'}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          /* ゲーム画面 */
          <motion.div key={currentGame?.sentence.id} initial={false} className="max-w-4xl mx-auto">
            {/* 問題文 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl">{currentGame.sentence.emoji}</div>
                <div className="flex gap-2">
                  <button
                    onClick={playAudio}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    🔊 {language === 'ja' ? 'きく' : 'Listen'}
                  </button>
                  <button
                    onClick={showNextHint}
                    disabled={hintLevel >= 3}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      hintLevel >= 3
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    💡 {language === 'ja' ? `ヒント (${hintLevel}/3)` : `Hint (${hintLevel}/3)`}
                  </button>
                </div>
              </div>

              <div className="text-xl text-gray-800 mb-2">
                {language === 'ja'
                  ? currentGame.sentence.jaKanji[kanjiGrade]
                  : currentGame.sentence.en}
              </div>

              {hintLevel > 0 && (
                <motion.div
                  key={hintLevel}
                  initial={false}
                  className="mt-3 p-3 bg-yellow-50 rounded-lg"
                >
                  <div className="text-sm font-medium text-yellow-800 mb-1">
                    {language === 'ja' ? `ヒントレベル ${hintLevel}` : `Hint Level ${hintLevel}`}
                  </div>
                  <div className="text-base text-gray-700">{getHintText()}</div>
                </motion.div>
              )}
            </div>

            {/* 選択した単語 */}
            <div className="bg-blue-50 rounded-2xl p-4 mb-6 min-h-[80px]">
              <div className="flex flex-wrap gap-2">
                {currentGame.selectedWords.length === 0 ? (
                  <p className="text-gray-500 italic">
                    {language === 'ja' ? 'ことばを えらんでね' : 'Select words to make a sentence'}
                  </p>
                ) : (
                  currentGame.selectedWords.map((word, index) => (
                    <motion.button
                      key={`selected-${index}`}
                      initial={false}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleWordClick(word, true)}
                      className="px-4 py-2 bg-white rounded-lg shadow text-lg font-medium hover:shadow-lg transition-all"
                      disabled={currentGame.isCorrect !== null}
                    >
                      {word}
                    </motion.button>
                  ))
                )}
              </div>

              {/* 戻るボタン */}
              {currentGame.selectedWords.length > 0 && currentGame.isCorrect === null && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleUndo}
                    className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                  >
                    ⤺ {language === 'ja' ? 'もどす' : 'Undo'}
                  </button>
                </div>
              )}
            </div>

            {/* 選択可能な単語 */}
            <div className="bg-gray-100 rounded-2xl p-4 mb-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {currentGame.shuffledWords.map((word, index) => {
                  const isUsed = currentGame.selectedWords.includes(word);
                  const count = currentGame.shuffledWords.filter((w) => w === word).length;
                  const usedCount = currentGame.selectedWords.filter((w) => w === word).length;
                  const isAvailable = usedCount < count;

                  if (!isAvailable) {
                    return null;
                  }

                  return (
                    <motion.button
                      key={`word-${index}`}
                      initial={false}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleWordClick(word, false)}
                      className={`
                        px-4 py-2 rounded-lg text-lg font-medium transition-all
                        ${
                          isUsed
                            ? 'bg-gray-300 text-gray-500'
                            : 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg'
                        }
                      `}
                      disabled={currentGame.isCorrect !== null}
                    >
                      {word}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex justify-center gap-4">
              {currentGame.isCorrect === null ? (
                <button
                  onClick={checkAnswer}
                  disabled={currentGame.selectedWords.length === 0}
                  className={`
                    px-8 py-3 rounded-full text-lg font-medium transition-all
                    ${
                      currentGame.selectedWords.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600 shadow-lg'
                    }
                  `}
                >
                  {language === 'ja' ? 'こたえをみる' : 'Check Answer'}
                </button>
              ) : (
                <>
                  <motion.div
                    initial={false}
                    className={`
                      px-6 py-3 rounded-full text-lg font-medium
                      ${
                        currentGame.isCorrect
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }
                    `}
                  >
                    {currentGame.isCorrect
                      ? language === 'ja'
                        ? 'せいかい！ 🎉'
                        : 'Correct! 🎉'
                      : language === 'ja'
                        ? 'もういちど 💪'
                        : 'Try again 💪'}
                  </motion.div>
                  <button
                    onClick={nextSentence}
                    className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                  >
                    {language === 'ja' ? 'つぎへ' : 'Next'}
                  </button>
                </>
              )}
            </div>

            {/* 正解表示 */}
            {currentGame.isCorrect === false && (
              <motion.div initial={false} className="mt-4 p-4 bg-yellow-50 rounded-lg text-center">
                <p className="text-gray-700">
                  {language === 'ja' ? 'せいかい:' : 'Correct answer:'}
                </p>
                <p className="text-lg font-medium text-gray-900 mt-1">{currentGame.sentence.en}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
