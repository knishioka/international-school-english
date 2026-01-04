import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { progressService } from '@/services/progressService';
import type {
  DailyProgress,
  SentencePracticeProgress,
  StoryProgress,
  UserProgress,
} from '@/services/progressService';
import type { KanjiGrade } from '@/contexts/LanguageContext';

export interface ProgressStats {
  totalScore: number;
  completedSentences: number;
  totalSentenceAttempts: number;
  accuracy: number;
  completedStories: number;
  totalStoriesRead: number;
  streakDays: number;
  totalTimeSpent: number;
  achievements: string[];
  activitiesLast7Days: number;
  kanjiGrade: KanjiGrade;
}

interface WeeklyActivity {
  day: string;
  activities: number;
  score: number;
}

interface CategoryProgress {
  category: string;
  completed: number;
  total: number;
}

interface TimeDistribution {
  activity: string;
  minutes: number;
}

interface ProgressSnapshot {
  stats?: ProgressStats;
  weeklyActivity?: WeeklyActivity[];
  categoryProgress?: CategoryProgress[];
  timeDistribution?: TimeDistribution[];
  dailyProgress?: DailyProgress[];
  userProgress?: UserProgress;
}

interface ProgressStoreState {
  cache: Record<string, ProgressSnapshot>;
  getUserProgress: (userName: string) => UserProgress;
  updateSentencePracticeProgress: (
    userName: string,
    sentenceId: string,
    isCorrect: boolean,
    score: number,
  ) => void;
  updateStoryProgress: (
    userName: string,
    storyId: string,
    pagesRead: number,
    totalPages: number,
  ) => void;
  updateKanjiGrade: (userName: string, grade: KanjiGrade) => void;
  getProgressStats: (userName: string) => ProgressStats;
  getWeeklyActivityData: (userName: string) => WeeklyActivity[];
  getCategoryProgress: (userName: string) => CategoryProgress[];
  getTimeDistribution: (userName: string) => TimeDistribution[];
  getDailyProgressData: (userName: string, days?: number) => DailyProgress[];
  clearProgress: () => void;
  invalidateCache: (userName: string) => void;
}

const buildSnapshot = (userName: string): ProgressSnapshot => ({
  stats: progressService.getProgressStats(userName),
  weeklyActivity: progressService.getWeeklyActivityData(userName),
  categoryProgress: progressService.getCategoryProgress(userName),
  timeDistribution: progressService.getTimeDistribution(userName),
});

const updateSnapshot = (state: ProgressStoreState, userName: string): ProgressStoreState => {
  const snapshot = buildSnapshot(userName);
  return {
    ...state,
    cache: {
      ...state.cache,
      [userName]: {
        ...state.cache[userName],
        ...snapshot,
      },
    },
  };
};

export const useProgressStore = create<ProgressStoreState>()(
  devtools(
    (set, get) => ({
      cache: {},
      getUserProgress: (userName) => {
        const userProgress = progressService.getUserProgress(userName);
        set(
          (state) => ({
            cache: {
              ...state.cache,
              [userName]: {
                ...state.cache[userName],
                userProgress,
              },
            },
          }),
          false,
          { type: 'progress/getUserProgress', userName },
        );
        return userProgress;
      },
      updateSentencePracticeProgress: (userName, sentenceId, isCorrect, score) =>
        set(
          (state) => {
            progressService.updateSentencePracticeProgress(userName, sentenceId, isCorrect, score);
            return updateSnapshot(state, userName);
          },
          false,
          { type: 'progress/updateSentence', userName },
        ),
      updateStoryProgress: (userName, storyId, pagesRead, totalPages) =>
        set(
          (state) => {
            progressService.updateStoryProgress(userName, storyId, pagesRead, totalPages);
            return updateSnapshot(state, userName);
          },
          false,
          { type: 'progress/updateStory', userName },
        ),
      updateKanjiGrade: (userName, grade) =>
        set(
          (state) => {
            progressService.updateKanjiGrade(userName, grade);
            return updateSnapshot(state, userName);
          },
          false,
          { type: 'progress/updateKanjiGrade', userName },
        ),
      getProgressStats: (userName) => {
        const cached = get().cache[userName]?.stats;
        if (cached) {
          return cached;
        }
        const stats = progressService.getProgressStats(userName);
        set(
          (state) => ({
            cache: {
              ...state.cache,
              [userName]: {
                ...state.cache[userName],
                stats,
              },
            },
          }),
          false,
          { type: 'progress/getStats', userName },
        );
        return stats;
      },
      getWeeklyActivityData: (userName) => {
        const cached = get().cache[userName]?.weeklyActivity;
        if (cached) {
          return cached;
        }
        const weeklyActivity = progressService.getWeeklyActivityData(userName);
        set(
          (state) => ({
            cache: {
              ...state.cache,
              [userName]: {
                ...state.cache[userName],
                weeklyActivity,
              },
            },
          }),
          false,
          { type: 'progress/getWeeklyActivity', userName },
        );
        return weeklyActivity;
      },
      getCategoryProgress: (userName) => {
        const cached = get().cache[userName]?.categoryProgress;
        if (cached) {
          return cached;
        }
        const categoryProgress = progressService.getCategoryProgress(userName);
        set(
          (state) => ({
            cache: {
              ...state.cache,
              [userName]: {
                ...state.cache[userName],
                categoryProgress,
              },
            },
          }),
          false,
          { type: 'progress/getCategoryProgress', userName },
        );
        return categoryProgress;
      },
      getTimeDistribution: (userName) => {
        const cached = get().cache[userName]?.timeDistribution;
        if (cached) {
          return cached;
        }
        const timeDistribution = progressService.getTimeDistribution(userName);
        set(
          (state) => ({
            cache: {
              ...state.cache,
              [userName]: {
                ...state.cache[userName],
                timeDistribution,
              },
            },
          }),
          false,
          { type: 'progress/getTimeDistribution', userName },
        );
        return timeDistribution;
      },
      getDailyProgressData: (userName, days = 7) => {
        const dailyProgress = progressService.getDailyProgressData(userName, days);
        set(
          (state) => ({
            cache: {
              ...state.cache,
              [userName]: {
                ...state.cache[userName],
                dailyProgress,
              },
            },
          }),
          false,
          { type: 'progress/getDailyProgress', userName },
        );
        return dailyProgress;
      },
      clearProgress: () => {
        progressService.clearProgress();
        set(() => ({ cache: {} }), false, { type: 'progress/clearProgress' });
      },
      invalidateCache: (userName) =>
        set(
          (state) => {
            const nextCache = { ...state.cache };
            delete nextCache[userName];
            return { cache: nextCache };
          },
          false,
          { type: 'progress/invalidateCache', userName },
        ),
    }),
    { name: 'progress-store' },
  ),
);

export type {
  UserProgress,
  SentencePracticeProgress,
  StoryProgress,
  DailyProgress,
  WeeklyActivity,
  CategoryProgress,
  TimeDistribution,
};
