export type SpellingDifficulty = 'easy' | 'medium' | 'hard';

export interface SpellingWord {
  id: string;
  word: string;
  japanese: string;
  category: string;
  hint: string;
  image: string;
  emoji: string;
  difficulty: SpellingDifficulty;
}
