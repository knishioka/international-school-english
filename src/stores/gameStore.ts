import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type GameKey = string;

export interface GameState {
  score: number;
  currentIndex: number;
  isCorrect: boolean | null;
  gameStarted: boolean;
}

interface GameStoreState {
  games: Record<GameKey, GameState>;
  startGame: (gameKey: GameKey) => void;
  submitAnswer: (gameKey: GameKey, isCorrect: boolean, points: number) => void;
  setCorrectness: (gameKey: GameKey, isCorrect: boolean | null) => void;
  setCurrentIndex: (gameKey: GameKey, currentIndex: number) => void;
  nextQuestion: (gameKey: GameKey) => void;
  resetGame: (gameKey: GameKey) => void;
}

const createInitialGameState = (): GameState => ({
  score: 0,
  currentIndex: 0,
  isCorrect: null,
  gameStarted: false,
});

export const useGameStore = create<GameStoreState>()(
  devtools(
    (set) => ({
      games: {},
      startGame: (gameKey) =>
        set(
          (state) => ({
            games: {
              ...state.games,
              [gameKey]: {
                ...createInitialGameState(),
                gameStarted: true,
              },
            },
          }),
          false,
          { type: 'game/start', gameKey },
        ),
      submitAnswer: (gameKey, isCorrect, points) =>
        set(
          (state) => {
            const gameState = state.games[gameKey] ?? createInitialGameState();
            return {
              games: {
                ...state.games,
                [gameKey]: {
                  ...gameState,
                  isCorrect,
                  score: isCorrect ? gameState.score + points : gameState.score,
                },
              },
            };
          },
          false,
          { type: 'game/submitAnswer', gameKey, isCorrect, points },
        ),
      setCorrectness: (gameKey, isCorrect) =>
        set(
          (state) => {
            const gameState = state.games[gameKey] ?? createInitialGameState();
            return {
              games: {
                ...state.games,
                [gameKey]: {
                  ...gameState,
                  isCorrect,
                },
              },
            };
          },
          false,
          { type: 'game/setCorrectness', gameKey, isCorrect },
        ),
      setCurrentIndex: (gameKey, currentIndex) =>
        set(
          (state) => {
            const gameState = state.games[gameKey] ?? createInitialGameState();
            return {
              games: {
                ...state.games,
                [gameKey]: {
                  ...gameState,
                  currentIndex,
                },
              },
            };
          },
          false,
          { type: 'game/setCurrentIndex', gameKey, currentIndex },
        ),
      nextQuestion: (gameKey) =>
        set(
          (state) => {
            const gameState = state.games[gameKey] ?? createInitialGameState();
            return {
              games: {
                ...state.games,
                [gameKey]: {
                  ...gameState,
                  currentIndex: gameState.currentIndex + 1,
                  isCorrect: null,
                },
              },
            };
          },
          false,
          { type: 'game/nextQuestion', gameKey },
        ),
      resetGame: (gameKey) =>
        set(
          (state) => ({
            games: {
              ...state.games,
              [gameKey]: createInitialGameState(),
            },
          }),
          false,
          { type: 'game/reset', gameKey },
        ),
    }),
    { name: 'game-store' },
  ),
);

export const selectGameState =
  (gameKey: GameKey) =>
  (state: GameStoreState): GameState =>
    state.games[gameKey] ?? createInitialGameState();

export const selectGameScore =
  (gameKey: GameKey) =>
  (state: GameStoreState): number =>
    (state.games[gameKey] ?? createInitialGameState()).score;

export const selectGameIndex =
  (gameKey: GameKey) =>
  (state: GameStoreState): number =>
    (state.games[gameKey] ?? createInitialGameState()).currentIndex;

export const selectGameStarted =
  (gameKey: GameKey) =>
  (state: GameStoreState): boolean =>
    (state.games[gameKey] ?? createInitialGameState()).gameStarted;

export const selectGameCorrectness =
  (gameKey: GameKey) =>
  (state: GameStoreState): boolean | null =>
    (state.games[gameKey] ?? createInitialGameState()).isCorrect;

export const getGameState = (gameKey: GameKey): GameState => {
  const state = useGameStore.getState();
  return state.games[gameKey] ?? createInitialGameState();
};
