import { createContext, useContext, ReactNode, useCallback } from 'react';

interface AudioContextType {
  playSound: (soundName: string) => Promise<void>;
  speak: (text: string, lang?: 'en' | 'ja') => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const soundFiles: Record<string, string> = {
  click: '/sounds/click.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  complete: '/sounds/complete.mp3',
};

export function AudioProvider({ children }: { children: ReactNode }): JSX.Element {
  const playSound = useCallback(async (soundName: string): Promise<void> => {
    try {
      const soundUrl = soundFiles[soundName];
      if (!soundUrl) {
        return;
      }

      const audio = new Audio(soundUrl);
      audio.volume = 0.5;
      await audio.play();
    } catch (error) {
      // Silently fail if audio cannot be played
      // console.error('Failed to play sound:', error);
    }
  }, []);

  const speak = useCallback((text: string, lang: 'en' | 'ja' = 'en'): void => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ja' ? 'ja-JP' : 'en-US';
    utterance.rate = 0.8; // Slower for children
    utterance.pitch = 1.1; // Slightly higher pitch

    // For iOS/iPad compatibility, we need to use a slight delay
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 10);
  }, []);

  return <AudioContext.Provider value={{ playSound, speak }}>{children}</AudioContext.Provider>;
}

export function useAudio(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
