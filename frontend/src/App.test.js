import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the placement system home page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /campus placement management system/i })).toBeInTheDocument();
});
