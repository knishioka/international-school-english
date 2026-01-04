import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../HomePage';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AudioProvider } from '@/contexts/AudioContext';
import * as AudioContext from '@/contexts/AudioContext';

const mockNavigate = jest.fn();

// Mock the navigation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the useAudio hook
jest.mock('@/contexts/AudioContext', () => ({
  ...jest.requireActual('@/contexts/AudioContext'),
  useAudio: jest.fn(),
}));

// Mock GameCard component
jest.mock('@/components/GameCard', () => ({
  GameCard: ({ title, icon, onClick }: { title: string; icon: string; onClick: () => void }) => (
    <button onClick={onClick} aria-label={`Play ${title} game`} data-testid={`game-card-${title}`}>
      <div>{icon}</div>
      <div>{title}</div>
    </button>
  ),
}));

const AllTheProviders = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AudioProvider>{children}</AudioProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    // Setup default mock for useAudio
    (AudioContext.useAudio as jest.Mock).mockReturnValue({
      playSound: jest.fn(),
      speak: jest.fn(),
    });
  });

  it('ユーザー名が表示される', () => {
    localStorage.setItem('userName', 'たろう');

    render(<HomePage />, { wrapper: AllTheProviders });

    const header = screen.getByRole('heading', { level: 1 });
    expect(header).toHaveTextContent('こんにちは, たろう! 👋');
  });

  it('ユーザー名がない場合も正しく表示される', () => {
    render(<HomePage />, { wrapper: AllTheProviders });

    // ヘッダーの要素を取得
    const header = screen.getByRole('heading', { level: 1 });
    expect(header).toHaveTextContent('こんにちは, ! 👋');
  });

  it('ゲームカードが4つ表示される', () => {
    render(<HomePage />, { wrapper: AllTheProviders });

    // Check for game card content using text content
    expect(screen.getByText('たんごカード')).toBeInTheDocument();
    expect(screen.getByText('スペルチェック')).toBeInTheDocument();
    expect(screen.getByText('ぶんしょうれんしゅう')).toBeInTheDocument();
    expect(screen.getByText('おはなし')).toBeInTheDocument();

    // Check for icons
    expect(screen.getByText('📚')).toBeInTheDocument();
    expect(screen.getByText('✏️')).toBeInTheDocument();
    expect(screen.getByText('📝')).toBeInTheDocument();
    expect(screen.getByText('📖')).toBeInTheDocument();
  });

  it('進捗ボタンが表示される', () => {
    render(<HomePage />, { wrapper: AllTheProviders });

    const progressButton = screen.getByText(/がくしゅうきろく/);
    expect(progressButton).toBeInTheDocument();
    expect(progressButton.textContent).toContain('📊');
  });

  it('スペルチェックゲームカードをクリックできる', async () => {
    const mockPlaySound = jest.fn();
    (AudioContext.useAudio as jest.Mock).mockReturnValue({
      playSound: mockPlaySound,
      speak: jest.fn(),
    });

    render(<HomePage />, { wrapper: AllTheProviders });

    const spellingCard = screen.getByText('スペルチェック').closest('button');
    expect(spellingCard).toBeTruthy();

    if (spellingCard) {
      await act(async () => {
        fireEvent.click(spellingCard);
      });
    }

    expect(mockPlaySound).toHaveBeenCalledWith('click');
    expect(mockNavigate).toHaveBeenCalledWith('/games/spelling');
  });

  it('文章練習ゲームカードをクリックできる', async () => {
    const mockPlaySound = jest.fn();
    (AudioContext.useAudio as jest.Mock).mockReturnValue({
      playSound: mockPlaySound,
      speak: jest.fn(),
    });

    render(<HomePage />, { wrapper: AllTheProviders });

    const vocabularyCard = screen.getByText('ぶんしょうれんしゅう').closest('button');
    expect(vocabularyCard).toBeTruthy();

    if (vocabularyCard) {
      await act(async () => {
        fireEvent.click(vocabularyCard);
      });
    }

    expect(mockPlaySound).toHaveBeenCalledWith('click');
    expect(mockNavigate).toHaveBeenCalledWith('/games/vocabulary');
  });

  it('進捗ボタンをクリックできる', async () => {
    const mockPlaySound = jest.fn();
    (AudioContext.useAudio as jest.Mock).mockReturnValue({
      playSound: mockPlaySound,
      speak: jest.fn(),
    });

    render(<HomePage />, { wrapper: AllTheProviders });

    const progressButton = screen.getByText(/がくしゅうきろく/);

    await act(async () => {
      fireEvent.click(progressButton);
    });

    expect(mockPlaySound).toHaveBeenCalledWith('click');
  });
});
