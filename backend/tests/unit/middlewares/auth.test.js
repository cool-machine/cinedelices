/**
 * Auth Middleware - Unit Tests
 */

import { jest } from '@jest/globals';

const verifyToken = jest.fn();
const recipeFindByPk = jest.fn();

jest.unstable_mockModule('../../../src/utils/jwt.js', () => ({
    verifyToken
}));

jest.unstable_mockModule('../../../src/models/index.js', () => ({
    default: {
        Recipe: {
            findByPk: recipeFindByPk
        }
    }
}));

let authMiddleware;

const buildRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

describe('Auth Middleware', () => {
    beforeAll(async () => {
        authMiddleware = await import('../../../src/middlewares/auth.js');
    });

    beforeEach(() => {
        verifyToken.mockReset();
        recipeFindByPk.mockReset();
    });

    describe('isAuthenticated', () => {
        it('should return 401 for requests without token', () => {
            const req = { headers: {}, cookies: {} };
            const res = buildRes();
            const next = jest.fn();

            authMiddleware.isAuthenticated(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Authentication required' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should accept Bearer token and set req.user', () => {
            verifyToken.mockReturnValue({ id: 1, role: 'user' });

            const req = {
                headers: { authorization: 'Bearer token' },
                cookies: {}
            };
            const res = buildRes();
            const next = jest.fn();

            authMiddleware.isAuthenticated(req, res, next);

            expect(verifyToken).toHaveBeenCalledWith('token');
            expect(req.user).toEqual({ id: 1, role: 'user' });
            expect(next).toHaveBeenCalled();
        });

        it('should accept cookie token and set req.user', () => {
            verifyToken.mockReturnValue({ id: 2, role: 'user' });

            const req = {
                headers: {},
                cookies: { token: 'cookie-token' }
            };
            const res = buildRes();
            const next = jest.fn();

            authMiddleware.isAuthenticated(req, res, next);

            expect(verifyToken).toHaveBeenCalledWith('cookie-token');
            expect(req.user).toEqual({ id: 2, role: 'user' });
            expect(next).toHaveBeenCalled();
        });

        it('should return 401 for requests with invalid token', () => {
            verifyToken.mockImplementation(() => {
                throw new Error('invalid');
            });

            const req = {
                headers: { authorization: 'Bearer bad-token' },
                cookies: {}
            };
            const res = buildRes();
            const next = jest.fn();

            authMiddleware.isAuthenticated(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('isAdmin', () => {
        it('should return 403 for non-admin users', () => {
            const req = { user: { role: 'user' } };
            const res = buildRes();
            const next = jest.fn();

            authMiddleware.isAdmin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Admin access required' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should allow admin users', () => {
            const req = { user: { role: 'admin' } };
            const res = buildRes();
            const next = jest.fn();

            authMiddleware.isAdmin(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('isRecipeAuthor', () => {
        it('should return 404 when recipe not found', async () => {
            recipeFindByPk.mockResolvedValue(null);

            const req = {
                params: { id: 1 },
                user: { id: 1, role: 'user' }
            };
            const res = buildRes();
            const next = jest.fn();

            await authMiddleware.isRecipeAuthor(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Recipe not found' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 403 when user is not author', async () => {
            recipeFindByPk.mockResolvedValue({ id: 1, user_id: 2 });

            const req = {
                params: { id: 1 },
                user: { id: 1, role: 'user' }
            };
            const res = buildRes();
            const next = jest.fn();

            await authMiddleware.isRecipeAuthor(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should allow recipe author', async () => {
            const recipe = { id: 1, user_id: 1 };
            recipeFindByPk.mockResolvedValue(recipe);

            const req = {
                params: { id: 1 },
                user: { id: 1, role: 'user' }
            };
            const res = buildRes();
            const next = jest.fn();

            await authMiddleware.isRecipeAuthor(req, res, next);

            expect(req.recipe).toBe(recipe);
            expect(next).toHaveBeenCalled();
        });

        it('should allow admin to access any recipe', async () => {
            const recipe = { id: 1, user_id: 2 };
            recipeFindByPk.mockResolvedValue(recipe);

            const req = {
                params: { id: 1 },
                user: { id: 1, role: 'admin' }
            };
            const res = buildRes();
            const next = jest.fn();

            await authMiddleware.isRecipeAuthor(req, res, next);

            expect(req.recipe).toBe(recipe);
            expect(next).toHaveBeenCalled();
        });

        it('should return 500 on database errors', async () => {
            recipeFindByPk.mockRejectedValue(new Error('DB error'));

            const req = {
                params: { id: 1 },
                user: { id: 1, role: 'user' }
            };
            const res = buildRes();
            const next = jest.fn();

            await authMiddleware.isRecipeAuthor(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
            expect(next).not.toHaveBeenCalled();
        });
    });
});
