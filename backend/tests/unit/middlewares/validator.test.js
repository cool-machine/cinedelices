/**
 * Validator Middleware - Unit Tests
 */

import { jest } from '@jest/globals';

const mockValidationResult = jest.fn();

jest.unstable_mockModule('express-validator', () => ({
    validationResult: mockValidationResult
}));

let validatorMiddleware;

const buildRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

describe('Validator Middleware', () => {
    beforeAll(async () => {
        validatorMiddleware = await import('../../../src/middlewares/validator.js');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('validate', () => {
        it('should call next() when no validation errors', () => {
            mockValidationResult.mockReturnValue({
                isEmpty: () => true,
                array: () => []
            });

            const req = {};
            const res = buildRes();
            const next = jest.fn();

            validatorMiddleware.validate(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should return 400 with errors when validation fails', () => {
            const errors = [
                { field: 'email', message: 'Invalid email' },
                { field: 'password', message: 'Password too short' }
            ];

            mockValidationResult.mockReturnValue({
                isEmpty: () => false,
                array: () => errors
            });

            const req = {};
            const res = buildRes();
            const next = jest.fn();

            validatorMiddleware.validate(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ errors });
        });
    });
});
