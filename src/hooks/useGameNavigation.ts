import { useNavigate } from 'react-router-dom';
import { useAudio } from '@/contexts/AudioContext';

/**
 * ゲーム共通のナビゲーション機能を提供するカスタムフック
 */
export function useGameNavigation(): {
  handleBack: () => Promise<void>;
  navigateToGame: (path: string) => Promise<void>;
} {
  const navigate = useNavigate();
  const { playSound } = useAudio();

  const handleBack = async (): Promise<void> => {
    await playSound('click');
    navigate('/home');
  };

  const navigateToGame = async (path: string): Promise<void> => {
    await playSound('click');
    navigate(path);
  };

  return {
    handleBack,
    navigateToGame,
  };
}
