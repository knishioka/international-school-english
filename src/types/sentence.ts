import type { BilingualText, KanjiText } from './common';

export interface Sentence extends BilingualText {
  id: string;
  jaKanji: KanjiText;
  words: string[];
  emoji: string;
  category: string;
}
