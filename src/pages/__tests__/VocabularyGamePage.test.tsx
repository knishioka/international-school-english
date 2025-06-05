import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { VocabularyGamePage } from '../VocabularyGamePage';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AudioProvider } from '@/contexts/AudioContext';
import { progressService } from '@/services/progressService';

const mockNavigate = jest.fn();
const mockPlaySound = jest.fn();
const mockSpeak = jest.fn();

// Mock progress service
jest.mock('@/services/progressService', () => ({
  progressService: {
    updateSentencePracticeProgress: jest.fn(),
  },
}));

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

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

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
    localStorage.clear();
  });

  it('文章練習のタイトルを表示する', () => {
    render(<VocabularyGamePage />, { wrapper: AllTheProviders });
    expect(screen.getByText(/Sentence Practice|ぶんしょうれんしゅう/)).toBeInTheDocument();
    expect(screen.getAllByText('📝').length).toBeGreaterThan(0);
  });

  it('カテゴリーボタンを表示する', () => {
    render(<VocabularyGamePage />, { wrapper: AllTheProviders });
    // デフォルトは日本語なので、日本語のカテゴリー名を確認
    expect(screen.getByText('すべてのぶんしょう')).toBeInTheDocument();
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

  it('shows progressive hints when hint button is clicked', async () => {
    render(<VocabularyGamePage />, { wrapper: AllTheProviders });

    // Select a sentence
    const sentenceCard = screen.getByText('I eat breakfast every morning.');
    await act(async () => {
      fireEvent.click(sentenceCard);
    });

    // Initial state - no hint
    expect(screen.queryByText(/ヒントレベル/)).not.toBeInTheDocument();

    // Click hint button - Level 1
    const hintButton = screen.getByRole('button', { name: /ヒント|Hint/ });
    await act(async () => {
      fireEvent.click(hintButton);
    });

    expect(screen.getByText(/ヒントレベル 1|Hint Level 1/)).toBeInTheDocument();
    expect(screen.getByText(/個の単語|words to make/)).toBeInTheDocument();

    // Click hint button - Level 2
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /ヒント|Hint/ }));
    });
    expect(screen.getByText(/ヒントレベル 2|Hint Level 2/)).toBeInTheDocument();
    expect(screen.getByText(/最初の単語|first word/)).toBeInTheDocument();

    // Click hint button - Level 3
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /ヒント|Hint/ }));
    });
    expect(screen.getByText(/ヒントレベル 3|Hint Level 3/)).toBeInTheDocument();
    expect(screen.getByText(/文の前半|First half/)).toBeInTheDocument();

    // Hint button should be disabled after level 3
    const disabledHintButton = screen.getByRole('button', { name: /ヒント|Hint/ });
    expect(disabledHintButton).toBeDisabled();
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

  it('ユーザー名が設定されている場合、正解時に進捗を保存する', async () => {
    // ユーザー名を設定
    localStorage.setItem('userName', 'testUser');

    render(<VocabularyGamePage />, { wrapper: AllTheProviders });

    // 文章を選択
    const sentenceCard = screen.getByText('I eat breakfast every morning.');
    await act(async () => {
      fireEvent.click(sentenceCard);
    });

    // 正しい順序で単語を選択
    await waitFor(() => screen.getByText('I'));

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

    // 進捗保存が呼ばれることを確認
    await waitFor(() => {
      expect(progressService.updateSentencePracticeProgress).toHaveBeenCalledWith(
        'testUser',
        '1', // sentence ID
        true, // isCorrect
        70, // score (5 words * 10 + 20 bonus for no hint)
      );
    });
  });

  it('ユーザー名が設定されていない場合、進捗を保存しない', async () => {
    render(<VocabularyGamePage />, { wrapper: AllTheProviders });

    // 文章を選択して完了
    const sentenceCard = screen.getByText('I eat breakfast every morning.');
    await act(async () => {
      fireEvent.click(sentenceCard);
    });

    await waitFor(() => screen.getByText('I'));

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

    const checkButton = screen.getByText(/Check Answer|こたえをみる/);
    await act(async () => {
      fireEvent.click(checkButton);
    });

    // 進捗保存が呼ばれないことを確認
    await waitFor(() => {
      expect(progressService.updateSentencePracticeProgress).not.toHaveBeenCalled();
    });
  });

  it('ヒントを使用した場合、スコアが減る', async () => {
    localStorage.setItem('userName', 'testUser');

    render(<VocabularyGamePage />, { wrapper: AllTheProviders });

    // 文章を選択
    const sentenceCard = screen.getByText('I eat breakfast every morning.');
    await act(async () => {
      fireEvent.click(sentenceCard);
    });

    // ヒントを使用
    await waitFor(() => screen.getByText(/Hint|ヒント/));
    const hintButton = screen.getByText(/Hint|ヒント/);
    await act(async () => {
      fireEvent.click(hintButton);
    });

    // 正しい順序で単語を選択
    await waitFor(() => screen.getByText('I'));

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

    const checkButton = screen.getByText(/Check Answer|こたえをみる/);
    await act(async () => {
      fireEvent.click(checkButton);
    });

    // ヒントレベル1使用時: (5 words * 10) - (1 * 10) + 0 = 40点
    await waitFor(() => {
      expect(progressService.updateSentencePracticeProgress).toHaveBeenCalledWith(
        'testUser',
        '1',
        true,
        40, // score: base 50 - hint penalty 10
      );
    });
  });
});
