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

  it('renders category selection screen', () => {
    render(
      <TestWrapper>
        <FlashCardPage />
      </TestWrapper>,
    );

    expect(screen.getByText(/たんごカード/)).toBeInTheDocument();
    expect(screen.getByText(/カテゴリーを えらんでね/)).toBeInTheDocument();
    expect(screen.getByText(/すべての ことば/)).toBeInTheDocument();
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
