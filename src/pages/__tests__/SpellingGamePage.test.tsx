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

});
