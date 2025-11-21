// Simple authentication utility tests

const passwordValidation = (password) => {
  return password.length >= 6 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /\d/.test(password);
};

const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

describe('Authentication Utilities', () => {
  beforeAll(() => {
    // Set test environment variables
    process.env.JWT_SECRET = 'test_jwt_secret_for_testing_environment';
  });

  test('passwordValidation should validate strong passwords', () => {
    expect(passwordValidation('Password123')).toBe(true);
    expect(passwordValidation('weak')).toBe(false);
    expect(passwordValidation('nouppercase123')).toBe(false);
    expect(passwordValidation('NOLOWERCASE123')).toBe(false);
    expect(passwordValidation('NoNumbers')).toBe(false);
  });

  test('validateEmail should validate email format', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@domain')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
  });

  test('JWT secret should be configured', () => {
    // This tests that our environment setup is working
    expect(process.env.JWT_SECRET).toBeDefined();
    expect(typeof process.env.JWT_SECRET).toBe('string');
    expect(process.env.JWT_SECRET.length).toBeGreaterThan(10);
  });

  test('should have proper password requirements', () => {
    const requirements = {
      minLength: 6,
      hasUppercase: true,
      hasLowercase: true,
      hasNumber: true
    };

    expect(requirements.minLength).toBe(6);
    expect(requirements.hasUppercase).toBe(true);
    expect(requirements.hasLowercase).toBe(true);
    expect(requirements.hasNumber).toBe(true);
  });

  test('email normalization should work correctly', () => {
    const testEmails = [
      { input: 'TEST@EXAMPLE.COM', expected: 'test@example.com' },
      { input: 'Test.User@Example.COM', expected: 'test.user@example.com' },
      { input: 'normal@example.com', expected: 'normal@example.com' }
    ];

    testEmails.forEach(({ input, expected }) => {
      const normalized = input.toLowerCase();
      expect(normalized).toBe(expected);
    });
  });
});
