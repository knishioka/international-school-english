import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { GameCard } from '../GameCard';

describe('GameCard', () => {
  const defaultProps = {
    title: 'Alphabet',
    icon: '🔤',
    color: 'bg-primary-100',
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('正しく表示される', () => {
    render(<GameCard {...defaultProps} />);

    expect(screen.getByText('Alphabet')).toBeInTheDocument();
    expect(screen.getByText('🔤')).toBeInTheDocument();
  });

  it('クリックイベントが発火する', () => {
    render(<GameCard {...defaultProps} />);

    const button = screen.getByRole('button', { name: 'Play Alphabet game' });
    fireEvent.click(button);

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('正しいCSSクラスが適用される', () => {
    render(<GameCard {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('game-card', 'bg-primary-100');
  });

  it('アクセシビリティ要件を満たす', async () => {
    const { container } = render(<GameCard {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('適切なaria-labelを持つ', () => {
    render(<GameCard {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Play Alphabet game');
  });
});
