import { act } from '@testing-library/react';
import { useProgressStore } from '../progressStore';
import { progressService } from '@/services/progressService';

jest.mock('@/services/progressService', () => ({
  progressService: {
    getUserProgress: jest.fn(),
    updateSentencePracticeProgress: jest.fn(),
    updateStoryProgress: jest.fn(),
    updateKanjiGrade: jest.fn(),
    getProgressStats: jest.fn(),
    getWeeklyActivityData: jest.fn(),
    getCategoryProgress: jest.fn(),
    getTimeDistribution: jest.fn(),
    getDailyProgressData: jest.fn(),
    clearProgress: jest.fn(),
  },
}));

describe('progressStore', () => {
  const mockStats = {
    totalScore: 100,
    completedSentences: 1,
    totalSentenceAttempts: 2,
    accuracy: 50,
    completedStories: 0,
    totalStoriesRead: 0,
    streakDays: 1,
    totalTimeSpent: 5,
    achievements: [],
    activitiesLast7Days: 1,
    kanjiGrade: 1,
  };

  beforeEach(() => {
    useProgressStore.setState({ cache: {} });
    (progressService.getProgressStats as jest.Mock).mockReturnValue(mockStats);
    (progressService.getWeeklyActivityData as jest.Mock).mockReturnValue([]);
    (progressService.getCategoryProgress as jest.Mock).mockReturnValue([]);
    (progressService.getTimeDistribution as jest.Mock).mockReturnValue([]);
    (progressService.getDailyProgressData as jest.Mock).mockReturnValue([]);
  });

  it('caches progress stats', () => {
    const first = useProgressStore.getState().getProgressStats('testUser');
    const second = useProgressStore.getState().getProgressStats('testUser');

    expect(first).toEqual(mockStats);
    expect(second).toEqual(mockStats);
    expect(progressService.getProgressStats).toHaveBeenCalledTimes(1);
  });

  it('updates progress and refreshes cache', () => {
    act(() => {
      useProgressStore.getState().updateSentencePracticeProgress('testUser', 'sentence1', true, 50);
    });

    expect(progressService.updateSentencePracticeProgress).toHaveBeenCalledWith(
      'testUser',
      'sentence1',
      true,
      50,
    );
    expect(progressService.getProgressStats).toHaveBeenCalled();
  });

  it('invalidates cache for a user', () => {
    act(() => {
      useProgressStore.getState().getProgressStats('testUser');
      useProgressStore.getState().invalidateCache('testUser');
    });

    const cache = useProgressStore.getState().cache;
    expect(cache.testUser).toBeUndefined();
  });
});
