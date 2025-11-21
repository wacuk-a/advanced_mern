// Example unit test for server utility functions

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const generateRandomString = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Tests
describe('Server Utility Functions', () => {
  test('validateEmail should validate correct emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@domain')).toBe(false);
  });

  test('generateRandomString should generate string of correct length', () => {
    const result = generateRandomString(10);
    expect(result).toHaveLength(10);
    expect(typeof result).toBe('string');
  });
});

module.exports = { validateEmail, generateRandomString };
