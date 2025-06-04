import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { WelcomePage } from '../WelcomePage';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AudioProvider } from '@/contexts/AudioContext';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
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

describe('WelcomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('ウェルカムメッセージが表示される', () => {
    render(<WelcomePage />, { wrapper: AllTheProviders });

    expect(screen.getByText('えいごをまなぼう！')).toBeInTheDocument();
  });

  it('名前入力フィールドが表示される', () => {
    render(<WelcomePage />, { wrapper: AllTheProviders });

    const input = screen.getByPlaceholderText('なまえをいれてね');
    expect(input).toBeInTheDocument();
  });

  it('名前を入力してスタートできる', async () => {
    render(<WelcomePage />, { wrapper: AllTheProviders });

    const input = screen.getByPlaceholderText('なまえをいれてね');
    const button = screen.getByText('あそぼう！');

    // 初期状態ではボタンが無効
    expect(button).toBeDisabled();

    // 名前を入力
    fireEvent.change(input, { target: { value: 'たろう' } });

    // ボタンが有効になる
    expect(button).not.toBeDisabled();

    // ボタンをクリック
    fireEvent.click(button);

    await waitFor(() => {
      expect(localStorage.getItem('userName')).toBe('たろう');
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('Enterキーでもスタートできる', async () => {
    render(<WelcomePage />, { wrapper: AllTheProviders });

    const input = screen.getByPlaceholderText('なまえをいれてね');

    fireEvent.change(input, { target: { value: 'はなこ' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(localStorage.getItem('userName')).toBe('はなこ');
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('言語を切り替えることができる', async () => {
    render(<WelcomePage />, { wrapper: AllTheProviders });

    // 初期状態は日本語
    expect(screen.getByText('えいごをまなぼう！')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();

    // 英語に切り替え
    fireEvent.click(screen.getByText('English'));

    await waitFor(() => {
      expect(screen.getByText('Welcome to English Learning!')).toBeInTheDocument();
      expect(screen.getByText('日本語')).toBeInTheDocument();
    });
  });

  it('空の名前ではスタートできない', () => {
    render(<WelcomePage />, { wrapper: AllTheProviders });

    const input = screen.getByPlaceholderText('なまえをいれてね');
    const button = screen.getByText('あそぼう！');

    // スペースのみ入力
    fireEvent.change(input, { target: { value: '   ' } });

    expect(button).toBeDisabled();
    fireEvent.click(button);

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
