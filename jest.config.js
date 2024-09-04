module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/?(*.)+(spec|test).ts'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.test.json',
      },
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  };
  