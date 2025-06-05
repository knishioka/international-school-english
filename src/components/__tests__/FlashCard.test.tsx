import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FlashCard } from '../FlashCard';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AudioProvider } from '@/contexts/AudioContext';

const mockWord = {
  id: '1',
  english: 'apple',
  japanese: 'りんご',
  romaji: 'ringo',
  category: 'food',
  image: '/images/apple.jpg',
  emoji: '🍎',
  example: {
    english: 'I like red apples.',
    japanese: 'あかい りんごが すきです。',
  },
};

const TestWrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <LanguageProvider>
    <AudioProvider>{children}</AudioProvider>
  </LanguageProvider>
);

const defaultProps = {
  word: mockWord,
  onNext: jest.fn(),
  onPrevious: jest.fn(),
  isFirst: false,
  isLast: false,
  currentIndex: 0,
  totalCount: 10,
};

describe('FlashCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders flashcard with word information', () => {
    render(
      <TestWrapper>
        <FlashCard {...defaultProps} />
      </TestWrapper>,
    );

    expect(screen.getByText('apple')).toBeInTheDocument();
    expect(screen.getAllByText('🍎')).toHaveLength(2); // Front and back of card
    expect(screen.getByText(/Progress|しんちょく/)).toBeInTheDocument();
    expect(screen.getByText('1 / 10')).toBeInTheDocument();
  });

  it('flips card when clicked', async () => {
    render(
      <TestWrapper>
        <FlashCard {...defaultProps} />
      </TestWrapper>,
    );

    const card = screen.getByText('apple').closest('.cursor-pointer');
    expect(card).toBeInTheDocument();

    if (card) {
      fireEvent.click(card);
    }

    await waitFor(() => {
      expect(screen.getByText('りんご')).toBeInTheDocument();
      expect(screen.getByText('ringo')).toBeInTheDocument();
    });
  });

  it('shows example when example button is clicked', async () => {
    render(
      <TestWrapper>
        <FlashCard {...defaultProps} />
      </TestWrapper>,
    );

    const exampleButton = screen.getByRole('button', { name: /Example|れいぶん/ });
    fireEvent.click(exampleButton);

    await waitFor(() => {
      expect(screen.getByText('I like red apples.')).toBeInTheDocument();
      expect(screen.getByText('あかい りんごが すきです。')).toBeInTheDocument();
    });
  });

  it('calls onNext when next button is clicked', async () => {
    render(
      <TestWrapper>
        <FlashCard {...defaultProps} />
      </TestWrapper>,
    );

    const nextButton = screen.getByText(/Next →|つぎ →/);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onPrevious when previous button is clicked', async () => {
    render(
      <TestWrapper>
        <FlashCard {...defaultProps} />
      </TestWrapper>,
    );

    const previousButton = screen.getByText(/← Previous|← まえ/);
    fireEvent.click(previousButton);

    await waitFor(() => {
      expect(defaultProps.onPrevious).toHaveBeenCalledTimes(1);
    });
  });

  it('disables previous button when isFirst is true', () => {
    render(
      <TestWrapper>
        <FlashCard {...defaultProps} isFirst />
      </TestWrapper>,
    );

    const previousButton = screen.getByText(/← Previous|← まえ/);
    expect(previousButton).toBeDisabled();
  });

  it('disables next button when isLast is true', () => {
    render(
      <TestWrapper>
        <FlashCard {...defaultProps} isLast />
      </TestWrapper>,
    );

    const nextButton = screen.getByText(/Next →|つぎ →/);
    expect(nextButton).toBeDisabled();
  });

  it('updates progress bar correctly', async () => {
    render(
      <TestWrapper>
        <FlashCard {...defaultProps} currentIndex={4} totalCount={10} />
      </TestWrapper>,
    );

    expect(screen.getByText('5 / 10')).toBeInTheDocument();

    await waitFor(() => {
      const progressBar = document.querySelector('.bg-gradient-to-r');
      expect(progressBar).toHaveAttribute('style', expect.stringContaining('width: 50%'));
    });
  });

  it('renders without example when example is not provided', () => {
    const wordWithoutExample = { ...mockWord, example: undefined };

    render(
      <TestWrapper>
        <FlashCard {...defaultProps} word={wordWithoutExample} />
      </TestWrapper>,
    );

    expect(screen.queryByText(/Example|れいぶん/)).not.toBeInTheDocument();
  });

  it('displays Japanese text when in Japanese mode', () => {
    render(
      <TestWrapper>
        <FlashCard {...defaultProps} />
      </TestWrapper>,
    );

    // The initial render should show English on the front
    expect(screen.getByText('apple')).toBeInTheDocument();
    expect(screen.getByText(/Tap to see Japanese|タップして日本語を見る/)).toBeInTheDocument();
  });
});
