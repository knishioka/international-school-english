import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SpellingGamePage } from '../SpellingGamePage';
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

describe('SpellingGamePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders difficulty selection screen initially', () => {
    render(
      <TestWrapper>
        <SpellingGamePage />
      </TestWrapper>,
    );

    expect(screen.getByText(/Spelling Game|スペルチェック/)).toBeInTheDocument();
    expect(screen.getByText(/Choose Your Level|レベルを えらんでね/)).toBeInTheDocument();
    expect(screen.getByText(/Easy|かんたん/)).toBeInTheDocument();
    expect(screen.getByText(/Medium|ふつう/)).toBeInTheDocument();
    expect(screen.getByText(/Hard|むずかしい/)).toBeInTheDocument();
  });

  it('highlights selected difficulty', async () => {
    render(
      <TestWrapper>
        <SpellingGamePage />
      </TestWrapper>,
    );

    // Easy is selected by default
    const easyButton = screen.getByText(/Easy|かんたん/).closest('button');
    expect(easyButton).toHaveClass('bg-blue-500');

    // Click medium button
    const mediumButton = screen.getByText(/Medium|ふつう/).closest('button');
    if (mediumButton) {
      fireEvent.click(mediumButton);

      // Wait for state update
      await waitFor(() => {
        expect(mediumButton).toHaveClass('bg-blue-500');
        expect(easyButton).not.toHaveClass('bg-blue-500');
      });
    }
  });

  it('starts game when start button is clicked', async () => {
    render(
      <TestWrapper>
        <SpellingGamePage />
      </TestWrapper>,
    );

    const startButton = screen.getByText(/Start Game!|はじめる！/);
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.queryByText(/Choose Your Level|レベルを えらんでね/)).not.toBeInTheDocument();
      expect(screen.getByText(/Type the spelling|スペルを いれてね/)).toBeInTheDocument();
    });
  });

  it('displays game UI when started', async () => {
    render(
      <TestWrapper>
        <SpellingGamePage />
      </TestWrapper>,
    );

    const startButton = screen.getByText(/Start Game!|はじめる！/);
    fireEvent.click(startButton);

    await waitFor(() => {
      // Just check that game UI is displayed, not specific words
      expect(screen.getByText(/Type the spelling|スペルを いれてね/)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Type here|ここに かいてね/)).toBeInTheDocument();
      expect(screen.getByText(/Check Answer|こたえをみる/)).toBeInTheDocument();
    });
  });

  it('can return to difficulty selection', async () => {
    render(
      <TestWrapper>
        <SpellingGamePage />
      </TestWrapper>,
    );

    const startButton = screen.getByText(/Start Game!|はじめる！/);
    fireEvent.click(startButton);

    await waitFor(() => {
      const backButton = screen.getByLabelText('Back to menu');
      fireEvent.click(backButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Choose Your Level|レベルを えらんでね/)).toBeInTheDocument();
    });
  });

  it('disables submit button when input is empty', async () => {
    render(
      <TestWrapper>
        <SpellingGamePage />
      </TestWrapper>,
    );

    const startButton = screen.getByText(/Start Game!|はじめる！/);
    fireEvent.click(startButton);

    await waitFor(() => {
      const submitButton = screen.getByText(/Check Answer|こたえをみる/);
      expect(submitButton).toBeDisabled();
    });
  });

  it('can type alphabet letters in input field', async () => {
    render(
      <TestWrapper>
        <SpellingGamePage />
      </TestWrapper>,
    );

    const startButton = screen.getByText(/Start Game!|はじめる！/);
    fireEvent.click(startButton);

    await waitFor(() => {
      const inputField = screen.getByPlaceholderText(
        /Type here|ここに かいてね/,
      ) as HTMLInputElement;
      expect(inputField).toBeInTheDocument();
    });

    const inputField = screen.getByPlaceholderText(/Type here|ここに かいてね/) as HTMLInputElement;

    // Type 'hello' in the input field
    fireEvent.change(inputField, { target: { value: 'hello' } });

    await waitFor(() => {
      expect(inputField.value).toBe('hello');
    });
  });

  it('displays alphabet buttons for input', async () => {
    render(
      <TestWrapper>
        <SpellingGamePage />
      </TestWrapper>,
    );

    const startButton = screen.getByText(/Start Game!|はじめる！/);
    fireEvent.click(startButton);

    await waitFor(() => {
      // Check that all alphabet buttons are displayed
      for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')) {
        expect(screen.getByText(letter)).toBeInTheDocument();
      }
      // Check backspace button
      expect(screen.getByText('⌫')).toBeInTheDocument();
    });
  });

  it('can input text using alphabet buttons', async () => {
    render(
      <TestWrapper>
        <SpellingGamePage />
      </TestWrapper>,
    );

    const startButton = screen.getByText(/Start Game!|はじめる！/);
    fireEvent.click(startButton);

    await waitFor(() => {
      const inputField = screen.getByPlaceholderText(
        /Type here|ここに かいてね/,
      ) as HTMLInputElement;
      expect(inputField.value).toBe('');
    });

    // Click some letters
    const buttonC = screen.getByRole('button', { name: 'C' });
    await waitFor(() => expect(buttonC).toBeInTheDocument());

    fireEvent.click(buttonC);

    await waitFor(() => {
      const inputField = screen.getByPlaceholderText(
        /Type here|ここに かいてね/,
      ) as HTMLInputElement;
      expect(inputField.value).toBe('c');
    });

    const buttonA = screen.getByRole('button', { name: 'A' });
    fireEvent.click(buttonA);

    await waitFor(() => {
      const inputField = screen.getByPlaceholderText(
        /Type here|ここに かいてね/,
      ) as HTMLInputElement;
      expect(inputField.value).toBe('ca');
    });

    const buttonT = screen.getByRole('button', { name: 'T' });
    fireEvent.click(buttonT);

    await waitFor(() => {
      const inputField = screen.getByPlaceholderText(
        /Type here|ここに かいてね/,
      ) as HTMLInputElement;
      expect(inputField.value).toBe('cat');
    });
  });

  it('can delete text using backspace button', async () => {
    render(
      <TestWrapper>
        <SpellingGamePage />
      </TestWrapper>,
    );

    const startButton = screen.getByText(/Start Game!|はじめる！/);
    fireEvent.click(startButton);

    await waitFor(() => {
      const inputField = screen.getByPlaceholderText(
        /Type here|ここに かいてね/,
      ) as HTMLInputElement;
      expect(inputField).toBeInTheDocument();
    });

    // Type some letters
    const buttonA = screen.getByRole('button', { name: 'A' });
    const buttonB = screen.getByRole('button', { name: 'B' });
    const buttonC = screen.getByRole('button', { name: 'C' });

    fireEvent.click(buttonA);

    await waitFor(() => {
      const inputField = screen.getByPlaceholderText(
        /Type here|ここに かいてね/,
      ) as HTMLInputElement;
      expect(inputField.value).toBe('a');
    });

    fireEvent.click(buttonB);

    await waitFor(() => {
      const inputField = screen.getByPlaceholderText(
        /Type here|ここに かいてね/,
      ) as HTMLInputElement;
      expect(inputField.value).toBe('ab');
    });

    fireEvent.click(buttonC);

    await waitFor(() => {
      const inputField = screen.getByPlaceholderText(
        /Type here|ここに かいてね/,
      ) as HTMLInputElement;
      expect(inputField.value).toBe('abc');
    });

    // Click backspace
    const backspaceButton = screen.getByRole('button', { name: '⌫' });
    fireEvent.click(backspaceButton);

    await waitFor(() => {
      const inputField = screen.getByPlaceholderText(
        /Type here|ここに かいてね/,
      ) as HTMLInputElement;
      expect(inputField.value).toBe('ab');
    });
  });

  it('disables alphabet buttons after answer is checked', async () => {
    render(
      <TestWrapper>
        <SpellingGamePage />
      </TestWrapper>,
    );

    const startButton = screen.getByText(/Start Game!|はじめる！/);
    fireEvent.click(startButton);

    await waitFor(() => {
      const inputField = screen.getByPlaceholderText(
        /Type here|ここに かいてね/,
      ) as HTMLInputElement;
      fireEvent.change(inputField, { target: { value: 'test' } });
    });

    const checkButton = screen.getByText(/Check Answer|こたえをみる/);
    fireEvent.click(checkButton);

    await waitFor(() => {
      // All alphabet buttons should be disabled
      for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')) {
        const button = screen.getByText(letter).closest('button');
        expect(button).toBeDisabled();
      }
      // Backspace should also be disabled
      const backspaceButton = screen.getByText('⌫').closest('button');
      expect(backspaceButton).toBeDisabled();
    });
  });
});
