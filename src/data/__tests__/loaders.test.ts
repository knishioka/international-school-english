import { stories } from '@/data/stories';
import { sentences } from '@/data/sentences';
import { spellingWords } from '@/data/spelling';
import { filterByCategory, filterByDifficulty, sortById } from '@/data/loaders';

describe('data loaders', () => {
  it('returns all stories', () => {
    expect(stories).toHaveLength(30);
  });

  it('filters sentences by category', () => {
    const dailySentences = filterByCategory(sentences, 'daily');

    expect(dailySentences).toHaveLength(4);
    expect(dailySentences.every((sentence) => sentence.category === 'daily')).toBe(true);
  });

  it('filters spelling words by difficulty', () => {
    const easyWords = filterByDifficulty(spellingWords, 'easy');

    expect(easyWords).toHaveLength(6);
    expect(easyWords.every((word) => word.difficulty === 'easy')).toBe(true);
  });

  it('sorts by id in ascending order', () => {
    const items = [
      { id: '10', value: 'ten' },
      { id: '2', value: 'two' },
      { id: '1', value: 'one' },
    ];

    const sorted = sortById(items);

    expect(sorted.map((item) => item.id)).toEqual(['1', '2', '10']);
  });
});
