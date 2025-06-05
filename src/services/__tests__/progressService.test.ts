import { progressService } from '../progressService';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('ProgressService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getUserProgress', () => {
    it('should create new progress for new user', () => {
      const progress = progressService.getUserProgress('testUser');

      expect(progress.userName).toBe('testUser');
      expect(progress.totalScore).toBe(0);
      expect(progress.currentKanjiGrade).toBe(1);
      expect(progress.sentencePractice).toHaveLength(0);
      expect(progress.stories).toHaveLength(0);
      expect(progress.achievements).toHaveLength(0);
    });

    it('should return existing progress for existing user', () => {
      // Create initial progress and save it
      progressService.updateSentencePracticeProgress('testUser', 'sentence1', true, 100);

      // Get progress again
      const retrievedProgress = progressService.getUserProgress('testUser');
      expect(retrievedProgress.totalScore).toBe(100);
      expect(retrievedProgress.userName).toBe('testUser');
    });
  });

  describe('updateSentencePracticeProgress', () => {
    it('should create new sentence progress on first attempt', () => {
      progressService.updateSentencePracticeProgress('testUser', 'sentence1', true, 50);

      const progress = progressService.getUserProgress('testUser');
      expect(progress.sentencePractice).toHaveLength(1);
      expect(progress.sentencePractice[0].sentenceId).toBe('sentence1');
      expect(progress.sentencePractice[0].completed).toBe(true);
      expect(progress.sentencePractice[0].attempts).toBe(1);
      expect(progress.sentencePractice[0].correctAttempts).toBe(1);
      expect(progress.sentencePractice[0].bestScore).toBe(50);
      expect(progress.totalScore).toBe(50);
    });

    it('should update existing sentence progress', () => {
      // First attempt - incorrect
      progressService.updateSentencePracticeProgress('testUser', 'sentence1', false, 0);

      // Second attempt - correct
      progressService.updateSentencePracticeProgress('testUser', 'sentence1', true, 75);

      const progress = progressService.getUserProgress('testUser');
      const sentenceProgress = progress.sentencePractice[0];

      expect(sentenceProgress.attempts).toBe(2);
      expect(sentenceProgress.correctAttempts).toBe(1);
      expect(sentenceProgress.completed).toBe(true);
      expect(sentenceProgress.bestScore).toBe(75);
      expect(progress.totalScore).toBe(75);
    });

    it('should track best score correctly', () => {
      progressService.updateSentencePracticeProgress('testUser', 'sentence1', true, 50);
      progressService.updateSentencePracticeProgress('testUser', 'sentence1', true, 30);

      const progress = progressService.getUserProgress('testUser');
      expect(progress.sentencePractice[0].bestScore).toBe(50);
    });
  });

  describe('updateStoryProgress', () => {
    it('should create new story progress', () => {
      progressService.updateStoryProgress('testUser', 'story1', 5, 10);

      const progress = progressService.getUserProgress('testUser');
      expect(progress.stories).toHaveLength(1);
      expect(progress.stories[0].storyId).toBe('story1');
      expect(progress.stories[0].pagesRead).toBe(5);
      expect(progress.stories[0].totalPages).toBe(10);
      expect(progress.stories[0].completed).toBe(false);
    });

    it('should mark story as completed when all pages read', () => {
      progressService.updateStoryProgress('testUser', 'story1', 10, 10);

      const progress = progressService.getUserProgress('testUser');
      expect(progress.stories[0].completed).toBe(true);
      expect(progress.stories[0].timesRead).toBe(1);
      expect(progress.totalScore).toBe(50); // Completion bonus
    });

    it('should update pages read to maximum', () => {
      progressService.updateStoryProgress('testUser', 'story1', 3, 10);
      progressService.updateStoryProgress('testUser', 'story1', 7, 10);

      const progress = progressService.getUserProgress('testUser');
      expect(progress.stories[0].pagesRead).toBe(7);
    });

    it('should not give completion bonus twice', () => {
      progressService.updateStoryProgress('testUser', 'story1', 10, 10);
      const firstScore = progressService.getUserProgress('testUser').totalScore;

      progressService.updateStoryProgress('testUser', 'story1', 10, 10);
      const secondScore = progressService.getUserProgress('testUser').totalScore;

      expect(secondScore).toBe(firstScore);
    });
  });

  describe('updateKanjiGrade', () => {
    it('should update kanji grade', () => {
      progressService.updateKanjiGrade('testUser', 3);

      const progress = progressService.getUserProgress('testUser');
      expect(progress.currentKanjiGrade).toBe(3);
    });
  });

  describe('getProgressStats', () => {
    beforeEach(() => {
      // Setup test data
      progressService.updateSentencePracticeProgress('testUser', 'sentence1', true, 50);
      progressService.updateSentencePracticeProgress('testUser', 'sentence2', false, 0);
      progressService.updateSentencePracticeProgress('testUser', 'sentence2', true, 75);
      progressService.updateStoryProgress('testUser', 'story1', 10, 10);
    });

    it('should calculate correct statistics', () => {
      const stats = progressService.getProgressStats('testUser');

      expect(stats.totalScore).toBe(175); // 50 + 75 + 50 bonus
      expect(stats.completedSentences).toBe(2);
      expect(stats.totalSentenceAttempts).toBe(3);
      expect(stats.accuracy).toBe(67); // 2 correct out of 3 attempts, rounded
      expect(stats.completedStories).toBe(1);
      expect(stats.totalStoriesRead).toBe(1);
      expect(stats.kanjiGrade).toBe(1);
    });
  });

  describe('achievements', () => {
    it('should unlock first sentence achievement', () => {
      progressService.updateSentencePracticeProgress('testUser', 'sentence1', true, 50);

      const progress = progressService.getUserProgress('testUser');
      expect(progress.achievements).toContain('first_sentence');
    });

    it('should unlock first story achievement', () => {
      progressService.updateStoryProgress('testUser', 'story1', 10, 10);

      const progress = progressService.getUserProgress('testUser');
      expect(progress.achievements).toContain('first_story');
    });

    it('should unlock sentence master achievement after 10 sentences', () => {
      // Complete 10 sentences
      for (let i = 1; i <= 10; i++) {
        progressService.updateSentencePracticeProgress('testUser', `sentence${i}`, true, 50);
      }

      const progress = progressService.getUserProgress('testUser');
      expect(progress.achievements).toContain('sentence_master');
    });

    it('should unlock score champion achievement at 1000 points', () => {
      // Create enough score to reach 1000
      for (let i = 1; i <= 20; i++) {
        progressService.updateSentencePracticeProgress('testUser', `sentence${i}`, true, 50);
      }

      const progress = progressService.getUserProgress('testUser');
      expect(progress.achievements).toContain('score_champion');
      expect(progress.totalScore).toBeGreaterThanOrEqual(1000);
    });
  });

  describe('streak tracking', () => {
    it('should initialize streak on first activity', () => {
      progressService.updateSentencePracticeProgress('testUser', 'sentence1', true, 50);

      const progress = progressService.getUserProgress('testUser');
      expect(progress.streakDays).toBe(1);
      expect(progress.lastActiveDate).toBe(new Date().toISOString().split('T')[0]);
    });
  });

  describe('clearProgress', () => {
    it('should clear all progress data', () => {
      progressService.updateSentencePracticeProgress('testUser', 'sentence1', true, 50);
      progressService.clearProgress();

      // Verify localStorage is cleared
      expect(localStorage.getItem('international-school-english-progress')).toBeNull();
    });
  });
});
