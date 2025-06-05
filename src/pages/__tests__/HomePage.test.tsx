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

  it('ゲームカードが3つ表示される', () => {
    render(<HomePage />, { wrapper: AllTheProviders });

    expect(screen.getByText('アルファベット')).toBeInTheDocument();
    expect(screen.getByText('ぶんしょうれんしゅう')).toBeInTheDocument();
    expect(screen.getByText('おはなし')).toBeInTheDocument();

    expect(screen.getByText('🔤')).toBeInTheDocument();
    expect(screen.getByText('📝')).toBeInTheDocument();
    expect(screen.getByText('📖')).toBeInTheDocument();
  });

  it('進捗ボタンが表示される', () => {
    render(<HomePage />, { wrapper: AllTheProviders });

    const progressButton = screen.getByText(/がくしゅうきろく/);
    expect(progressButton).toBeInTheDocument();
    expect(progressButton.textContent).toContain('📊');
  });

  it('アルファベットゲームカードをクリックできる', async () => {
    const mockPlaySound = jest.fn();
    (AudioContext.useAudio as jest.Mock).mockReturnValue({
      playSound: mockPlaySound,
      speak: jest.fn(),
    });

    render(<HomePage />, { wrapper: AllTheProviders });

    const alphabetCard = screen.getByRole('button', { name: /Play アルファベット game/ });

    await act(async () => {
      fireEvent.click(alphabetCard);
    });

    expect(mockPlaySound).toHaveBeenCalledWith('click');
    expect(mockNavigate).toHaveBeenCalledWith('/games/alphabet');
  });

  it('文章練習ゲームカードをクリックできる', async () => {
    const mockPlaySound = jest.fn();
    (AudioContext.useAudio as jest.Mock).mockReturnValue({
      playSound: mockPlaySound,
      speak: jest.fn(),
    });

    render(<HomePage />, { wrapper: AllTheProviders });

    const vocabularyCard = screen.getByRole('button', { name: /Play ぶんしょうれんしゅう game/ });

    await act(async () => {
      fireEvent.click(vocabularyCard);
    });

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
