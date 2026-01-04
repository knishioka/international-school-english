import type { KanjiGrade } from '@/contexts/LanguageContext';
import type { BilingualText, KanjiText, MultilingualText } from './common';

export type StoryCategory =
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

export interface StoryPage {
  text: BilingualText;
  jaKanji: KanjiText;
  emoji: string;
}

export interface Story {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  lesson: MultilingualText;
  category: StoryCategory;
  minGrade: KanjiGrade;
  pages: StoryPage[];
}
