import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../HomePage';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AudioProvider } from '@/contexts/AudioContext';
import * as AudioContext from '@/contexts/AudioContext';

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
    expect(screen.getByText('たんご')).toBeInTheDocument();
    expect(screen.getByText('おはなし')).toBeInTheDocument();

    expect(screen.getByText('🔤')).toBeInTheDocument();
    expect(screen.getByText('📚')).toBeInTheDocument();
    expect(screen.getByText('📖')).toBeInTheDocument();
  });

  it('進捗ボタンが表示される', () => {
    render(<HomePage />, { wrapper: AllTheProviders });

    const progressButton = screen.getByText(/がくしゅうきろく/);
    expect(progressButton).toBeInTheDocument();
    expect(progressButton.textContent).toContain('📊');
  });

  it('ゲームカードをクリックできる', () => {
    const mockPlaySound = jest.fn();
    (AudioContext.useAudio as jest.Mock).mockReturnValue({
      playSound: mockPlaySound,
      speak: jest.fn(),
    });

    render(<HomePage />, { wrapper: AllTheProviders });

    const alphabetCard = screen.getByRole('button', { name: /Play アルファベット game/ });
    fireEvent.click(alphabetCard);

    expect(mockPlaySound).toHaveBeenCalledWith('click');
  });

  it('進捗ボタンをクリックできる', () => {
    const mockPlaySound = jest.fn();
    (AudioContext.useAudio as jest.Mock).mockReturnValue({
      playSound: mockPlaySound,
      speak: jest.fn(),
    });

    render(<HomePage />, { wrapper: AllTheProviders });

    const progressButton = screen.getByText(/がくしゅうきろく/);
    fireEvent.click(progressButton);

    expect(mockPlaySound).toHaveBeenCalledWith('click');
  });
});
