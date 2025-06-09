/**
 * ゲーム関連の定数
 */
export const GAME_CONSTANTS = {
  SCORING: {
    POINTS_PER_CORRECT: 10,
    POINTS_PER_HINT_PENALTY: 10,
    BONUS_NO_HINTS: 20,
    MINIMUM_POINTS: 10,
  },
  LIMITS: {
    MAX_ATTEMPTS: 3,
    MAX_HINTS: 3,
    ITEMS_PER_PAGE: 6,
  },
  TIMING: {
    SHUFFLE_SEED_INTERVAL: 60 * 60 * 1000, // 1時間
    AUTO_ADVANCE_DELAY: 2000, // 2秒
    FEEDBACK_DISPLAY_TIME: 3000, // 3秒
  },
  DIFFICULTY_LEVELS: {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
  } as const,
  CATEGORIES: {
    ALL: 'all',
    FOOD: 'food',
    ANIMALS: 'animals',
    COLORS: 'colors',
    NUMBERS: 'numbers',
    FAMILY: 'family',
    SCHOOL: 'school',
    NATURE: 'nature',
    DAILY_LIFE: 'daily-life',
  } as const,
} as const;
