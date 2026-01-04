import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ModalState {
  isOpen: boolean;
  contentId?: string;
  type?: string;
}

interface UiStoreState {
  isLoading: boolean;
  showHint: boolean;
  modalState: ModalState;
  setLoading: (isLoading: boolean) => void;
  setShowHint: (showHint: boolean) => void;
  toggleHint: () => void;
  openModal: (payload?: Omit<ModalState, 'isOpen'>) => void;
  closeModal: () => void;
}

const defaultModalState: ModalState = {
  isOpen: false,
};

export const useUiStore = create<UiStoreState>()(
  devtools(
    (set) => ({
      isLoading: false,
      showHint: false,
      modalState: defaultModalState,
      setLoading: (isLoading) =>
        set(() => ({ isLoading }), false, { type: 'ui/setLoading', isLoading }),
      setShowHint: (showHint) =>
        set(() => ({ showHint }), false, { type: 'ui/setShowHint', showHint }),
      toggleHint: () =>
        set((state) => ({ showHint: !state.showHint }), false, { type: 'ui/toggleHint' }),
      openModal: (payload) =>
        set(
          () => ({
            modalState: {
              isOpen: true,
              ...payload,
            },
          }),
          false,
          { type: 'ui/openModal', payload },
        ),
      closeModal: () =>
        set(() => ({ modalState: defaultModalState }), false, { type: 'ui/closeModal' }),
    }),
    { name: 'ui-store' },
  ),
);

export const selectUiLoading = (state: UiStoreState): boolean => state.isLoading;

export const selectUiShowHint = (state: UiStoreState): boolean => state.showHint;

export const selectUiModalState = (state: UiStoreState): ModalState => state.modalState;
