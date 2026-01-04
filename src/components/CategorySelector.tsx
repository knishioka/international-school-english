import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Category } from '@/types';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
  onStart: () => void;
  className?: string;
}

/**
 * カテゴリー選択の共通コンポーネント
 */
export function CategorySelector({
  categories,
  selectedCategory,
  onSelect,
  onStart,
  className = '',
}: CategorySelectorProps): JSX.Element {
  const { language } = useLanguage();

  return (
    <motion.div initial={false} className={`text-center ${className}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {language === 'ja' ? 'カテゴリーを えらんでね' : 'Choose a Category'}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            initial={false}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(category.id)}
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
          </motion.button>
        ))}
      </div>

      <motion.button
        initial={false}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
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
  );
}
