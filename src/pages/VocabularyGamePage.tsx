import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, KanjiGrade } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';
import { KanjiGradeSelector } from '@/components/KanjiGradeSelector';
import { progressService } from '@/services/progressService';

interface Sentence {
  id: string;
  english: string;
  japanese: string;
  jaKanji: { [key in KanjiGrade]: string };
  words: string[];
  emoji: string;
  category: string;
}

const sentences: Sentence[] = [
  // Daily Life - 日常生活
  {
    id: '1',
    english: 'I eat breakfast every morning.',
    japanese: 'わたしは まいあさ あさごはんを たべます。',
    jaKanji: {
      1: 'わたしは まいあさ あさごはんを たべます。',
      2: 'わたしは 毎朝 あさごはんを 食べます。',
      3: 'わたしは 毎朝 朝ごはんを 食べます。',
      4: 'わたしは 毎朝 朝ご飯を 食べます。',
      5: 'わたしは 毎朝 朝ご飯を 食べます。',
      6: '私は 毎朝 朝ご飯を 食べます。',
    },
    words: ['I', 'eat', 'breakfast', 'every', 'morning'],
    emoji: '🍳',
    category: 'daily',
  },
  {
    id: '2',
    english: 'My mother makes delicious cookies.',
    japanese: 'おかあさんは おいしい クッキーを つくります。',
    jaKanji: {
      1: 'おかあさんは おいしい クッキーを つくります。',
      2: 'お母さんは おいしい クッキーを 作ります。',
      3: 'お母さんは 美味しい クッキーを 作ります。',
      4: 'お母さんは 美味しい クッキーを 作ります。',
      5: 'お母さんは 美味しい クッキーを 作ります。',
      6: 'お母さんは 美味しい クッキーを 作ります。',
    },
    words: ['My', 'mother', 'makes', 'delicious', 'cookies'],
    emoji: '🍪',
    category: 'daily',
  },
  {
    id: '3',
    english: 'I brush my teeth before bed.',
    japanese: 'わたしは ねるまえに はを みがきます。',
    jaKanji: {
      1: 'わたしは ねるまえに はを みがきます。',
      2: 'わたしは ねる前に 歯を みがきます。',
      3: 'わたしは 寝る前に 歯を みがきます。',
      4: 'わたしは 寝る前に 歯を みがきます。',
      5: 'わたしは 寝る前に 歯を みがきます。',
      6: '私は 寝る前に 歯を 磨きます。',
    },
    words: ['I', 'brush', 'my', 'teeth', 'before', 'bed'],
    emoji: '🪥',
    category: 'daily',
  },
  {
    id: '4',
    english: 'We play games after school.',
    japanese: 'わたしたちは がっこうのあとで ゲームを します。',
    jaKanji: {
      1: 'わたしたちは 学校のあとで ゲームを します。',
      2: 'わたしたちは 学校の後で ゲームを します。',
      3: 'わたしたちは 学校の後で ゲームを します。',
      4: 'わたしたちは 学校の後で ゲームを します。',
      5: 'わたしたちは 学校の後で ゲームを します。',
      6: '私たちは 学校の後で ゲームを します。',
    },
    words: ['We', 'play', 'games', 'after', 'school'],
    emoji: '🎮',
    category: 'daily',
  },

  // School - 学校
  {
    id: '5',
    english: 'I study English at school every day.',
    japanese: 'わたしは まいにち がっこうで えいごを べんきょうします。',
    jaKanji: {
      1: 'わたしは まい日 学校で えいごを べんきょうします。',
      2: 'わたしは 毎日 学校で えいごを べんきょうします。',
      3: 'わたしは 毎日 学校で えいごを 勉強します。',
      4: 'わたしは 毎日 学校で 英語を 勉強します。',
      5: 'わたしは 毎日 学校で 英語を 勉強します。',
      6: '私は 毎日 学校で 英語を 勉強します。',
    },
    words: ['I', 'study', 'English', 'at', 'school', 'every', 'day'],
    emoji: '📝',
    category: 'school',
  },
  {
    id: '6',
    english: 'My teacher is very kind and helpful.',
    japanese: 'せんせいは とても やさしくて たすけてくれます。',
    jaKanji: {
      1: '先生は とても やさしくて たすけてくれます。',
      2: '先生は とても やさしくて たすけてくれます。',
      3: '先生は とても やさしくて 助けてくれます。',
      4: '先生は とても やさしくて 助けてくれます。',
      5: '先生は とても やさしくて 助けてくれます。',
      6: '先生は とても 優しくて 助けてくれます。',
    },
    words: ['My', 'teacher', 'is', 'very', 'kind', 'and', 'helpful'],
    emoji: '👩‍🏫',
    category: 'school',
  },
  {
    id: '7',
    english: 'I like to read books in the library.',
    japanese: 'わたしは としょかんで ほんを よむのが すきです。',
    jaKanji: {
      1: 'わたしは としょかんで 本を よむのが すきです。',
      2: 'わたしは 図書かんで 本を 読むのが すきです。',
      3: 'わたしは 図書かんで 本を 読むのが すきです。',
      4: 'わたしは 図書館で 本を 読むのが 好きです。',
      5: 'わたしは 図書館で 本を 読むのが 好きです。',
      6: '私は 図書館で 本を 読むのが 好きです。',
    },
    words: ['I', 'like', 'to', 'read', 'books', 'in', 'the', 'library'],
    emoji: '📖',
    category: 'school',
  },
  {
    id: '8',
    english: 'We have lunch with our friends.',
    japanese: 'わたしたちは ともだちと おひるごはんを たべます。',
    jaKanji: {
      1: 'わたしたちは ともだちと おひるごはんを たべます。',
      2: 'わたしたちは 友だちと お昼ごはんを 食べます。',
      3: 'わたしたちは 友だちと お昼ごはんを 食べます。',
      4: 'わたしたちは 友達と お昼ご飯を 食べます。',
      5: 'わたしたちは 友達と お昼ご飯を 食べます。',
      6: '私たちは 友達と お昼ご飯を 食べます。',
    },
    words: ['We', 'have', 'lunch', 'with', 'our', 'friends'],
    emoji: '🍱',
    category: 'school',
  },

  // Animals & Nature - 動物と自然
  {
    id: '9',
    english: 'The big dog runs in the park.',
    japanese: 'おおきな いぬが こうえんで はしります。',
    jaKanji: {
      1: '大きな 犬が こうえんで はしります。',
      2: '大きな 犬が 公園で 走ります。',
      3: '大きな 犬が 公園で 走ります。',
      4: '大きな 犬が 公園で 走ります。',
      5: '大きな 犬が 公園で 走ります。',
      6: '大きな 犬が 公園で 走ります。',
    },
    words: ['The', 'big', 'dog', 'runs', 'in', 'the', 'park'],
    emoji: '🐕',
    category: 'nature',
  },
  {
    id: '10',
    english: 'Beautiful flowers bloom in the spring.',
    japanese: 'きれいな はなが はるに さきます。',
    jaKanji: {
      1: 'きれいな 花が はるに さきます。',
      2: 'きれいな 花が 春に さきます。',
      3: '美しい 花が 春に さきます。',
      4: '美しい 花が 春に さきます。',
      5: '美しい 花が 春に さきます。',
      6: '美しい 花が 春に さきます。',
    },
    words: ['Beautiful', 'flowers', 'bloom', 'in', 'the', 'spring'],
    emoji: '🌸',
    category: 'nature',
  },
  {
    id: '11',
    english: 'Birds sing happy songs every morning.',
    japanese: 'とりたちは まいあさ たのしい うたを うたいます。',
    jaKanji: {
      1: 'とりたちは まいあさ たのしい うたを うたいます。',
      2: '鳥たちは 毎朝 楽しい 歌を 歌います。',
      3: '鳥たちは 毎朝 楽しい 歌を 歌います。',
      4: '鳥達は 毎朝 楽しい 歌を 歌います。',
      5: '鳥達は 毎朝 楽しい 歌を 歌います。',
      6: '鳥達は 毎朝 楽しい 歌を 歌います。',
    },
    words: ['Birds', 'sing', 'happy', 'songs', 'every', 'morning'],
    emoji: '🐦',
    category: 'nature',
  },
  {
    id: '12',
    english: 'I can see many stars at night.',
    japanese: 'よるに たくさんの ほしが みえます。',
    jaKanji: {
      1: 'よるに たくさんの ほしが 見えます。',
      2: '夜に たくさんの 星が 見えます。',
      3: '夜に たくさんの 星が 見えます。',
      4: '夜に たくさんの 星が 見えます。',
      5: '夜に たくさんの 星が 見えます。',
      6: '夜に たくさんの 星が 見えます。',
    },
    words: ['I', 'can', 'see', 'many', 'stars', 'at', 'night'],
    emoji: '⭐',
    category: 'nature',
  },

  // Family & Friends - 家族と友達
  {
    id: '13',
    english: 'My family goes to the beach in summer.',
    japanese: 'かぞくは なつに うみに いきます。',
    jaKanji: {
      1: 'かぞくは なつに うみに 行きます。',
      2: '家ぞくは 夏に うみに 行きます。',
      3: '家族は 夏に 海に 行きます。',
      4: '家族は 夏に 海に 行きます。',
      5: '家族は 夏に 海に 行きます。',
      6: '家族は 夏に 海に 行きます。',
    },
    words: ['My', 'family', 'goes', 'to', 'the', 'beach', 'in', 'summer'],
    emoji: '🏖️',
    category: 'family',
  },
  {
    id: '14',
    english: 'I help my father wash the car.',
    japanese: 'わたしは おとうさんの くるまあらいを てつだいます。',
    jaKanji: {
      1: 'わたしは お父さんの 車あらいを 手つだいます。',
      2: 'わたしは お父さんの 車あらいを 手つだいます。',
      3: 'わたしは お父さんの 車あらいを 手つだいます。',
      4: 'わたしは お父さんの 車あらいを 手伝います。',
      5: 'わたしは お父さんの 車あらいを 手伝います。',
      6: '私は お父さんの 車洗いを 手伝います。',
    },
    words: ['I', 'help', 'my', 'father', 'wash', 'the', 'car'],
    emoji: '🚗',
    category: 'family',
  },
  {
    id: '15',
    english: 'My best friend and I play together.',
    japanese: 'しんゆうと わたしは いっしょに あそびます。',
    jaKanji: {
      1: 'しんゆうと わたしは いっしょに あそびます。',
      2: 'しん友と わたしは いっしょに あそびます。',
      3: 'しん友と わたしは 一しょに 遊びます。',
      4: '親友と わたしは 一緒に 遊びます。',
      5: '親友と わたしは 一緒に 遊びます。',
      6: '親友と 私は 一緒に 遊びます。',
    },
    words: ['My', 'best', 'friend', 'and', 'I', 'play', 'together'],
    emoji: '👫',
    category: 'family',
  },
];

const categories = [
  { id: 'all', name: { en: 'All Sentences', ja: 'すべてのぶんしょう' }, emoji: '📝' },
  { id: 'daily', name: { en: 'Daily Life', ja: 'にちじょう' }, emoji: '🏠' },
  { id: 'school', name: { en: 'School', ja: 'がっこう' }, emoji: '🏫' },
  { id: 'nature', name: { en: 'Nature', ja: 'しぜん' }, emoji: '🌳' },
  { id: 'family', name: { en: 'Family', ja: 'かぞく' }, emoji: '👨‍👩‍👧‍👦' },
];

interface WordOrderGame {
  sentence: Sentence;
  shuffledWords: string[];
  selectedWords: string[];
  isCorrect: boolean | null;
}

export function VocabularyGamePage(): JSX.Element {
  const { language, kanjiGrade } = useLanguage();
  const { playSound, speak } = useAudio();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentGame, setCurrentGame] = useState<WordOrderGame | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName');
    setUserName(name ?? '');
  }, []);

  const filteredSentences =
    selectedCategory === 'all'
      ? sentences
      : sentences.filter((item) => item.category === selectedCategory);

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
    setShowHint(false);
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

  const checkAnswer = async (): Promise<void> => {
    if (!currentGame) {
      return;
    }

    // Remove punctuation from the sentence for comparison
    const sentenceWithoutPunctuation = currentGame.sentence.english.replace(/[.,!?]/g, '');
    const userAnswer = currentGame.selectedWords.join(' ');
    const isCorrect = userAnswer === sentenceWithoutPunctuation;
    setCurrentGame({ ...currentGame, isCorrect });

    // Calculate score based on correctness and sentence length
    const baseScore = isCorrect ? currentGame.sentence.words.length * 10 : 5;
    const bonusScore = isCorrect ? (showHint ? 0 : 20) : 0; // Bonus for not using hint
    const totalScore = baseScore + bonusScore;

    if (isCorrect) {
      setScore(score + totalScore);
    }

    // Save progress to localStorage
    if (userName.length > 0) {
      progressService.updateSentencePracticeProgress(
        userName,
        currentGame.sentence.id,
        isCorrect,
        totalScore,
      );
    }

    if (isCorrect) {
      await playSound('success');
      speak(currentGame.sentence.english, 'en');
    } else {
      await playSound('error');
    }
  };

  const handleBack = async (): Promise<void> => {
    await playSound('click');
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
    speak(currentGame.sentence.english, 'en');
  };

  const toggleHint = async (): Promise<void> => {
    await playSound('click');
    setShowHint(!showHint);
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
            {language === 'ja' ? 'ぶんしょうれんしゅう' : 'Sentence Practice'} 📝
          </h1>
          <div className="text-lg font-bold text-purple-600">Score: {score}</div>
        </div>

        {!currentGame ? (
          <>
            {/* 漢字レベル選択 */}
            <div className="flex justify-center mb-4">
              <KanjiGradeSelector />
            </div>

            {/* カテゴリー選択 */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {categories.map((category) => (
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
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredSentences.map((sentence, index) => (
                  <motion.button
                    key={sentence.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startGame(sentence)}
                    className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all"
                  >
                    <div className="text-4xl mb-3">{sentence.emoji}</div>
                    <div className="text-base font-medium text-gray-800 mb-2">
                      {sentence.english}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'ja' ? sentence.jaKanji[kanjiGrade] : sentence.english}
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          /* ゲーム画面 */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
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
                    onClick={toggleHint}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    💡 {language === 'ja' ? 'ヒント' : 'Hint'}
                  </button>
                </div>
              </div>

              <div className="text-xl text-gray-800 mb-2">
                {language === 'ja'
                  ? currentGame.sentence.jaKanji[kanjiGrade]
                  : currentGame.sentence.english}
              </div>

              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-lg text-gray-600 italic"
                >
                  {currentGame.sentence.english}
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
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
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
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
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
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-yellow-50 rounded-lg text-center"
              >
                <p className="text-gray-700">
                  {language === 'ja' ? 'せいかい:' : 'Correct answer:'}
                </p>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {currentGame.sentence.english}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
