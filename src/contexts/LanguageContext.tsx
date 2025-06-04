import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
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
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }): JSX.Element {
  const [language, setLanguage] = useState<Language>('ja');

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
