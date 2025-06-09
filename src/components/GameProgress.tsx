import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface GameProgressProps {
  current: number;
  total: number;
  progress: number;
  className?: string;
}

/**
 * ゲーム進捗表示の共通コンポーネント
 */
export function GameProgress({
  current,
  total,
  progress,
  className = '',
}: GameProgressProps): JSX.Element {
  const { language } = useLanguage();

  return (
    <div className={`text-center mb-6 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">{language === 'ja' ? '進捗' : 'Progress'}</span>
        <span className="text-sm text-gray-500">
          {current} / {total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
