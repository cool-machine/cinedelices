/** @type {import('jest').Config} */
export default {
    // Use ES Modules
    transform: {},

    // Test environment
    testEnvironment: 'node',

    // File extensions
    moduleFileExtensions: ['js', 'mjs', 'cjs', 'json'],

    // Test file patterns
    testMatch: [
        '**/tests/**/*.test.js',
        '**/tests/**/*.spec.js'
    ],

    // Ignore patterns
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/'
    ],

    // Coverage configuration
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/config/*.cjs',
        '!src/migrations/**',
        '!src/seeders/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'clover'],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 60,
            lines: 60,
            statements: 60
        }
    },

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

    // Verbose output
    verbose: true,

    // Force exit after tests
    forceExit: true,

    // Detect open handles
    detectOpenHandles: true,

    // Timeout for async tests
    testTimeout: 30000
};
