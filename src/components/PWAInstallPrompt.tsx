import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt(): JSX.Element | null {
  const { language } = useLanguage();
  const { playSound } = useAudio();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if running as installed PWA on iOS
    const nav = window.navigator as unknown as { standalone?: boolean };
    if (nav.standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event): void => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show prompt after a delay to not be too intrusive
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000); // 30 seconds
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async (): Promise<void> => {
    if (!deferredPrompt) {
      return;
    }

    await playSound('click');

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }

    // Clear the prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = async (): Promise<void> => {
    await playSound('click');
    setShowPrompt(false);

    // Don't show again for a week
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Don't show if already installed or recently dismissed
  useEffect(() => {
    const dismissedTime = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissedTime !== null && dismissedTime.length > 0) {
      const weekInMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(dismissedTime, 10) < weekInMs) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (!showPrompt || !deferredPrompt || isInstalled) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-purple-200">
          <div className="flex items-start gap-4">
            <div className="text-4xl">📱</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {language === 'ja' ? 'アプリをインストール' : 'Install Our App'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {language === 'ja'
                  ? 'ホーム画面に追加して、いつでもすぐに学習できます！'
                  : 'Add to your home screen for quick access to learning!'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleInstall}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                >
                  {language === 'ja' ? 'インストール' : 'Install'}
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {language === 'ja' ? 'あとで' : 'Later'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
