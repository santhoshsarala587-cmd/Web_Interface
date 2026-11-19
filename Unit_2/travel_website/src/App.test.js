import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home hero, three passions and wishlist-ready destination cards', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/curiosity, adventure/i);
  expect(screen.getByRole('link', { name: /discover my story/i })).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /journeys/i }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole('button', { name: /to wishlist/i }).length).toBeGreaterThan(0);
  expect(screen.getByRole('button', { name: /dark theme/i })).toBeInTheDocument();
});
