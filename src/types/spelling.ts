export interface SpellingWord {
  id: string;
  word: string;
  japanese: string;
  category: string;
  hint: string;
  image: string;
  emoji: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
