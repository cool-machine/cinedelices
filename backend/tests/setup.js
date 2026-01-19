/**
 * Global test setup
 * Runs before all tests
 */

import 'dotenv/config';
import { jest } from '@jest/globals';

// Set test environment
process.env.NODE_ENV = 'test';

// Use test database URL if available
if (!process.env.DATABASE_URL_TEST) {
    process.env.DATABASE_URL = process.env.DATABASE_URL?.replace('cinedelices', 'cinedelices_test')
        || 'postgres://user:password@localhost:5433/cinedelices_test';
}

// Increase timeout for database operations
jest.setTimeout(30000);

// Global beforeAll - runs once before all test files
globalThis.beforeAll(async () => {
    console.log('🧪 Starting tests...');
    await import('../src/config/config.js');
});

// Global afterAll - runs once after all test files
globalThis.afterAll(async () => {
    console.log('✅ Tests completed');
});
