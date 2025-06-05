import { KanjiGrade } from '@/contexts/LanguageContext';

export interface SentencePracticeProgress {
  sentenceId: string;
  completed: boolean;
  attempts: number;
  correctAttempts: number;
  lastAttempted: Date;
  bestScore: number;
}

export interface StoryProgress {
  storyId: string;
  completed: boolean;
  pagesRead: number;
  totalPages: number;
  lastRead: Date;
  timesRead: number;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD format
  sentencePracticeCompleted: number;
  storiesRead: number;
  totalScore: number;
  timeSpent: number; // in minutes
}

export interface UserProgress {
  userName: string;
  currentKanjiGrade: KanjiGrade;
  totalScore: number;
  sentencePractice: SentencePracticeProgress[];
  stories: StoryProgress[];
  dailyProgress: DailyProgress[];
  achievements: string[];
  totalTimeSpent: number; // in minutes
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD format
}

const STORAGE_KEY = 'international-school-english-progress';

class ProgressService {
  private getStoredProgress(): UserProgress | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === null || stored.length === 0) {
        return null;
      }

      const progress = JSON.parse(stored);

      // Convert date strings back to Date objects
      progress.sentencePractice.forEach((sp: SentencePracticeProgress) => {
        sp.lastAttempted = new Date(sp.lastAttempted);
      });

      progress.stories.forEach((story: StoryProgress) => {
        story.lastRead = new Date(story.lastRead);
      });

      return progress;
    } catch (error) {
      console.error('Error reading progress from localStorage:', error);
      return null;
    }
  }

  private saveProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
    }
  }

  public getUserProgress(userName: string): UserProgress {
    const stored = this.getStoredProgress();

    if (stored && stored.userName === userName) {
      return stored;
    }

    // Create new progress for user
    const newProgress: UserProgress = {
      userName,
      currentKanjiGrade: 1,
      totalScore: 0,
      sentencePractice: [],
      stories: [],
      dailyProgress: [],
      achievements: [],
      totalTimeSpent: 0,
      streakDays: 0,
      lastActiveDate: '',
    };

    this.saveProgress(newProgress);
    return newProgress;
  }

  public updateSentencePracticeProgress(
    userName: string,
    sentenceId: string,
    isCorrect: boolean,
    score: number,
  ): void {
    const progress = this.getUserProgress(userName);

    let sentenceProgress = progress.sentencePractice.find((sp) => sp.sentenceId === sentenceId);

    if (!sentenceProgress) {
      sentenceProgress = {
        sentenceId,
        completed: false,
        attempts: 0,
        correctAttempts: 0,
        lastAttempted: new Date(),
        bestScore: 0,
      };
      progress.sentencePractice.push(sentenceProgress);
    }

    sentenceProgress.attempts++;
    sentenceProgress.lastAttempted = new Date();
    sentenceProgress.bestScore = Math.max(sentenceProgress.bestScore, score);

    if (isCorrect) {
      sentenceProgress.correctAttempts++;
      sentenceProgress.completed = true;
      progress.totalScore += score;
    }

    this.updateDailyProgress(progress, 'sentencePractice', score);
    this.updateStreak(progress);
    this.checkAchievements(progress);
    this.saveProgress(progress);
  }

  public updateStoryProgress(
    userName: string,
    storyId: string,
    pagesRead: number,
    totalPages: number,
  ): void {
    const progress = this.getUserProgress(userName);

    let storyProgress = progress.stories.find((sp) => sp.storyId === storyId);

    if (!storyProgress) {
      storyProgress = {
        storyId,
        completed: false,
        pagesRead: 0,
        totalPages,
        lastRead: new Date(),
        timesRead: 0,
      };
      progress.stories.push(storyProgress);
    }

    const wasCompleted = storyProgress.completed;
    storyProgress.pagesRead = Math.max(storyProgress.pagesRead, pagesRead);
    storyProgress.lastRead = new Date();

    if (pagesRead >= totalPages) {
      storyProgress.completed = true;
      if (!wasCompleted) {
        storyProgress.timesRead++;
        progress.totalScore += 50; // Bonus for completing story
      }
    }

    this.updateDailyProgress(progress, 'story', pagesRead >= totalPages ? 50 : 10);
    this.updateStreak(progress);
    this.checkAchievements(progress);
    this.saveProgress(progress);
  }

  public updateKanjiGrade(userName: string, grade: KanjiGrade): void {
    const progress = this.getUserProgress(userName);
    progress.currentKanjiGrade = grade;
    this.saveProgress(progress);
  }

  private updateDailyProgress(
    progress: UserProgress,
    activity: 'sentencePractice' | 'story',
    score: number,
  ): void {
    const today = new Date().toISOString().split('T')[0];

    let dailyProgress = progress.dailyProgress.find((dp) => dp.date === today);

    if (!dailyProgress) {
      dailyProgress = {
        date: today,
        sentencePracticeCompleted: 0,
        storiesRead: 0,
        totalScore: 0,
        timeSpent: 0,
      };
      progress.dailyProgress.push(dailyProgress);
    }

    if (activity === 'sentencePractice') {
      dailyProgress.sentencePracticeCompleted++;
    } else {
      dailyProgress.storiesRead++;
    }

    dailyProgress.totalScore += score;
    dailyProgress.timeSpent += 2; // Estimate 2 minutes per activity
    progress.totalTimeSpent += 2;
  }

  private updateStreak(progress: UserProgress): void {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (progress.lastActiveDate === yesterday) {
      progress.streakDays++;
    } else if (progress.lastActiveDate !== today) {
      progress.streakDays = 1;
    }

    progress.lastActiveDate = today;
  }

  private checkAchievements(progress: UserProgress): void {
    const newAchievements: string[] = [];

    // First sentence completed
    if (
      progress.sentencePractice.some((sp) => sp.completed) &&
      !progress.achievements.includes('first_sentence')
    ) {
      newAchievements.push('first_sentence');
    }

    // First story completed
    if (
      progress.stories.some((sp) => sp.completed) &&
      !progress.achievements.includes('first_story')
    ) {
      newAchievements.push('first_story');
    }

    // 10 sentences completed
    const completedSentences = progress.sentencePractice.filter((sp) => sp.completed).length;
    if (completedSentences >= 10 && !progress.achievements.includes('sentence_master')) {
      newAchievements.push('sentence_master');
    }

    // All stories read
    if (
      progress.stories.length >= 6 &&
      progress.stories.every((sp) => sp.completed) &&
      !progress.achievements.includes('story_reader')
    ) {
      newAchievements.push('story_reader');
    }

    // 7 day streak
    if (progress.streakDays >= 7 && !progress.achievements.includes('week_streak')) {
      newAchievements.push('week_streak');
    }

    // 1000 points
    if (progress.totalScore >= 1000 && !progress.achievements.includes('score_champion')) {
      newAchievements.push('score_champion');
    }

    progress.achievements.push(...newAchievements);
  }

  public getProgressStats(userName: string): {
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
  } {
    const progress = this.getUserProgress(userName);

    const completedSentences = progress.sentencePractice.filter((sp) => sp.completed).length;
    const totalSentenceAttempts = progress.sentencePractice.reduce(
      (sum, sp) => sum + sp.attempts,
      0,
    );
    const correctAttempts = progress.sentencePractice.reduce(
      (sum, sp) => sum + sp.correctAttempts,
      0,
    );
    const accuracy =
      totalSentenceAttempts > 0 ? (correctAttempts / totalSentenceAttempts) * 100 : 0;

    const completedStories = progress.stories.filter((sp) => sp.completed).length;
    const totalStoriesRead = progress.stories.reduce((sum, sp) => sum + sp.timesRead, 0);

    const last7Days = progress.dailyProgress
      .slice(-7)
      .reduce((sum, dp) => sum + dp.sentencePracticeCompleted + dp.storiesRead, 0);

    return {
      totalScore: progress.totalScore,
      completedSentences,
      totalSentenceAttempts,
      accuracy: Math.round(accuracy),
      completedStories,
      totalStoriesRead,
      streakDays: progress.streakDays,
      totalTimeSpent: progress.totalTimeSpent,
      achievements: progress.achievements,
      activitiesLast7Days: last7Days,
      kanjiGrade: progress.currentKanjiGrade,
    };
  }

  public getDailyProgressData(userName: string, days: number = 7): DailyProgress[] {
    const progress = this.getUserProgress(userName);
    return progress.dailyProgress.slice(-days);
  }

  public clearProgress(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const progressService = new ProgressService();
