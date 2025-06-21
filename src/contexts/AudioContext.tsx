import { createContext, useContext, ReactNode, useCallback, useRef } from 'react';

interface AudioContextType {
  playSound: (soundName: string) => Promise<void>;
  speak: (text: string, lang?: 'en' | 'ja') => void;
  initializeAudio: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const soundFiles: Record<string, string> = {
  click: '/sounds/click.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  complete: '/sounds/complete.mp3',
};

export function AudioProvider({ children }: { children: ReactNode }): JSX.Element {
  const audioInitialized = useRef(false);
  const audioContext = useRef<AudioContext | null>(null);

  const initializeAudio = useCallback(async (): Promise<void> => {
    if (audioInitialized.current) {
      return;
    }

    try {
      // Initialize AudioContext for iOS/iPad compatibility
      if ('AudioContext' in window || 'webkitAudioContext' in window) {
        const AudioContextClass =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass !== null) {
          audioContext.current = new AudioContextClass();

          if (audioContext.current?.state === 'suspended') {
            await audioContext.current.resume();
          }
        }
      }

      // Preload a silent audio to unlock iOS audio
      const silentAudio = new Audio(
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8t2QQAoUXrTp66hVFApGn+LwuVkeAUCL0fPTgjkIGGS57+OZFQ0PUKXh87BdGgU+ltXzzn8qBSl+yO/eizELClym4+6nUxELRJjd8sFcFAI7mtDzzXkpBR13y/DajCwKDoXM7+CUOwkUbr7q9Z1NEw1No+H0sV0aBT+V0vHJdCUELn7K8N2TRAsVW7Hn9aFYEwtOkdzyxnEtBSaAxtHzjz0LDV6q5u2nUhMPSJPi8LBdJgdAfsvtz4M2BxprweLvpngSCkt5xO/YgTQGFGS25ueXOg8bSJbg8ctlJAcxf8zw2I4/ChVes+fwp1oTDkil4PKzaxsGPJfQ8ct8KAQghM7u44Y3BxplvePlll8JDVOW3vG+ZRAQQXi86+WEQR8PKHbE7tiEKwUWbcLyqZFPFBBJnN/zxGwxBxZ+zPDbKzwNDViq5eSJXRQLRJ7g8LNdGwU8l9LxjC0oBSCC1e7chjsBGmTA5uSdRAINEHbH7tuPQhsDKX7K8OGSOwodVrLm5Z9OEgtOltf0v1wQKCN1wO3TSSUEOHjO8tiLMgoWa8Hspn0SDEJH0fi1ayIILXnJ7eOBWgENGG3D6eSSZxMOQ5je9LhfJHNGZ2cGPIzN+tiHNw4daLvmw2YaFCt6wO6lfgUSB2+24K9jHwYCJYXL79aKNAQYsePEeiwFCG/G9NiPRAsWUJ3m86BeHQQ7mdeKvXgDBTuYyPT1qGwcBT2dzfTaOzUOF2m05tKfThIMSJzh8qRAFgI5kcvxzXnKPwfg8rBEHgdSqeLzu2MRBDuX2e7XizwNEV+/3+KOWggCJ4TQ8du...',
      );
      await silentAudio.play();

      // Initialize Speech Synthesis for iOS
      if ('speechSynthesis' in window) {
        const testUtterance = new SpeechSynthesisUtterance(' ');
        testUtterance.volume = 0;
        window.speechSynthesis.speak(testUtterance);
        window.speechSynthesis.cancel();
      }

      audioInitialized.current = true;
    } catch (error) {
      // Silently fail - audio might still work without initialization
    }
  }, []);

  const playSound = useCallback(async (soundName: string): Promise<void> => {
    try {
      const soundUrl = soundFiles[soundName];
      if (!soundUrl) {
        return;
      }

      const audio = new Audio(soundUrl);
      audio.volume = 0.5;

      // Ensure audio context is resumed for iOS
      if (audioContext.current?.state === 'suspended') {
        await audioContext.current.resume();
      }

      await audio.play();
    } catch (error) {
      // Silently fail if audio cannot be played
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

    // Direct execution without setTimeout to preserve user gesture context
    window.speechSynthesis.speak(utterance);
  }, []);

  return (
    <AudioContext.Provider value={{ playSound, speak, initializeAudio }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
