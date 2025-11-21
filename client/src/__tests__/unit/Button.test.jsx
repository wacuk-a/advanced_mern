import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple Button component for testing
const Button = ({ onClick, children, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

// Tests
describe('Button Component', () => {
  test('renders button with correct text', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const buttonElement = screen.getByText(/click me/i);
    fireEvent.click(buttonElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled={true}>Click me</Button>);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toBeDisabled();
  });
});
