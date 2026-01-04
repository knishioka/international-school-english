import { act } from '@testing-library/react';
import { useGameStore, selectGameState } from '../gameStore';

describe('gameStore', () => {
  const gameKey = 'spelling';

  beforeEach(() => {
    useGameStore.setState({ games: {} });
  });

  it('starts a game with a clean state', () => {
    act(() => {
      useGameStore.getState().startGame(gameKey);
    });

    const state = selectGameState(gameKey)(useGameStore.getState());
    expect(state.gameStarted).toBe(true);
    expect(state.score).toBe(0);
    expect(state.currentIndex).toBe(0);
    expect(state.isCorrect).toBeNull();
  });

  it('updates score on correct answer', () => {
    act(() => {
      useGameStore.getState().startGame(gameKey);
      useGameStore.getState().submitAnswer(gameKey, true, 10);
    });

    const state = selectGameState(gameKey)(useGameStore.getState());
    expect(state.score).toBe(10);
    expect(state.isCorrect).toBe(true);
  });

  it('does not change score on incorrect answer', () => {
    act(() => {
      useGameStore.getState().startGame(gameKey);
      useGameStore.getState().submitAnswer(gameKey, false, 10);
    });

    const state = selectGameState(gameKey)(useGameStore.getState());
    expect(state.score).toBe(0);
    expect(state.isCorrect).toBe(false);
  });

  it('advances to the next question', () => {
    act(() => {
      useGameStore.getState().startGame(gameKey);
      useGameStore.getState().nextQuestion(gameKey);
    });

    const state = selectGameState(gameKey)(useGameStore.getState());
    expect(state.currentIndex).toBe(1);
    expect(state.isCorrect).toBeNull();
  });

  it('sets current index explicitly', () => {
    act(() => {
      useGameStore.getState().startGame(gameKey);
      useGameStore.getState().setCurrentIndex(gameKey, 4);
    });

    const state = selectGameState(gameKey)(useGameStore.getState());
    expect(state.currentIndex).toBe(4);
  });

  it('resets the game state', () => {
    act(() => {
      useGameStore.getState().startGame(gameKey);
      useGameStore.getState().submitAnswer(gameKey, true, 15);
      useGameStore.getState().resetGame(gameKey);
    });

    const state = selectGameState(gameKey)(useGameStore.getState());
    expect(state.gameStarted).toBe(false);
    expect(state.score).toBe(0);
    expect(state.currentIndex).toBe(0);
    expect(state.isCorrect).toBeNull();
  });
});
