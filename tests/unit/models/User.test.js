/**
 * User Model - Unit Tests
 * Following TDD: These tests define the expected behavior
 */

import { jest } from '@jest/globals';

// Mock argon2 for password tests
jest.unstable_mockModule('argon2', () => ({
    hash: jest.fn().mockResolvedValue('$argon2id$hashed_password'),
    verify: jest.fn().mockResolvedValue(true)
}));

describe('User Model', () => {
    let sequelize;
    let User;

    beforeAll(async () => {
        // Dynamic import after mocking
        const db = await import('../../../src/models/index.js');
        sequelize = db.default.sequelize;
        User = db.default.User;

        // Sync database for tests
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        // Clean up test data
        await User.destroy({ where: {}, truncate: true, cascade: true });
    });

    describe('Model Definition', () => {
        it('should have correct table name', () => {
            expect(User.tableName).toBe('users');
        });

        it('should have required fields', () => {
            const attributes = User.rawAttributes;
            expect(attributes).toHaveProperty('id');
            expect(attributes).toHaveProperty('email');
            expect(attributes).toHaveProperty('password_hash');
            expect(attributes).toHaveProperty('username');
            expect(attributes).toHaveProperty('role');
            expect(attributes).toHaveProperty('created_at');
            expect(attributes).toHaveProperty('updated_at');
        });
    });

    describe('Validations', () => {
        it('should require email', async () => {
            await expect(User.create({
                password_hash: 'hash',
                username: 'testuser'
            })).rejects.toThrow();
        });

        it('should require valid email format', async () => {
            await expect(User.create({
                email: 'invalid-email',
                password_hash: 'hash',
                username: 'testuser'
            })).rejects.toThrow();
        });

        it('should require unique email', async () => {
            await User.create({
                email: 'test@test.com',
                password_hash: 'hash',
                username: 'user1'
            });

            await expect(User.create({
                email: 'test@test.com',
                password_hash: 'hash',
                username: 'user2'
            })).rejects.toThrow();
        });

        it('should require username', async () => {
            await expect(User.create({
                email: 'test@test.com',
                password_hash: 'hash'
            })).rejects.toThrow();
        });

        it('should require unique username', async () => {
            await User.create({
                email: 'test1@test.com',
                password_hash: 'hash',
                username: 'sameuser'
            });

            await expect(User.create({
                email: 'test2@test.com',
                password_hash: 'hash',
                username: 'sameuser'
            })).rejects.toThrow();
        });

        it('should require username between 3 and 100 characters', async () => {
            await expect(User.create({
                email: 'test@test.com',
                password_hash: 'hash',
                username: 'ab' // Too short
            })).rejects.toThrow();
        });
    });

    describe('Default Values', () => {
        it('should default role to "user"', async () => {
            const user = await User.create({
                email: 'test@test.com',
                password_hash: 'hash',
                username: 'testuser'
            });
            expect(user.role).toBe('user');
        });

        it('should auto-generate timestamps', async () => {
            const user = await User.create({
                email: 'test@test.com',
                password_hash: 'hash',
                username: 'testuser'
            });
            expect(user.created_at).toBeDefined();
            expect(user.updated_at).toBeDefined();
        });
    });

    describe('Instance Methods', () => {
        it('isAdmin() should return true for admin role', async () => {
            const admin = await User.create({
                email: 'admin@test.com',
                password_hash: 'hash',
                username: 'adminuser',
                role: 'admin'
            });
            expect(admin.isAdmin()).toBe(true);
        });

        it('isAdmin() should return false for user role', async () => {
            const user = await User.create({
                email: 'user@test.com',
                password_hash: 'hash',
                username: 'regularuser',
                role: 'user'
            });
            expect(user.isAdmin()).toBe(false);
        });
    });

    describe('CRUD Operations', () => {
        it('should create a user', async () => {
            const user = await User.create({
                email: 'new@test.com',
                password_hash: 'hash',
                username: 'newuser'
            });
            expect(user.id).toBeDefined();
            expect(user.email).toBe('new@test.com');
        });

        it('should read a user by email', async () => {
            await User.create({
                email: 'find@test.com',
                password_hash: 'hash',
                username: 'finduser'
            });

            const found = await User.findOne({ where: { email: 'find@test.com' } });
            expect(found).not.toBeNull();
            expect(found.username).toBe('finduser');
        });

        it('should update a user', async () => {
            const user = await User.create({
                email: 'update@test.com',
                password_hash: 'hash',
                username: 'updateuser'
            });

            await user.update({ username: 'updatedname' });
            expect(user.username).toBe('updatedname');
        });

        it('should delete a user', async () => {
            const user = await User.create({
                email: 'delete@test.com',
                password_hash: 'hash',
                username: 'deleteuser'
            });

            await user.destroy();
            const found = await User.findByPk(user.id);
            expect(found).toBeNull();
        });
    });
});
