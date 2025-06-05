import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface PageFlipProps {
  children: ReactNode;
  pageKey: string | number;
  direction?: 'left' | 'right';
  className?: string;
}

export function PageFlip({ children, pageKey, direction = 'right', className = '' }: PageFlipProps): JSX.Element {
  const pageVariants = {
    initial: {
      opacity: 0,
      x: direction === 'right' ? 100 : -100,
      rotateY: direction === 'right' ? 45 : -45,
      scale: 0.9,
    },
    animate: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      x: direction === 'right' ? -100 : 100,
      rotateY: direction === 'right' ? -45 : 45,
      scale: 0.9,
    },
  };

  const pageTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  };

  return (
    <div className={`perspective-1000 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={pageKey}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
          className="w-full h-full preserve-3d"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}