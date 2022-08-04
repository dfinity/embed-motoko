import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders as expected', () => {
    render(<App />);
    expect(
      screen.getByText(/Embed a custom Motoko code snippet/i),
    ).toBeInTheDocument();
  });
});
