import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ja';
export type KanjiGrade = 1 | 2 | 3 | 4 | 5 | 6;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  kanjiGrade: KanjiGrade;
  setKanjiGrade: (grade: KanjiGrade) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    welcome: 'Welcome to English Learning!',
    start: 'Start',
    hello: 'Hello',
    name: 'Name',
    enterName: 'Enter your name',
    letsPlay: "Let's Play!",
    alphabet: 'Alphabet',
    vocabulary: 'Vocabulary',
    stories: 'Stories',
    myProgress: 'My Progress',
    back: 'Back',
    read: 'Read',
    next: 'Next',
    previous: 'Previous',
  },
  ja: {
    welcome: 'えいごをまなぼう！',
    start: 'はじめる',
    hello: 'こんにちは',
    name: 'なまえ',
    enterName: 'なまえをいれてね',
    letsPlay: 'あそぼう！',
    alphabet: 'アルファベット',
    vocabulary: 'たんご',
    stories: 'おはなし',
    myProgress: 'がくしゅうきろく',
    back: 'もどる',
    read: 'よむ',
    next: 'つぎ',
    previous: 'まえ',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }): JSX.Element {
  const [language, setLanguage] = useState<Language>('ja');
  const [kanjiGrade, setKanjiGrade] = useState<KanjiGrade>(1);

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, kanjiGrade, setKanjiGrade, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
