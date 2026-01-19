/**
 * JWT Utils - Unit Tests
 */

import { jest } from '@jest/globals';

const sign = jest.fn();
const verify = jest.fn();

jest.unstable_mockModule('jsonwebtoken', () => ({
    default: {
        sign,
        verify
    }
}));

describe('JWT Utils', () => {
    beforeEach(() => {
        sign.mockReset();
        verify.mockReset();
    });

    it('should use fallback secret when SESSION_SECRET is empty', async () => {
        process.env.SESSION_SECRET = '';
        sign.mockReturnValue('token');
        jest.resetModules();

        const { generateToken } = await import('../../../src/utils/jwt.js');
        const token = generateToken({ id: 1, email: 'a@a.com', role: 'user' });

        expect(sign).toHaveBeenCalledWith(
            { id: 1, email: 'a@a.com', role: 'user' },
            'fallback-secret-for-dev',
            { expiresIn: '24h' }
        );
        expect(token).toBe('token');
    });

    it('should use SESSION_SECRET when provided', async () => {
        process.env.SESSION_SECRET = 'test-secret';
        sign.mockReturnValue('token');
        jest.resetModules();

        const { generateToken } = await import('../../../src/utils/jwt.js');
        generateToken({ id: 2, email: 'b@b.com', role: 'admin' });

        expect(sign).toHaveBeenCalledWith(
            { id: 2, email: 'b@b.com', role: 'admin' },
            'test-secret',
            { expiresIn: '24h' }
        );
    });

    it('should verify token with configured secret', async () => {
        process.env.SESSION_SECRET = 'verify-secret';
        verify.mockReturnValue({ id: 3 });
        jest.resetModules();

        const { verifyToken } = await import('../../../src/utils/jwt.js');
        const decoded = verifyToken('token');

        expect(verify).toHaveBeenCalledWith('token', 'verify-secret');
        expect(decoded).toEqual({ id: 3 });
    });
});
