import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BadgeReward } from '../BadgeReward';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AudioProvider } from '@/contexts/AudioContext';

const TestWrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <LanguageProvider>
    <AudioProvider>{children}</AudioProvider>
  </LanguageProvider>
);

// Mock navigator for speech synthesis
Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    speak: jest.fn(),
    cancel: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    getVoices: jest.fn(() => []),
  },
});

describe('BadgeReward', () => {
  const defaultProps = {
    totalScore: 250,
    streakDays: 5,
    completedActivities: 15,
    accuracy: 85,
    unlockedBadges: ['rookie'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders badge collection title', () => {
    render(
      <TestWrapper>
        <BadgeReward {...defaultProps} />
      </TestWrapper>,
    );

    expect(screen.getByText(/Badge Collection|バッジ コレクション/)).toBeInTheDocument();
  });

  it('displays correct number of badges', () => {
    render(
      <TestWrapper>
        <BadgeReward {...defaultProps} />
      </TestWrapper>,
    );

    // Should show all badge names
    expect(screen.getByText(/Rookie Learner|しんじん がくしゅうしゃ/)).toBeInTheDocument();
    expect(screen.getByText(/Rising Star|のびざかりスター/)).toBeInTheDocument();
    expect(screen.getByText(/Learning Champion|がくしゅう チャンピオン/)).toBeInTheDocument();
  });

  it('shows progress for locked badges', () => {
    render(
      <TestWrapper>
        <BadgeReward {...defaultProps} />
      </TestWrapper>,
    );

    // Progress text should be shown
    expect(screen.getByText(/1 \/ \d+ badges unlocked|1 \/ \d+ バッジ かくとく/)).toBeInTheDocument();
  });

  it('highlights unlocked badges', () => {
    render(
      <TestWrapper>
        <BadgeReward {...defaultProps} />
      </TestWrapper>,
    );

    // Rookie badge should be unlocked (100 points requirement, user has 250)
    const rookieBadge = screen.getByText(/Rookie Learner|しんじん がくしゅうしゃ/).closest('button');
    expect(rookieBadge).toHaveClass('bg-green-500');
  });

  it('shows badge detail modal when clicked', async () => {
    render(
      <TestWrapper>
        <BadgeReward {...defaultProps} />
      </TestWrapper>,
    );

    const badge = screen.getByText(/Rookie Learner|しんじん がくしゅうしゃ/).closest('button');
    if (badge) {
      fireEvent.click(badge);
    }

    // Modal should appear with badge details
    await waitFor(() => {
      expect(screen.getByText(/Earn 100 points|100ポイント かくとく/)).toBeInTheDocument();
      expect(screen.getByText(/Unlocked!|かくとく ずみ！/)).toBeInTheDocument();
    });
  });

  it('closes modal when close button is clicked', async () => {
    render(
      <TestWrapper>
        <BadgeReward {...defaultProps} />
      </TestWrapper>,
    );

    const badge = screen.getByText(/Rookie Learner|しんじん がくしゅうしゃ/).closest('button');
    if (badge) {
      fireEvent.click(badge);
    }

    await waitFor(() => {
      const closeButton = screen.getByText(/Close|とじる/);
      fireEvent.click(closeButton);
    });

    // Modal should disappear
    await waitFor(() => {
      expect(screen.queryByText(/Earn 100 points|100ポイント かくとく/)).not.toBeInTheDocument();
    });
  });

  it('shows NEW indicator for newly unlocked badges', () => {
    const props = {
      ...defaultProps,
      totalScore: 550, // Enough for Rising Star (500 points)
      unlockedBadges: ['rookie'], // But not in unlocked list yet
    };

    render(
      <TestWrapper>
        <BadgeReward {...props} />
      </TestWrapper>,
    );

    // Should show NEW indicator on Rising Star badge
    const badges = screen.getAllByText('NEW');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('displays progress bar for locked badges', async () => {
    const props = {
      ...defaultProps,
      totalScore: 750, // 75% progress to champion badge (1000 points)
    };

    render(
      <TestWrapper>
        <BadgeReward {...props} />
      </TestWrapper>,
    );

    const championBadge = screen.getByText(/Learning Champion|がくしゅう チャンピオン/).closest('button');
    if (championBadge) {
      fireEvent.click(championBadge);
    }

    // Should show progress in modal
    await waitFor(() => {
      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });

  it('handles different badge types correctly', () => {
    const props = {
      ...defaultProps,
      streakDays: 3, // Exactly 3 days for Consistent Learner badge
      accuracy: 90, // Exactly 90% for Precise Thinker badge
    };

    render(
      <TestWrapper>
        <BadgeReward {...props} />
      </TestWrapper>,
    );

    // Consistent Learner should be unlocked
    const consistentBadge = screen.getByText(/Consistent Learner|まいにち がくしゅう/).closest('button');
    expect(consistentBadge).toHaveClass('bg-orange-500');

    // Precise Thinker should be unlocked
    const preciseBadge = screen.getByText(/Precise Thinker|せいかくな しこう/).closest('button');
    expect(preciseBadge).toHaveClass('bg-violet-500');
  });

  it('shows correct total progress', () => {
    render(
      <TestWrapper>
        <BadgeReward {...defaultProps} />
      </TestWrapper>,
    );

    const progressBar = screen.getByText(/badges unlocked|バッジ かくとく/)
      .parentElement
      ?.querySelector('.bg-gradient-to-r');
    
    expect(progressBar).toBeInTheDocument();
  });
});