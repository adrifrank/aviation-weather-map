module.exports = {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
      },
    ],
  },

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],

  setupFilesAfterEnv: ['<rootDir>/src/jest-setup.ts'],
};
