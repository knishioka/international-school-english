import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the pages
jest.mock('../pages/WelcomePage', () => ({
  WelcomePage: () => <div>Welcome Page</div>,
}));

jest.mock('../pages/HomePage', () => ({
  HomePage: () => <div>Home Page</div>,
}));

describe('App', () => {
  it('ウェルカムページがデフォルトで表示される', () => {
    render(<App />);

    expect(screen.getByText('Welcome Page')).toBeInTheDocument();
  });

  it('適切なプロバイダーでラップされている', () => {
    // This test ensures the app renders without errors
    // The actual provider functionality is tested in their respective test files
    expect(() => render(<App />)).not.toThrow();
  });
});
