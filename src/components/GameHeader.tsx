import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GameHeaderProps {
  title: string;
  onBack: () => void;
  children?: ReactNode;
  className?: string;
}

/**
 * ゲーム画面共通のヘッダーコンポーネント
 */
export function GameHeader({
  title,
  onBack,
  children,
  className = '',
}: GameHeaderProps): JSX.Element {
  return (
    <div className={`flex justify-between items-center mb-8 ${className}`}>
      <motion.button
        initial={false}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Go back to home"
      >
        <span className="text-xl">←</span>
      </motion.button>

      <motion.h1
        initial={false}
        className="text-3xl md:text-4xl font-bold text-center text-gray-800 px-4"
      >
        {title}
      </motion.h1>

      <div className="w-10 h-10 flex items-center justify-center">{children}</div>
    </div>
  );
}
