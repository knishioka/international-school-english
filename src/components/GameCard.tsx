import { motion } from 'framer-motion';

interface GameCardProps {
  title: string;
  icon: string;
  color: string;
  onClick: () => void;
}

export function GameCard({ title, icon, color, onClick }: GameCardProps): JSX.Element {
  return (
    <motion.button
      whileHover={{ scale: 1.05, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`game-card ${color} w-full h-48 flex flex-col items-center justify-center gap-4 will-change-transform`}
      aria-label={`Play ${title} game`}
      style={{ transform: 'translateZ(0)' }}
    >
      <div className="text-6xl">{icon}</div>
      <h3 className="text-2xl font-display font-bold text-gray-800">{title}</h3>
    </motion.button>
  );
}
