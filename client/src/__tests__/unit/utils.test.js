import { describe, test, expect } from 'vitest';

// Example unit test for utility functions

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Tests
describe('Utility Functions', () => {
  test('formatDate should format date correctly', () => {
    const date = '2023-12-25';
    const formatted = formatDate(date);
    expect(formatted).toMatch(/\w+ \d{1,2}, \d{4}/);
  });

  test('capitalizeFirst should capitalize first letter', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
    expect(capitalizeFirst('world')).toBe('World');
    expect(capitalizeFirst('')).toBe('');
  });
});
