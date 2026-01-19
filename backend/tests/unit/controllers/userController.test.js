/**
 * User Controller - Unit Tests
 */

import { jest } from '@jest/globals';

const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    bio: 'Test bio',
    avatar_url: null,
    toJSON: function() { return { ...this, toJSON: undefined }; },
    update: jest.fn()
};

const userFindByPk = jest.fn();
const userFindAll = jest.fn();
const userDestroy = jest.fn();
const argon2Hash = jest.fn();

jest.unstable_mockModule('../../../src/models/index.js', () => ({
    default: {
        User: {
            findByPk: userFindByPk,
            findAll: userFindAll
        },
        Recipe: {}
    }
}));

jest.unstable_mockModule('argon2', () => ({
    default: {
        hash: argon2Hash
    }
}));

let userController;

const buildRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn()
});

describe('User Controller', () => {
    beforeAll(async () => {
        userController = await import('../../../src/controllers/userController.js');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserById', () => {
        it('should return user when found', async () => {
            userFindByPk.mockResolvedValue(mockUser);

            const req = { params: { id: 1 } };
            const res = buildRes();

            await userController.getUserById(req, res);

            expect(userFindByPk).toHaveBeenCalledWith(1, expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it('should return 404 when user not found', async () => {
            userFindByPk.mockResolvedValue(null);

            const req = { params: { id: 999 } };
            const res = buildRes();

            await userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should return 500 on error', async () => {
            userFindByPk.mockRejectedValue(new Error('DB error'));

            const req = { params: { id: 1 } };
            const res = buildRes();

            await userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
        });
    });

    describe('updateUser', () => {
        it('should update user when authorized', async () => {
            const user = { ...mockUser, update: jest.fn().mockResolvedValue(true) };
            userFindByPk.mockResolvedValue(user);

            const req = {
                params: { id: 1 },
                user: { id: 1, role: 'user' },
                body: { username: 'newname', bio: 'new bio' }
            };
            const res = buildRes();

            await userController.updateUser(req, res);

            expect(user.update).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 403 when not authorized', async () => {
            userFindByPk.mockResolvedValue(mockUser);

            const req = {
                params: { id: 1 },
                user: { id: 2, role: 'user' },
                body: { username: 'newname' }
            };
            const res = buildRes();

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized' });
        });

        it('should allow admin to update any user', async () => {
            const user = { ...mockUser, update: jest.fn().mockResolvedValue(true) };
            userFindByPk.mockResolvedValue(user);

            const req = {
                params: { id: 1 },
                user: { id: 99, role: 'admin' },
                body: { username: 'adminupdate' }
            };
            const res = buildRes();

            await userController.updateUser(req, res);

            expect(user.update).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 when user not found', async () => {
            userFindByPk.mockResolvedValue(null);

            const req = {
                params: { id: 999 },
                user: { id: 999, role: 'user' },
                body: {}
            };
            const res = buildRes();

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const users = [mockUser, { ...mockUser, id: 2 }];
            userFindAll.mockResolvedValue(users);

            const req = {};
            const res = buildRes();

            await userController.getAllUsers(req, res);

            expect(userFindAll).toHaveBeenCalledWith({
                attributes: { exclude: ['password_hash'] }
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(users);
        });

        it('should return 500 on error', async () => {
            userFindAll.mockRejectedValue(new Error('DB error'));

            const req = {};
            const res = buildRes();

            await userController.getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('deleteUser', () => {
        it('should delete user when found', async () => {
            const user = { ...mockUser, destroy: jest.fn().mockResolvedValue(true) };
            userFindByPk.mockResolvedValue(user);

            const req = { params: { id: 1 } };
            const res = buildRes();

            await userController.deleteUser(req, res);

            expect(user.destroy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should return 404 when user not found', async () => {
            userFindByPk.mockResolvedValue(null);

            const req = { params: { id: 999 } };
            const res = buildRes();

            await userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
