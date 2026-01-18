/**
 * Test Database Helpers
 * Utilities for setting up and tearing down test database
 */

import { Sequelize } from 'sequelize';
import config from '../../src/config/config.js';

const testConfig = config.test;

/**
 * Create a fresh Sequelize instance for testing
 */
export const createTestSequelize = () => {
    return new Sequelize(testConfig.url, {
        ...testConfig,
        logging: false
    });
};

/**
 * Sync database (create tables)
 * @param {Sequelize} sequelize 
 * @param {boolean} force - If true, drops existing tables
 */
export const syncDatabase = async (sequelize, force = true) => {
    await sequelize.sync({ force });
};

/**
 * Clean all tables (truncate)
 * @param {Sequelize} sequelize 
 */
export const cleanDatabase = async (sequelize) => {
    const models = sequelize.models;

    // Disable foreign key checks temporarily
    await sequelize.query('SET CONSTRAINTS ALL DEFERRED');

    for (const modelName of Object.keys(models)) {
        await models[modelName].destroy({
            where: {},
            truncate: true,
            cascade: true,
            restartIdentity: true
        });
    }
};

/**
 * Close database connection
 * @param {Sequelize} sequelize 
 */
export const closeDatabase = async (sequelize) => {
    await sequelize.close();
};

/**
 * Create test user helper
 * @param {Object} overrides 
 */
export const createTestUser = async (User, overrides = {}) => {
    const argon2 = await import('argon2');
    const defaultPassword = await argon2.hash('testpassword123');

    return User.create({
        email: `test${Date.now()}@test.com`,
        password_hash: defaultPassword,
        username: `testuser${Date.now()}`,
        role: 'user',
        ...overrides
    });
};

/**
 * Create test category helper
 */
export const createTestCategory = async (Category, overrides = {}) => {
    return Category.create({
        name: `Test Category ${Date.now()}`,
        description: 'A test category',
        ...overrides
    });
};

/**
 * Create test media helper
 */
export const createTestMedia = async (Media, overrides = {}) => {
    return Media.create({
        title: `Test Film ${Date.now()}`,
        type: 'film',
        release_year: 2024,
        ...overrides
    });
};

/**
 * Create test recipe helper
 */
export const createTestRecipe = async (Recipe, overrides = {}) => {
    return Recipe.create({
        title: `Test Recipe ${Date.now()}`,
        description: 'A test recipe',
        ingredients: '- Ingredient 1\n- Ingredient 2',
        instructions: '1. Step 1\n2. Step 2',
        difficulty: 'facile',
        prep_time: 10,
        cook_time: 20,
        ...overrides
    });
};
