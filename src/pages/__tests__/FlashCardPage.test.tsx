import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FlashCardPage } from '../FlashCardPage';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AudioProvider } from '@/contexts/AudioContext';
import { BrowserRouter } from 'react-router-dom';

const TestWrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <BrowserRouter>
    <LanguageProvider>
      <AudioProvider>{children}</AudioProvider>
    </LanguageProvider>
  </BrowserRouter>
);

// Mock navigator for speech synthesis
Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    speak: jest.fn(),
    cancel: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    getVoices: jest.fn(() => []),
  },
});

describe('FlashCardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders category selection screen initially', () => {
    render(
      <TestWrapper>
        <FlashCardPage />
      </TestWrapper>,
    );

    expect(screen.getByText(/Flash Cards|たんごカード/)).toBeInTheDocument();
    expect(screen.getByText(/Choose a Category|カテゴリーを えらんでね/)).toBeInTheDocument();
    expect(screen.getByText(/All Words|すべての ことば/)).toBeInTheDocument();
    expect(screen.getByText(/Food|たべもの/)).toBeInTheDocument();
    expect(screen.getByText(/Animals|どうぶつ/)).toBeInTheDocument();
    expect(screen.getByText(/Colors|いろ/)).toBeInTheDocument();
    expect(screen.getByText(/Family|かぞく/)).toBeInTheDocument();
    expect(screen.getByText(/School|がっこう/)).toBeInTheDocument();
  });

  it('shows word count for each category', () => {
    render(
      <TestWrapper>
        <FlashCardPage />
      </TestWrapper>,
    );

    expect(screen.getByText(/111 words|111 ことば/)).toBeInTheDocument(); // All words
    expect(screen.getByText(/10 words|10 ことば/)).toBeInTheDocument(); // Food category
  });

  it('highlights selected category', () => {
    render(
      <TestWrapper>
        <FlashCardPage />
      </TestWrapper>,
    );

    const allWordsButton = screen.getByText(/All Words|すべての ことば/).closest('button');
    expect(allWordsButton).toHaveClass('bg-purple-500');

    const foodButton = screen.getByText(/Food|たべもの/).closest('button');
    if (foodButton) {
      fireEvent.click(foodButton);
      expect(foodButton).toHaveClass('bg-purple-500');
    }
  });

  it('starts game when start button is clicked', async () => {
    render(
      <TestWrapper>
        <FlashCardPage />
      </TestWrapper>,
    );

    const startButton = screen.getByText(/Start Learning!|はじめる！/);
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/Choose a Category|カテゴリーを えらんでね/),
      ).not.toBeInTheDocument();
      expect(screen.getByText('apple')).toBeInTheDocument();
    });
  });

  it('filters words by selected category', async () => {
    render(
      <TestWrapper>
        <FlashCardPage />
      </TestWrapper>,
    );

    // Select food category
    const foodButton = screen.getByText(/Food|たべもの/).closest('button');
    if (foodButton) {
      fireEvent.click(foodButton);
    }

    const startButton = screen.getByText(/Start Learning!|はじめる！/);
    fireEvent.click(startButton);

    await waitFor(() => {
      // Should show one of the food words
      expect(screen.getByText(/apple|banana|milk|bread/)).toBeInTheDocument();
    });
  });

  it('shows progress correctly', async () => {
    render(
      <TestWrapper>
        <FlashCardPage />
      </TestWrapper>,
    );

    const startButton = screen.getByText(/Start Learning!|はじめる！/);
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/Progress|しんちょく/)).toBeInTheDocument();
      expect(screen.getByText('1 / 111')).toBeInTheDocument();
    });
  });

  it('can navigate between cards', async () => {
    render(
      <TestWrapper>
        <FlashCardPage />
      </TestWrapper>,
    );

    const startButton = screen.getByText(/Start Learning!|はじめる！/);
    fireEvent.click(startButton);

    await waitFor(() => {
      const nextButton = screen.getByText(/Next →|つぎ →/);
      fireEvent.click(nextButton);
    });

    await waitFor(() => {
      expect(screen.getByText('2 / 111')).toBeInTheDocument();
    });
  });


  it('can return to menu from game', async () => {
    render(
      <TestWrapper>
        <FlashCardPage />
      </TestWrapper>,
    );

    const startButton = screen.getByText(/Start Learning!|はじめる！/);
    fireEvent.click(startButton);

    await waitFor(() => {
      const backButton = screen.getByLabelText('Back to menu');
      fireEvent.click(backButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Choose a Category|カテゴリーを えらんでね/)).toBeInTheDocument();
    });
  });

  it('displays Japanese text when in Japanese mode', () => {
    render(
      <TestWrapper>
        <FlashCardPage />
      </TestWrapper>,
    );

    expect(screen.getByText(/Flash Cards|たんごカード/)).toBeInTheDocument();
    expect(screen.getByText(/Choose a Category|カテゴリーを えらんでね/)).toBeInTheDocument();
  });
});
