/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // werkt met jouw tsconfig "paths"
  },
  testMatch: ['**/__tests__/**/*.(ts|tsx)', '**/?(*.)+(spec|test).(ts|tsx)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // optioneel, zie hieronder
};
