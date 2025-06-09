import { useState, useMemo } from 'react';
import { filterByCategory } from '@/utils/arrayUtils';
import type { Category } from '@/types/vocabulary';

/**
 * カテゴリー選択機能を提供するカスタムフック
 */
export function useCategory<T extends { category: string }>(
  items: T[],
  categories: Category[],
): {
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
  filteredItems: T[];
  categories: Category[];
  resetCategory: () => void;
  hasSelection: boolean;
} {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = useMemo(
    () => filterByCategory(items, selectedCategory),
    [items, selectedCategory],
  );

  const handleCategorySelect = (categoryId: string): void => {
    setSelectedCategory(categoryId);
  };

  const resetCategory = (): void => {
    setSelectedCategory('all');
  };

  return {
    selectedCategory,
    setSelectedCategory: handleCategorySelect,
    filteredItems,
    categories,
    resetCategory,
    hasSelection: selectedCategory !== 'all',
  };
}
