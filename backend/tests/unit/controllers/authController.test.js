/**
 * Auth Controller - Unit Tests
 */

import { jest } from '@jest/globals';

const userFindOne = jest.fn();
const userCreate = jest.fn();
const argonHash = jest.fn();
const argonVerify = jest.fn();
const generateToken = jest.fn();

jest.unstable_mockModule('../../../src/models/index.js', () => ({
    default: {
        User: {
            findOne: userFindOne,
            create: userCreate
        }
    }
}));

jest.unstable_mockModule('argon2', () => ({
    default: {
        hash: argonHash,
        verify: argonVerify
    }
}));

jest.unstable_mockModule('../../../src/utils/jwt.js', () => ({
    generateToken
}));

let authController;

const buildRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

describe('Auth Controller', () => {
    beforeAll(async () => {
        authController = await import('../../../src/controllers/authController.js');
    });

    beforeEach(() => {
        userFindOne.mockReset();
        userCreate.mockReset();
        argonHash.mockReset();
        argonVerify.mockReset();
        generateToken.mockReset();
    });

    describe('register', () => {
        it('should return 500 on error', async () => {
            userFindOne.mockRejectedValue(new Error('DB error'));

            const req = { body: { username: 'u', email: 'a@a.com', password: 'pass' } };
            const res = buildRes();

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
        });
    });

    describe('login', () => {
        it('should return 500 on error', async () => {
            userFindOne.mockRejectedValue(new Error('DB error'));

            const req = { body: { email: 'a@a.com', password: 'pass' } };
            const res = buildRes();

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
        });
    });
});
