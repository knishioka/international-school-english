export interface GameState<T> {
  currentIndex: number;
  score: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  currentItem?: T;
  isCorrect?: boolean | null;
}

export interface GameProgress {
  userName: string;
  gameType: string;
  completedItems: string[];
  totalScore: number;
  lastPlayed: Date;
}
