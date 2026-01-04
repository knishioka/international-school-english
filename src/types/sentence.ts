import type { KanjiText } from './common';

export interface Sentence {
  id: string;
  english: string;
  japanese: string;
  jaKanji: KanjiText;
  words: string[];
  emoji: string;
  category: string;
}
