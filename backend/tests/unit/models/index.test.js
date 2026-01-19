/**
 * Models Index - Unit Tests
 */

import { jest } from '@jest/globals';
import path from 'path';
import { fileURLToPath } from 'url';

const sequelizeConstructor = jest.fn();
const SequelizeMock = jest.fn().mockImplementation((...args) => {
    sequelizeConstructor(...args);
    return { define: jest.fn() };
});

const readdirSync = jest.fn().mockReturnValue([]);

let configMock = {
    test: {
        database: 'db',
        username: 'user',
        password: 'pass',
        dialect: 'postgres'
    },
    development: {
        url: 'postgres://dev',
        dialect: 'postgres'
    }
};

jest.unstable_mockModule('sequelize', () => ({
    Sequelize: SequelizeMock,
    DataTypes: {}
}));

jest.unstable_mockModule('fs', () => ({
    readdirSync
}));

jest.unstable_mockModule('../../../src/config/config.js', () => ({
    default: configMock
}));

describe('Models index', () => {
    const originalEnv = process.env.NODE_ENV;

    afterAll(() => {
        process.env.NODE_ENV = originalEnv;
    });

    beforeEach(() => {
        jest.resetModules();
        sequelizeConstructor.mockClear();
        SequelizeMock.mockClear();
        readdirSync.mockClear();
    });

    it('should use database credentials when url is not provided', async () => {
        process.env.NODE_ENV = 'test';
        configMock = {
            test: {
                database: 'db',
                username: 'user',
                password: 'pass',
                dialect: 'postgres'
            }
        };
        readdirSync.mockReturnValue([]);

        const dbModule = await import('../../../src/models/index.js');

        expect(SequelizeMock).toHaveBeenCalledWith(
            'db',
            'user',
            'pass',
            expect.objectContaining({
                database: 'db',
                username: 'user',
                password: 'pass',
                dialect: 'postgres'
            })
        );
        expect(readdirSync).toHaveBeenCalled();
        expect(dbModule.default.sequelize).toBeDefined();
    });

    it('should use url config when provided', async () => {
        process.env.NODE_ENV = 'test';
        configMock = {
            test: {
                url: 'postgres://test',
                dialect: 'postgres'
            }
        };
        readdirSync.mockReturnValue([]);

        const dbModule = await import('../../../src/models/index.js');

        expect(SequelizeMock).toHaveBeenCalledWith(
            'postgres://test',
            expect.objectContaining({
                url: 'postgres://test',
                dialect: 'postgres'
            })
        );
        expect(readdirSync).toHaveBeenCalled();
        expect(dbModule.default.sequelize).toBeDefined();
    });

    it('should default to development env and call associate', async () => {
        process.env.NODE_ENV = '';
        configMock = {
            development: {
                url: 'postgres://dev',
                dialect: 'postgres'
            }
        };

        const modelsDir = path.dirname(
            fileURLToPath(new URL('../../../src/models/index.js', import.meta.url))
        );
        const modelPath = path.join(modelsDir, 'User.js');
        const associate = jest.fn();
        const modelFactory = jest.fn(() => ({ name: 'User', associate }));

        jest.unstable_mockModule(modelPath, () => ({
            default: modelFactory
        }));
        readdirSync.mockReturnValue(['User.js']);

        const dbModule = await import('../../../src/models/index.js');

        expect(SequelizeMock).toHaveBeenCalledWith(
            'postgres://dev',
            expect.objectContaining({
                url: 'postgres://dev',
                dialect: 'postgres'
            })
        );
        expect(modelFactory).toHaveBeenCalled();
        expect(associate).toHaveBeenCalledWith(dbModule.default);
    });

    it('should skip associate when not defined', async () => {
        process.env.NODE_ENV = 'test';
        configMock = {
            test: {
                url: 'postgres://test',
                dialect: 'postgres'
            }
        };

        const modelsDir = path.dirname(
            fileURLToPath(new URL('../../../src/models/index.js', import.meta.url))
        );
        const modelPath = path.join(modelsDir, 'User.js');
        const modelFactory = jest.fn(() => ({ name: 'User' }));

        jest.unstable_mockModule(modelPath, () => ({
            default: modelFactory
        }));
        readdirSync.mockReturnValue(['User.js']);

        await import('../../../src/models/index.js');

        expect(modelFactory).toHaveBeenCalled();
    });
});
