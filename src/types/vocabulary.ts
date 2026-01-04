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
