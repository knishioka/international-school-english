import { createContext, useContext, ReactNode, useCallback, useRef, useState } from 'react';
import { detectLanguage, getOptimalVoiceSettings, findBestVoice } from '@/utils/languageDetection';

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
  const audioElementsCache = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [userInteracted, setUserInteracted] = useState(false);

  const initializeAudio = useCallback(async (): Promise<void> => {
    if (audioInitialized.current) {
      return;
    }

    try {
      setUserInteracted(true);

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

      // Preload all audio files
      try {
        for (const [soundName, soundUrl] of Object.entries(soundFiles)) {
          const audio = new Audio();
          audio.preload = 'auto';
          audio.volume = 0.5;
          audio.crossOrigin = 'anonymous';

          // Use absolute URL for better iOS compatibility
          const fullUrl = soundUrl.startsWith('/')
            ? `${window.location.origin}${soundUrl}`
            : soundUrl;
          audio.src = fullUrl;

          audioElementsCache.current.set(soundName, audio);
        }
      } catch (preloadError) {
        // Silently handle preload errors
      }

      // Initialize Speech Synthesis for iOS
      if ('speechSynthesis' in window) {
        try {
          // Wait for voices to load on iOS
          const waitForVoices = (): Promise<void> => {
            return new Promise((resolve) => {
              const voices = window.speechSynthesis.getVoices();
              if (voices.length > 0) {
                resolve();
              } else {
                window.speechSynthesis.addEventListener('voiceschanged', () => resolve(), {
                  once: true,
                });
              }
            });
          };

          await waitForVoices();

          const testUtterance = new SpeechSynthesisUtterance(' ');
          testUtterance.volume = 0;
          window.speechSynthesis.speak(testUtterance);
          window.speechSynthesis.cancel();
        } catch (speechError) {
          // Silently handle speech errors
        }
      }

      audioInitialized.current = true;
    } catch (error) {
      // Silently handle initialization errors
    }
  }, []);

  const playSound = useCallback(
    async (soundName: string): Promise<void> => {
      try {
        if (!userInteracted) {
          return;
        }

        // Try to use cached audio element first
        let audio = audioElementsCache.current.get(soundName);

        if (!audio) {
          const soundUrl = soundFiles[soundName];
          if (!soundUrl) {
            return;
          }

          audio = new Audio();
          audio.volume = 0.5;
          audio.crossOrigin = 'anonymous';

          // Use absolute URL for better iOS compatibility
          const fullUrl = soundUrl.startsWith('/')
            ? `${window.location.origin}${soundUrl}`
            : soundUrl;
          audio.src = fullUrl;

          audioElementsCache.current.set(soundName, audio);
        }

        // Reset audio to beginning
        audio.currentTime = 0;

        // Ensure audio context is resumed for iOS
        if (audioContext.current?.state === 'suspended') {
          await audioContext.current.resume();
        }

        try {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            await playPromise;
          }
        } catch (playError) {
          // Fallback: Try to use Web Audio API if available
          if (audioContext.current && audioContext.current.state === 'running') {
            try {
              // Create a simple beep as fallback
              const oscillator = audioContext.current.createOscillator();
              const gainNode = audioContext.current.createGain();

              oscillator.connect(gainNode);
              gainNode.connect(audioContext.current.destination);

              oscillator.frequency.setValueAtTime(800, audioContext.current.currentTime);
              gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.current.currentTime + 0.1,
              );

              oscillator.start(audioContext.current.currentTime);
              oscillator.stop(audioContext.current.currentTime + 0.1);
            } catch (webAudioError) {
              // Silently handle fallback errors
            }
          }
        }
      } catch (error) {
        // Silently handle sound play errors
      }
    },
    [userInteracted],
  );

  const speak = useCallback((text: string, lang?: 'en' | 'ja'): void => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // 言語が指定されていない場合は自動検出
      const detectedLang = lang || detectLanguage(text);

      // 最適な音声設定を取得
      const voiceSettings = getOptimalVoiceSettings(detectedLang);

      // 最適な音声を選択
      const bestVoice = findBestVoice(detectedLang);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceSettings.lang;
      utterance.rate = voiceSettings.rate;
      utterance.pitch = voiceSettings.pitch;
      utterance.volume = 1.0;

      // 最適な音声が見つかった場合は設定
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      // Direct execution without setTimeout to preserve user gesture context
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      // Silently handle speech errors
    }
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
