import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home hero and navigation', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/my world\.\s*my journey\.\s*my passions\./i);
  expect(screen.getAllByRole('link', { name: /dream destinations/i }).length).toBeGreaterThan(0);
});
