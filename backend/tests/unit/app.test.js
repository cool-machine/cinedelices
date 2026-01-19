/**
 * App Setup - Unit Tests
 */

import { jest } from '@jest/globals';

describe('App setup', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalDebug405 = process.env.DEBUG_405;

    afterEach(() => {
        process.env.NODE_ENV = originalNodeEnv;
        if (originalDebug405 === undefined) {
            delete process.env.DEBUG_405;
        } else {
            process.env.DEBUG_405 = originalDebug405;
        }
        jest.resetModules();
        jest.restoreAllMocks();
    });

    it('enables trust proxy in production', async () => {
        process.env.NODE_ENV = 'production';
        jest.resetModules();

        const { default: app } = await import('../../src/app.js');

        expect(app.get('trust proxy')).toBe(1);
    });

    it('logs 405 responses when DEBUG_405 is enabled', async () => {
        process.env.DEBUG_405 = 'true';
        process.env.NODE_ENV = 'test';
        jest.resetModules();

        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const { default: app } = await import('../../src/app.js');

        const stack = app.router?.stack || app._router?.stack || [];
        const debugLayer = stack.find((layer) =>
            typeof layer.handle === 'function' && layer.handle.toString().includes('statusCode === 405')
        );

        expect(debugLayer).toBeDefined();

        const reqBase = {
            method: 'POST',
            originalUrl: '/recipes/1/reviews',
            headers: {
                'content-type': 'application/json',
                cookie: 'token=abc'
            }
        };
        const res = {
            statusCode: 405,
            on: (event, handler) => {
                if (event === 'finish') {
                    handler();
                }
            }
        };
        const resNo405 = {
            statusCode: 200,
            on: (event, handler) => {
                if (event === 'finish') {
                    handler();
                }
            }
        };
        const next = jest.fn();

        debugLayer.handle({ ...reqBase, originalMethod: 'POST' }, res, next);
        debugLayer.handle({ ...reqBase }, res, next);
        debugLayer.handle({
            ...reqBase,
            headers: {}
        }, res, next);
        debugLayer.handle({ ...reqBase }, resNo405, next);

        expect(warnSpy).toHaveBeenCalledTimes(3);
        expect(next).toHaveBeenCalledTimes(4);
    });
});
