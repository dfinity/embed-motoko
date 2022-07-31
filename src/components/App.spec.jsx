import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders as expected', () => {
    render(<App />);
    expect(screen.getByTitle('Embed Motoko')).toHaveAttribute('src');
    expect(
      screen.getByText(/Embed an interactive Motoko code snippet/i),
    ).toBeInTheDocument();
  });
});
