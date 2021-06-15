import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders react logo text', () => {
  render(<App />);
  const logoTextElement = screen.getByText(/Notes/i);
  expect(logoTextElement).toBeInTheDocument();
});
