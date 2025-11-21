module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/index.ts',
    '!src/server.ts',
    '!src/**/*.d.ts'
  ],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleNameMapping: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  preset: 'ts-jest',
};
