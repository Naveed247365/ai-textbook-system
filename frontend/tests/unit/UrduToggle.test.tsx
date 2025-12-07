import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UrduToggle from '../../src/components/UrduToggle';

describe('UrduToggle', () => {
  test('renders with "Switch to Urdu" initially', () => {
    render(<UrduToggle />);
    expect(screen.getByText('Switch to Urdu')).toBeInTheDocument();
  });

  test('switches to "Switch to English" on click', () => {
    render(<UrduToggle />);
    const toggleButton = screen.getByText('Switch to Urdu');
    fireEvent.click(toggleButton);
    expect(screen.getByText('Switch to English')).toBeInTheDocument();
  });

  test('toggles back to "Switch to Urdu" on second click', () => {
    render(<UrduToggle />);
    const toggleButton = screen.getByText('Switch to Urdu');
    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);
    expect(screen.getByText('Switch to Urdu')).toBeInTheDocument();
  });
});
