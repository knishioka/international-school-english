import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';
import { FlashCard } from '@/components/FlashCard';

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

const vocabularyWords: VocabularyWord[] = [
  // Basic Foods - 食べ物
  {
    id: '1',
    english: 'apple',
    japanese: 'りんご',
    romaji: 'ringo',
    category: 'food',
    image: '/images/apple.jpg',
    emoji: '🍎',
    example: {
      english: 'I like red apples.',
      japanese: 'あかい りんごが すきです。'
    }
  },
  {
    id: '2',
    english: 'banana',
    japanese: 'バナナ',
    romaji: 'banana',
    category: 'food',
    image: '/images/banana.jpg',
    emoji: '🍌',
    example: {
      english: 'Bananas are yellow.',
      japanese: 'バナナは きいろです。'
    }
  },
  {
    id: '3',
    english: 'milk',
    japanese: 'ぎゅうにゅう',
    romaji: 'gyuunyuu',
    category: 'food',
    image: '/images/milk.jpg',
    emoji: '🥛',
    example: {
      english: 'I drink milk every day.',
      japanese: 'まいにち ぎゅうにゅうを のみます。'
    }
  },
  {
    id: '4',
    english: 'bread',
    japanese: 'パン',
    romaji: 'pan',
    category: 'food',
    image: '/images/bread.jpg',
    emoji: '🍞',
    example: {
      english: 'I eat bread for breakfast.',
      japanese: 'あさごはんに パンを たべます。'
    }
  },
  // Animals - 動物
  {
    id: '5',
    english: 'cat',
    japanese: 'ねこ',
    romaji: 'neko',
    category: 'animals',
    image: '/images/cat.jpg',
    emoji: '🐱',
    example: {
      english: 'The cat is sleeping.',
      japanese: 'ねこが ねています。'
    }
  },
  {
    id: '6',
    english: 'dog',
    japanese: 'いぬ',
    romaji: 'inu',
    category: 'animals',
    image: '/images/dog.jpg',
    emoji: '🐶',
    example: {
      english: 'My dog is very cute.',
      japanese: 'わたしの いぬは とても かわいいです。'
    }
  },
  {
    id: '7',
    english: 'bird',
    japanese: 'とり',
    romaji: 'tori',
    category: 'animals',
    image: '/images/bird.jpg',
    emoji: '🐦',
    example: {
      english: 'Birds can fly in the sky.',
      japanese: 'とりは そらを とべます。'
    }
  },
  {
    id: '8',
    english: 'fish',
    japanese: 'さかな',
    romaji: 'sakana',
    category: 'animals',
    image: '/images/fish.jpg',
    emoji: '🐟',
    example: {
      english: 'Fish live in the water.',
      japanese: 'さかなは みずの なかに すんでいます。'
    }
  },
  // Colors - 色
  {
    id: '9',
    english: 'red',
    japanese: 'あか',
    romaji: 'aka',
    category: 'colors',
    image: '/images/red.jpg',
    emoji: '🔴',
    example: {
      english: 'The apple is red.',
      japanese: 'りんごは あかいです。'
    }
  },
  {
    id: '10',
    english: 'blue',
    japanese: 'あお',
    romaji: 'ao',
    category: 'colors',
    image: '/images/blue.jpg',
    emoji: '🔵',
    example: {
      english: 'The sky is blue.',
      japanese: 'そらは あおいです。'
    }
  },
  {
    id: '11',
    english: 'yellow',
    japanese: 'きいろ',
    romaji: 'kiiro',
    category: 'colors',
    image: '/images/yellow.jpg',
    emoji: '🟡',
    example: {
      english: 'The sun is yellow.',
      japanese: 'たいようは きいろです。'
    }
  },
  {
    id: '12',
    english: 'green',
    japanese: 'みどり',
    romaji: 'midori',
    category: 'colors',
    image: '/images/green.jpg',
    emoji: '🟢',
    example: {
      english: 'Leaves are green.',
      japanese: 'はっぱは みどりです。'
    }
  },
  // Family - 家族
  {
    id: '13',
    english: 'mother',
    japanese: 'おかあさん',
    romaji: 'okaasan',
    category: 'family',
    image: '/images/mother.jpg',
    emoji: '👩',
    example: {
      english: 'My mother is kind.',
      japanese: 'わたしの おかあさんは やさしいです。'
    }
  },
  {
    id: '14',
    english: 'father',
    japanese: 'おとうさん',
    romaji: 'otousan',
    category: 'family',
    image: '/images/father.jpg',
    emoji: '👨',
    example: {
      english: 'My father works hard.',
      japanese: 'わたしの おとうさんは よく はたらきます。'
    }
  },
  {
    id: '15',
    english: 'sister',
    japanese: 'いもうと',
    romaji: 'imouto',
    category: 'family',
    image: '/images/sister.jpg',
    emoji: '👧',
    example: {
      english: 'My sister likes dolls.',
      japanese: 'わたしの いもうとは にんぎょうが すきです。'
    }
  },
  // School - 学校
  {
    id: '16',
    english: 'book',
    japanese: 'ほん',
    romaji: 'hon',
    category: 'school',
    image: '/images/book.jpg',
    emoji: '📚',
    example: {
      english: 'I read a book every night.',
      japanese: 'まいばん ほんを よみます。'
    }
  },
  {
    id: '17',
    english: 'pencil',
    japanese: 'えんぴつ',
    romaji: 'enpitsu',
    category: 'school',
    image: '/images/pencil.jpg',
    emoji: '✏️',
    example: {
      english: 'I write with a pencil.',
      japanese: 'えんぴつで かきます。'
    }
  },
  {
    id: '18',
    english: 'school',
    japanese: 'がっこう',
    romaji: 'gakkou',
    category: 'school',
    image: '/images/school.jpg',
    emoji: '🏫',
    example: {
      english: 'I go to school every day.',
      japanese: 'まいにち がっこうに いきます。'
    }
  }
];

const categories = [
  { id: 'all', name: { en: 'All Words', ja: 'すべての ことば' }, emoji: '📝' },
  { id: 'food', name: { en: 'Food', ja: 'たべもの' }, emoji: '🍎' },
  { id: 'animals', name: { en: 'Animals', ja: 'どうぶつ' }, emoji: '🐱' },
  { id: 'colors', name: { en: 'Colors', ja: 'いろ' }, emoji: '🌈' },
  { id: 'family', name: { en: 'Family', ja: 'かぞく' }, emoji: '👨‍👩‍👧‍👦' },
  { id: 'school', name: { en: 'School', ja: 'がっこう' }, emoji: '🏫' },
];

export function FlashCardPage(): JSX.Element {
  const { language } = useLanguage();
  const { playSound } = useAudio();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const filteredWords = selectedCategory === 'all' 
    ? vocabularyWords 
    : vocabularyWords.filter(word => word.category === selectedCategory);

  const currentWord = filteredWords[currentIndex];

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
    if (currentIndex < filteredWords.length - 1) {
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {language === 'ja' ? 'カテゴリーを えらんでね' : 'Choose a Category'}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`
                    p-6 rounded-2xl transition-all hover:scale-105
                    ${selectedCategory === category.id
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-white text-gray-800 hover:bg-purple-50 shadow-md'
                    }
                  `}
                >
                  <div className="text-4xl mb-2">{category.emoji}</div>
                  <div className="font-medium">
                    {language === 'ja' ? category.name.ja : category.name.en}
                  </div>
                  <div className="text-sm mt-1 opacity-75">
                    {category.id === 'all' 
                      ? vocabularyWords.length 
                      : vocabularyWords.filter(w => w.category === category.id).length
                    } {language === 'ja' ? 'ことば' : 'words'}
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={handleStartGame}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
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
          <button
            onClick={handleBackToMenu}
            className="text-2xl p-2 hover:bg-white/50 rounded-lg transition-colors"
            aria-label="Back to menu"
          >
            ←
          </button>
          <h1 className="text-2xl font-display font-bold text-gray-800">
            {categories.find(c => c.id === selectedCategory)?.emoji}{' '}
            {language === 'ja' 
              ? categories.find(c => c.id === selectedCategory)?.name.ja
              : categories.find(c => c.id === selectedCategory)?.name.en
            }
          </h1>
          <div className="w-10" />
        </div>

        {/* フラッシュカード */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <FlashCard
            word={currentWord}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={currentIndex === 0}
            isLast={currentIndex === filteredWords.length - 1}
            currentIndex={currentIndex}
            totalCount={filteredWords.length}
          />
        </motion.div>

        {/* 完了メッセージ */}
        {currentIndex === filteredWords.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8"
          >
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-xl font-bold text-gray-800">
              {language === 'ja' ? 'おつかれさま！' : 'Great job!'}
            </p>
            <p className="text-gray-600">
              {language === 'ja' 
                ? 'すべての たんごを おぼえましたね！' 
                : 'You\'ve reviewed all the words!'
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}