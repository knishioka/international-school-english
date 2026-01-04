import { act } from '@testing-library/react';
import { useUiStore } from '../uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    useUiStore.setState({
      isLoading: false,
      showHint: false,
      modalState: { isOpen: false },
    });
  });

  it('toggles hint visibility', () => {
    act(() => {
      useUiStore.getState().toggleHint();
    });

    expect(useUiStore.getState().showHint).toBe(true);
  });

  it('sets loading state', () => {
    act(() => {
      useUiStore.getState().setLoading(true);
    });

    expect(useUiStore.getState().isLoading).toBe(true);
  });

  it('opens and closes modal', () => {
    act(() => {
      useUiStore.getState().openModal({ contentId: 'badge-1', type: 'badge' });
    });

    expect(useUiStore.getState().modalState).toEqual({
      isOpen: true,
      contentId: 'badge-1',
      type: 'badge',
    });

    act(() => {
      useUiStore.getState().closeModal();
    });

    expect(useUiStore.getState().modalState).toEqual({ isOpen: false });
  });
});
