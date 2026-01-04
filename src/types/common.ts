export interface KanjiText {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
}

export interface BilingualText {
  en: string;
  ja: string;
}

export interface MultilingualText extends BilingualText {
  jaKanji: KanjiText;
}
