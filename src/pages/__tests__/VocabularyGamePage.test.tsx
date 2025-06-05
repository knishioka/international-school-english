import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { VocabularyGamePage } from '../VocabularyGamePage';
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

describe('VocabularyGamePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('文章練習のタイトルを表示する', () => {
    render(<VocabularyGamePage />, { wrapper: AllTheProviders });
    expect(screen.getByText(/Sentence Practice|ぶんしょうれんしゅう/)).toBeInTheDocument();
    expect(screen.getByText('📝')).toBeInTheDocument();
  });

  it('カテゴリーボタンを表示する', () => {
    render(<VocabularyGamePage />, { wrapper: AllTheProviders });
    expect(screen.getByText('All Sentences')).toBeInTheDocument();
    expect(screen.getByText('Daily Life')).toBeInTheDocument();
    expect(screen.getByText('School')).toBeInTheDocument();
    expect(screen.getByText('Nature')).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
  });

  it('文章カードをクリックするとゲームが開始される', async () => {
    render(<VocabularyGamePage />, { wrapper: AllTheProviders });

    const sentenceCard = screen.getByText('I eat breakfast every morning.');
    fireEvent.click(sentenceCard);

    await waitFor(() => {
      expect(
        screen.getByText(/Select words to make a sentence|ことばを えらんでね/),
      ).toBeInTheDocument();
    });
  });

  it('単語をクリックして文章を組み立てられる', async () => {
    render(<VocabularyGamePage />, { wrapper: AllTheProviders });

    // 文章を選択
    const sentenceCard = screen.getByText('I eat breakfast every morning.');
    fireEvent.click(sentenceCard);

    // 単語を順番にクリック
    await waitFor(() => {
      fireEvent.click(screen.getByText('I'));
      fireEvent.click(screen.getByText('eat'));
      fireEvent.click(screen.getByText('breakfast'));
      fireEvent.click(screen.getByText('every'));
      fireEvent.click(screen.getByText('morning'));
    });

    // 答えをチェック
    const checkButton = screen.getByText(/Check Answer|こたえをみる/);
    fireEvent.click(checkButton);

    // 正解メッセージが表示される（句読点なしで比較するため）
    await waitFor(() => {
      expect(screen.getByText(/Correct! 🎉|せいかい！ 🎉/)).toBeInTheDocument();
      expect(mockPlaySound).toHaveBeenCalledWith('success');
    });
  });

  it('間違った順序で単語を選んだ場合エラーメッセージを表示する', async () => {
    render(<VocabularyGamePage />, { wrapper: AllTheProviders });

    // 文章を選択
    const sentenceCard = screen.getByText('I eat breakfast every morning.');
    fireEvent.click(sentenceCard);

    // 間違った順序で単語をクリック
    await waitFor(() => {
      fireEvent.click(screen.getByText('breakfast'));
      fireEvent.click(screen.getByText('I'));
      fireEvent.click(screen.getByText('eat'));
    });

    // 答えをチェック
    const checkButton = screen.getByText(/Check Answer|こたえをみる/);
    fireEvent.click(checkButton);

    // エラーメッセージが表示される
    await waitFor(() => {
      expect(screen.getByText(/Try again 💪|もういちど 💪/)).toBeInTheDocument();
      expect(mockPlaySound).toHaveBeenCalledWith('error');
    });
  });

  it('ヒントボタンをクリックすると英文が表示される', async () => {
    render(<VocabularyGamePage />, { wrapper: AllTheProviders });

    // 文章を選択
    const sentenceCard = screen.getByText('I eat breakfast every morning.');
    fireEvent.click(sentenceCard);

    // ヒントボタンをクリック
    const hintButton = screen.getByText(/Hint|ヒント/);
    fireEvent.click(hintButton);

    // ヒントとして英文が表示される
    await waitFor(() => {
      expect(screen.getAllByText('I eat breakfast every morning.').length).toBeGreaterThan(1);
    });
  });

  it('戻るボタンでホームに戻る', () => {
    render(<VocabularyGamePage />, { wrapper: AllTheProviders });

    const backButton = screen.getByLabelText('Back to home');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});
