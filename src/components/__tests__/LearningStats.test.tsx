import { render, screen } from '@testing-library/react';
import { LearningStats } from '../LearningStats';
import { LanguageProvider } from '@/contexts/LanguageContext';

const TestWrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <LanguageProvider>{children}</LanguageProvider>
);

// Mock ResizeObserver
class ResizeObserverMock {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

global.ResizeObserver = ResizeObserverMock;

describe('LearningStats', () => {
  const mockWeeklyData = [
    { day: 'Mon', activities: 3, score: 100 },
    { day: 'Tue', activities: 5, score: 150 },
    { day: 'Wed', activities: 2, score: 180 },
    { day: 'Thu', activities: 4, score: 250 },
    { day: 'Fri', activities: 6, score: 320 },
    { day: 'Sat', activities: 3, score: 350 },
    { day: 'Sun', activities: 1, score: 360 },
  ];

  const mockCategoryProgress = [
    { category: 'spelling', completed: 8, total: 15 },
    { category: 'vocabulary', completed: 12, total: 18 },
    { category: 'stories', completed: 4, total: 6 },
    { category: 'sentences', completed: 15, total: 20 },
  ];

  const mockTimeDistribution = [
    { activity: 'spelling', minutes: 45 },
    { activity: 'vocabulary', minutes: 30 },
    { activity: 'stories', minutes: 60 },
    { activity: 'sentences', minutes: 25 },
  ];

  it('renders all chart sections', () => {
    render(
      <TestWrapper>
        <LearningStats
          weeklyData={mockWeeklyData}
          categoryProgress={mockCategoryProgress}
          timeDistribution={mockTimeDistribution}
        />
      </TestWrapper>,
    );

    expect(screen.getByText(/Weekly Activity|しゅうかん かつどう/)).toBeInTheDocument();
    expect(screen.getByText(/Score Progress|スコア しんちょく/)).toBeInTheDocument();
    expect(screen.getByText(/Study Time Distribution|がくしゅう じかん ぶんぷ/)).toBeInTheDocument();
    expect(screen.getByText(/Progress by Category|カテゴリー べつ しんちょく/)).toBeInTheDocument();
  });

  it('displays category progress correctly', () => {
    render(
      <TestWrapper>
        <LearningStats
          weeklyData={mockWeeklyData}
          categoryProgress={mockCategoryProgress}
          timeDistribution={mockTimeDistribution}
        />
      </TestWrapper>,
    );

    // Check if progress bars are rendered
    expect(screen.getByText('8 / 15')).toBeInTheDocument(); // spelling
    expect(screen.getByText('12 / 18')).toBeInTheDocument(); // vocabulary
    expect(screen.getByText('4 / 6')).toBeInTheDocument(); // stories
    expect(screen.getByText('15 / 20')).toBeInTheDocument(); // sentences
  });

  it('renders charts without errors', () => {
    const { container } = render(
      <TestWrapper>
        <LearningStats
          weeklyData={mockWeeklyData}
          categoryProgress={mockCategoryProgress}
          timeDistribution={mockTimeDistribution}
        />
      </TestWrapper>,
    );

    // Check if chart containers are present
    const chartContainers = container.querySelectorAll('.recharts-responsive-container');
    expect(chartContainers.length).toBeGreaterThan(0);
  });

  it('handles empty data gracefully', () => {
    render(
      <TestWrapper>
        <LearningStats weeklyData={[]} categoryProgress={[]} timeDistribution={[]} />
      </TestWrapper>,
    );

    // Component should render without errors
    expect(screen.getByText(/Weekly Activity|しゅうかん かつどう/)).toBeInTheDocument();
  });

  it('displays Japanese labels when language is Japanese', () => {
    render(
      <TestWrapper>
        <LearningStats
          weeklyData={mockWeeklyData}
          categoryProgress={mockCategoryProgress}
          timeDistribution={mockTimeDistribution}
        />
      </TestWrapper>,
    );

    // In Japanese mode, should show Japanese labels
    const japaneseLabels = screen.getAllByText(/スペル|たんご|おはなし|ぶんしょう/);
    expect(japaneseLabels.length).toBeGreaterThan(0);
  });
});