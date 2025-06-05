import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProgressPage } from '../ProgressPage';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AudioProvider } from '@/contexts/AudioContext';
import { progressService } from '@/services/progressService';
import { KanjiGrade } from '@/contexts/LanguageContext';

const mockGetProgressStats = progressService.getProgressStats as jest.MockedFunction<
  typeof progressService.getProgressStats
>;

const mockNavigate = jest.fn();
const mockPlaySound = jest.fn();

// Mock progress service
jest.mock('@/services/progressService', () => ({
  progressService: {
    getProgressStats: jest.fn(),
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

const mockProgressStats = {
  totalScore: 750,
  completedSentences: 15,
  totalSentenceAttempts: 20,
  accuracy: 75,
  completedStories: 3,
  totalStoriesRead: 5,
  streakDays: 7,
  totalTimeSpent: 120,
  achievements: ['first_sentence', 'first_story', 'week_streak'],
  activitiesLast7Days: 25,
  kanjiGrade: 2 as KanjiGrade,
};

describe('ProgressPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('ユーザー名が設定されていない場合、ローディング画面を表示する', () => {
    mockGetProgressStats.mockReturnValue(mockProgressStats);

    render(<ProgressPage />, { wrapper: AllTheProviders });

    expect(
      screen.getByText(/Loading progress|がくしゅうきろくを よみこみちゅう/),
    ).toBeInTheDocument();
    expect(screen.getByText('📊')).toBeInTheDocument();
  });

  it('ユーザー名が設定されている場合、進捗統計を表示する', () => {
    localStorage.setItem('userName', 'testUser');
    mockGetProgressStats.mockReturnValue(mockProgressStats);

    render(<ProgressPage />, { wrapper: AllTheProviders });

    expect(screen.getByText(/testUserの/)).toBeInTheDocument();
    expect(screen.getByText('750')).toBeInTheDocument(); // Total Score
    expect(screen.getByText('15')).toBeInTheDocument(); // Completed Sentences
    expect(screen.getByText('3')).toBeInTheDocument(); // Completed Stories
    expect(screen.getByText('7')).toBeInTheDocument(); // Streak Days
  });

  it('詳細統計を正しく表示する', () => {
    localStorage.setItem('userName', 'testUser');
    mockGetProgressStats.mockReturnValue(mockProgressStats);

    render(<ProgressPage />, { wrapper: AllTheProviders });

    expect(screen.getByText('75%')).toBeInTheDocument(); // Accuracy
    expect(screen.getByText('120 min')).toBeInTheDocument(); // Study Time
    expect(screen.getByText(/2年生|Grade 2/)).toBeInTheDocument(); // Kanji Grade
  });

  it('アチーブメントを表示する', () => {
    localStorage.setItem('userName', 'testUser');
    mockGetProgressStats.mockReturnValue(mockProgressStats);

    render(<ProgressPage />, { wrapper: AllTheProviders });

    expect(screen.getByText(/Achievements|アチーブメント/)).toBeInTheDocument();
    expect(screen.getAllByText(/はじめての ぶんしょう/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/はじめての おはなし/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/しゅうかん チャンピオン/).length).toBeGreaterThan(0);
  });

  it('アチーブメントがない場合、励ましメッセージを表示する', () => {
    localStorage.setItem('userName', 'testUser');
    const statsWithoutAchievements = {
      ...mockProgressStats,
      achievements: [],
    };
    mockGetProgressStats.mockReturnValue(statsWithoutAchievements);

    render(<ProgressPage />, { wrapper: AllTheProviders });

    expect(
      screen.getByText(
        /Keep learning to unlock achievements|がくしゅうを つづけて アチーブメントを かくとく しよう/,
      ),
    ).toBeInTheDocument();
  });

  it('今週の活動統計を表示する', () => {
    localStorage.setItem('userName', 'testUser');
    mockGetProgressStats.mockReturnValue(mockProgressStats);

    render(<ProgressPage />, { wrapper: AllTheProviders });

    expect(screen.getByText(/This Week's Activity|こんしゅうの かつどう/)).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument(); // Activities last 7 days
  });

  it('戻るボタンでホームに戻る', async () => {
    localStorage.setItem('userName', 'testUser');
    mockGetProgressStats.mockReturnValue(mockProgressStats);

    render(<ProgressPage />, { wrapper: AllTheProviders });

    const backButton = screen.getByLabelText('Back to home');
    await act(async () => {
      fireEvent.click(backButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/home');
    expect(mockPlaySound).toHaveBeenCalledWith('click');
  });

  it('アチーブメントアイコンとチェックマークを表示する', () => {
    localStorage.setItem('userName', 'testUser');
    mockGetProgressStats.mockReturnValue(mockProgressStats);

    render(<ProgressPage />, { wrapper: AllTheProviders });

    // Achievement icons - using getAllByText since icons appear multiple times
    expect(screen.getAllByText('🌟').length).toBeGreaterThan(0); // First sentence
    expect(screen.getAllByText('📖').length).toBeGreaterThan(0); // First story
    expect(screen.getAllByText('🔥').length).toBeGreaterThan(0); // Week streak

    // Check marks for completed achievements
    const checkMarks = screen.getAllByText('✓');
    expect(checkMarks).toHaveLength(3); // One for each achievement
  });

  it('励ましメッセージを表示する', () => {
    localStorage.setItem('userName', 'testUser');
    mockGetProgressStats.mockReturnValue(mockProgressStats);

    render(<ProgressPage />, { wrapper: AllTheProviders });

    expect(screen.getByText(/まいにち すこしずつ がんばろう/)).toBeInTheDocument();
    // Note: 🌈 emoji might be in the message text
  });

  it('progress serviceから正しいユーザー名でデータを取得する', () => {
    localStorage.setItem('userName', 'testUser');
    mockGetProgressStats.mockReturnValue(mockProgressStats);

    render(<ProgressPage />, { wrapper: AllTheProviders });

    expect(mockGetProgressStats).toHaveBeenCalledWith('testUser');
  });

  it('各アチーブメントタイプの情報を正しく表示する', () => {
    localStorage.setItem('userName', 'testUser');
    const allAchievements = {
      ...mockProgressStats,
      achievements: [
        'first_sentence',
        'first_story',
        'sentence_master',
        'story_reader',
        'week_streak',
        'score_champion',
      ],
    };
    mockGetProgressStats.mockReturnValue(allAchievements);

    render(<ProgressPage />, { wrapper: AllTheProviders });

    // All achievement types should be displayed
    expect(screen.getAllByText(/はじめての ぶんしょう/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/はじめての おはなし/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ぶんしょう マスター/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/おはなし はかせ/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/しゅうかん チャンピオン/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/スコア チャンピオン/).length).toBeGreaterThan(0);
  });

  it('統計カードのアイコンを正しく表示する', () => {
    localStorage.setItem('userName', 'testUser');
    mockGetProgressStats.mockReturnValue(mockProgressStats);

    render(<ProgressPage />, { wrapper: AllTheProviders });

    const icons = screen.getAllByText('🎯');
    expect(icons.length).toBeGreaterThan(0); // Total Score
    expect(screen.getByText('📝')).toBeInTheDocument(); // Completed Sentences
    const bookIcons = screen.getAllByText('📖');
    expect(bookIcons.length).toBeGreaterThan(0); // Stories Read
    const fireIcons = screen.getAllByText('🔥');
    expect(fireIcons.length).toBeGreaterThan(0); // Day Streak
    expect(screen.getByText('📅')).toBeInTheDocument(); // Weekly activity
  });
});
