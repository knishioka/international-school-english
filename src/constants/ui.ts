/**
 * UI関連の定数
 */
export const UI_CONSTANTS = {
  ANIMATION: {
    CARD_FLIP_DURATION: 0.6,
    PAGE_TRANSITION_DURATION: 0.3,
    HOVER_SCALE: 1.05,
    TAP_SCALE: 0.95,
    SPRING_CONFIG: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
    },
  },
  SIZES: {
    MIN_TOUCH_TARGET: 44,
    CARD_WIDTH: 320,
    CARD_HEIGHT: 384,
    HEADER_HEIGHT: 80,
  },
  COLORS: {
    PRIMARY_GRADIENT: 'from-purple-500 to-pink-500',
    PRIMARY_GRADIENT_HOVER: 'from-purple-600 to-pink-600',
    SUCCESS_COLOR: 'green-500',
    ERROR_COLOR: 'red-500',
    WARNING_COLOR: 'yellow-500',
    INFO_COLOR: 'blue-500',
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
  },
} as const;
