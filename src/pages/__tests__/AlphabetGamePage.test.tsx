import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AlphabetGamePage } from '../AlphabetGamePage';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AudioProvider } from '@/contexts/AudioContext';

const mockNavigate = jest.fn();
const mockPlaySound = jest.fn();
const mockSpeak = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@/contexts/AudioContext', () => ({
  ...jest.requireActual('@/contexts/AudioContext'),
  useAudio: () => ({
    playSound: mockPlaySound,
    speak: mockSpeak,
  }),
}));

const AllTheProviders = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <BrowserRouter>
      <AudioProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </AudioProvider>
    </BrowserRouter>
  );
};

describe('AlphabetGamePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('アルファベット学習ページのタイトルを表示する', () => {
    render(<AlphabetGamePage />, { wrapper: AllTheProviders });

    expect(screen.getByText(/アルファベット 🔤/)).toBeInTheDocument();
  });

  it('最初の文字Aを表示する', () => {
    render(<AlphabetGamePage />, { wrapper: AllTheProviders });

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('🍎')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('プログレスバーを表示する', () => {
    render(<AlphabetGamePage />, { wrapper: AllTheProviders });

    expect(screen.getByText(/Progress|しんちょく/)).toBeInTheDocument();
    expect(screen.getByText('1 / 26')).toBeInTheDocument();
  });

  it('文字をクリックすると音声が再生される', async () => {
    render(<AlphabetGamePage />, { wrapper: AllTheProviders });

    const letterButton = screen.getByText('A');
    await act(async () => {
      fireEvent.click(letterButton);
    });

    await waitFor(() => {
      expect(mockPlaySound).toHaveBeenCalledWith('success');
      expect(mockSpeak).toHaveBeenCalled();
    });
  });

  it('大文字・小文字を切り替えできる', async () => {
    render(<AlphabetGamePage />, { wrapper: AllTheProviders });

    // 最初は大文字
    expect(screen.getByText('A')).toBeInTheDocument();

    // 小文字ボタンをクリック
    const toggleButton = screen.getByText(/lowercase|こもじ/);
    await act(async () => {
      fireEvent.click(toggleButton);
    });

    // 小文字に変わる
    await waitFor(() => {
      expect(screen.getByText('a')).toBeInTheDocument();
      expect(screen.getByText(/UPPERCASE|おおもじ/)).toBeInTheDocument();
    });
  });

  it('次の文字に進める', async () => {
    render(<AlphabetGamePage />, { wrapper: AllTheProviders });

    // 最初はA
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();

    // 次ボタンをクリック
    const nextButton = screen.getByText(/Next|つぎ/);
    await act(async () => {
      fireEvent.click(nextButton);
    });

    // Bに変わる
    await waitFor(() => {
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText('Ball')).toBeInTheDocument();
      expect(screen.getByText('⚽')).toBeInTheDocument();
    });
  });

  it('前の文字に戻れる', async () => {
    render(<AlphabetGamePage />, { wrapper: AllTheProviders });

    // まず次に進む
    const nextButton = screen.getByText(/Next|つぎ/);
    await act(async () => {
      fireEvent.click(nextButton);
    });

    await waitFor(() => {
      expect(screen.getByText('B')).toBeInTheDocument();
    });

    // 前ボタンをクリック
    const prevButton = screen.getByText(/Previous|まえ/);
    await act(async () => {
      fireEvent.click(prevButton);
    });

    // Aに戻る
    await waitFor(() => {
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });
  });

  it('最初の文字では前ボタンが無効', () => {
    render(<AlphabetGamePage />, { wrapper: AllTheProviders });

    const prevButton = screen.getByText(/Previous|まえ/);
    expect(prevButton).toBeDisabled();
  });

  it('単語をクリックすると音声が再生される', async () => {
    render(<AlphabetGamePage />, { wrapper: AllTheProviders });

    const wordButton = screen.getByText('Apple').closest('button');
    expect(wordButton).toBeInTheDocument();

    if (wordButton) {
      await act(async () => {
        fireEvent.click(wordButton);
      });
    }

    expect(mockPlaySound).toHaveBeenCalledWith('click');
    expect(mockSpeak).toHaveBeenCalled();
  });

  it('戻るボタンでホームに戻る', async () => {
    render(<AlphabetGamePage />, { wrapper: AllTheProviders });

    const backButton = screen.getByLabelText('Back to home');
    await act(async () => {
      fireEvent.click(backButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('日本語表示時に発音が表示される', () => {
    render(<AlphabetGamePage />, { wrapper: AllTheProviders });

    // 日本語表示時のみ発音が表示される
    expect(screen.getByText('[エイ]')).toBeInTheDocument();
    expect(screen.getByText('りんご')).toBeInTheDocument();
  });

  it('最後の文字では次ボタンが無効', async () => {
    render(<AlphabetGamePage />, { wrapper: AllTheProviders });

    // Z（最後の文字）まで進む
    const nextButton = screen.getByText(/Next|つぎ/);

    // 25回クリック（A->Z）
    for (let i = 0; i < 25; i++) {
      await act(async () => {
        fireEvent.click(nextButton);
      });
    }

    await waitFor(() => {
      expect(screen.getByText('Z')).toBeInTheDocument();
      expect(screen.getByText('Zebra')).toBeInTheDocument();
      expect(nextButton).toBeDisabled();
    });
  });

  it('最後の文字で完了メッセージを表示する', async () => {
    render(<AlphabetGamePage />, { wrapper: AllTheProviders });

    const nextButton = screen.getByText(/Next|つぎ/);

    // Z（最後の文字）まで進む
    for (let i = 0; i < 25; i++) {
      await act(async () => {
        fireEvent.click(nextButton);
      });
    }

    await waitFor(() => {
      expect(screen.getByText('🎉')).toBeInTheDocument();
      expect(screen.getByText(/Great job!|おつかれさま！/)).toBeInTheDocument();
    });
  });
});
