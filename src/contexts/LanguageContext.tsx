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
    sentencePractice: 'Sentence Practice',
    stories: 'Story Time',
    myProgress: 'My Progress',
    back: 'Back',
    read: 'Read',
    next: 'Next',
    previous: 'Previous',
    chooseGrade: 'Choose Grade',
  },
  ja: {
    welcome: 'えいごをまなぼう！',
    start: 'はじめる',
    hello: 'こんにちは',
    name: 'なまえ',
    enterName: 'なまえをいれてね',
    letsPlay: 'あそぼう！',
    alphabet: 'アルファベット',
    sentencePractice: 'ぶんしょうれんしゅう',
    stories: 'おはなし',
    myProgress: 'がくしゅうきろく',
    back: 'もどる',
    read: 'よむ',
    next: 'つぎ',
    previous: 'まえ',
    chooseGrade: 'がくねんをえらぶ',
  },
};

// 学年別の日本語表記
const kanjiTranslations: { [key in KanjiGrade]: { [key: string]: string } } = {
  1: {
    sentencePractice: 'ぶんしょう れんしゅう',
    stories: 'おはなし',
    myProgress: 'がくしゅう きろく',
    kanjiLevel: 'かんじ レベル',
    grade1: 'しょうがく1ねんせい',
    grade2: 'しょうがく2ねんせい',
    grade3: 'しょうがく3ねんせい',
    grade4: 'しょうがく4ねんせい',
    grade5: 'しょうがく5ねんせい',
    grade6: 'しょうがく6ねんせい',
  },
  2: {
    sentencePractice: '文しょう れんしゅう',
    stories: 'お話',
    myProgress: '学しゅう きろく',
    kanjiLevel: '漢字 レベル',
    grade1: '小学1年生',
    grade2: '小学2年生',
    grade3: '小学3年生',
    grade4: '小学4年生',
    grade5: '小学5年生',
    grade6: '小学6年生',
  },
  3: {
    sentencePractice: '文章 練習',
    stories: 'お話',
    myProgress: '学習 記録',
    kanjiLevel: '漢字 レベル',
    grade1: '小学1年生',
    grade2: '小学2年生',
    grade3: '小学3年生',
    grade4: '小学4年生',
    grade5: '小学5年生',
    grade6: '小学6年生',
  },
  4: {
    sentencePractice: '文章 練習',
    stories: 'お話',
    myProgress: '学習 記録',
    kanjiLevel: '漢字 レベル',
    grade1: '小学1年生',
    grade2: '小学2年生',
    grade3: '小学3年生',
    grade4: '小学4年生',
    grade5: '小学5年生',
    grade6: '小学6年生',
  },
  5: {
    sentencePractice: '文章 練習',
    stories: 'お話',
    myProgress: '学習 記録',
    kanjiLevel: '漢字 レベル',
    grade1: '小学1年生',
    grade2: '小学2年生',
    grade3: '小学3年生',
    grade4: '小学4年生',
    grade5: '小学5年生',
    grade6: '小学6年生',
  },
  6: {
    sentencePractice: '文章 練習',
    stories: 'お話',
    myProgress: '学習 記録',
    kanjiLevel: '漢字 レベル',
    grade1: '小学1年生',
    grade2: '小学2年生',
    grade3: '小学3年生',
    grade4: '小学4年生',
    grade5: '小学5年生',
    grade6: '小学6年生',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }): JSX.Element {
  const [language, setLanguage] = useState<Language>('ja');
  const [kanjiGrade, setKanjiGrade] = useState<KanjiGrade>(1);

  const t = (key: string): string => {
    // 英語の場合は通常の翻訳を返す
    if (language === 'en') {
      return translations[language][key as keyof (typeof translations)['en']] || key;
    }

    // 日本語の場合、まず学年別の翻訳を確認
    const kanjiTranslation = kanjiTranslations[kanjiGrade]?.[key];
    if (kanjiTranslation) {
      return kanjiTranslation;
    }

    // 学年別翻訳がない場合は通常の翻訳を返す
    return translations[language][key as keyof (typeof translations)['ja']] || key;
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
