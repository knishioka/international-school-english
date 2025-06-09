import type { KanjiGrade } from '@/contexts/LanguageContext';

export interface VocabularyWord {
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

export interface Sentence {
  id: string;
  english: string;
  japanese: string;
  jaKanji: { [key in KanjiGrade]: string };
  words: string[];
  emoji: string;
  category: string;
}

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

export interface Story {
  id: string;
  title: { en: string; ja: string; jaKanji: { [key in KanjiGrade]: string } };
  description: { en: string; ja: string; jaKanji: { [key in KanjiGrade]: string } };
  lesson: { en: string; ja: string; jaKanji: { [key in KanjiGrade]: string } };
  category:
    | 'moral'
    | 'friendship'
    | 'nature'
    | 'responsibility'
    | 'courage'
    | 'patience'
    | 'imagination'
    | 'empathy'
    | 'logic'
    | 'self-esteem'
    | 'diversity';
  minGrade: KanjiGrade;
  pages: {
    text: { en: string; ja: string };
    jaKanji: { [key in KanjiGrade]: string };
    emoji: string;
  }[];
}

export interface Category {
  id: string;
  name: { en: string; ja: string };
  emoji: string;
  color: string;
}

export interface GameState<T> {
  currentIndex: number;
  score: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  currentItem?: T;
  isCorrect?: boolean | null;
}

export interface GameProgress {
  userName: string;
  gameType: string;
  completedItems: string[];
  totalScore: number;
  lastPlayed: Date;
}
