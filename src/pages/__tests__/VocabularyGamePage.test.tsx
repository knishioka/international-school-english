import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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
    expect(screen.getAllByText('📝').length).toBeGreaterThan(0);
  });

  it('カテゴリーボタンを表示する', () => {
    render(<VocabularyGamePage />, { wrapper: AllTheProviders });
    // デフォルトは日本語なので、日本語のカテゴリー名を確認
    expect(screen.getByText('すべての ぶんしょう')).toBeInTheDocument();
    expect(screen.getByText('にちじょう')).toBeInTheDocument();
    expect(screen.getByText('がっこう')).toBeInTheDocument();
    expect(screen.getByText('しぜん')).toBeInTheDocument();
    expect(screen.getByText('かぞく')).toBeInTheDocument();
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
    await act(async () => {
      fireEvent.click(sentenceCard);
    });

    // 単語を順番にクリック
    await waitFor(() => screen.getByText('I'));

    // 個別に各単語をクリック（shuffleされている可能性があるため）
    const words = ['I', 'eat', 'breakfast', 'every', 'morning'];
    for (const word of words) {
      const wordButton = screen.getAllByText(word).find((el) => {
        const button = el.closest('button');
        return button !== null && !button.disabled;
      });
      if (wordButton) {
        await act(async () => {
          fireEvent.click(wordButton);
        });
      }
    }

    // 答えをチェック
    const checkButton = screen.getByText(/Check Answer|こたえをみる/);
    await act(async () => {
      fireEvent.click(checkButton);
    });

    // 正解メッセージが表示される
    await waitFor(() => {
      expect(screen.getByText(/Correct! 🎉|せいかい！ 🎉/)).toBeInTheDocument();
      expect(mockPlaySound).toHaveBeenCalledWith('success');
    });
  });

  it('間違った順序で単語を選んだ場合エラーメッセージを表示する', async () => {
    render(<VocabularyGamePage />, { wrapper: AllTheProviders });

    // 文章を選択
    const sentenceCard = screen.getByText('I eat breakfast every morning.');
    await act(async () => {
      fireEvent.click(sentenceCard);
    });

    // 間違った順序で単語をクリック
    await waitFor(() => screen.getByText('breakfast'));

    await act(async () => {
      fireEvent.click(screen.getByText('breakfast'));
      fireEvent.click(screen.getByText('I'));
      fireEvent.click(screen.getByText('eat'));
    });

    // 答えをチェック
    const checkButton = screen.getByText(/Check Answer|こたえをみる/);
    await act(async () => {
      fireEvent.click(checkButton);
    });

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
    await act(async () => {
      fireEvent.click(sentenceCard);
    });

    // ヒントボタンをクリック
    await waitFor(() => screen.getByText(/Hint|ヒント/));
    const hintButton = screen.getByText(/Hint|ヒント/);

    await act(async () => {
      fireEvent.click(hintButton);
    });

    // ヒントとして英文が表示されるか、もしくは日本語のテキストが表示される
    await waitFor(() => {
      const englishText = screen.queryAllByText('I eat breakfast every morning.');
      const japaneseText = screen.queryByText(/わたしは まいあさ あさごはんを たべます/);
      expect(englishText.length > 1 || japaneseText).toBeTruthy();
    });
  });

  it('戻るボタンでホームに戻る', async () => {
    render(<VocabularyGamePage />, { wrapper: AllTheProviders });

    const backButton = screen.getByLabelText('Back to home');

    await act(async () => {
      fireEvent.click(backButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});
