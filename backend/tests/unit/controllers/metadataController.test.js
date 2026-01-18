/**
 * Metadata Controller - Unit Tests
 */

import { jest } from '@jest/globals';

const findAllCategories = jest.fn();
const findAllMedia = jest.fn();

jest.unstable_mockModule('../../../src/models/index.js', () => ({
    default: {
        Category: { findAll: findAllCategories },
        Media: { findAll: findAllMedia }
    }
}));

let getAllCategories;
let getAllMedia;

describe('Metadata Controller', () => {
    beforeAll(async () => {
        const controller = await import('../../../src/controllers/metadataController.js');
        getAllCategories = controller.getAllCategories;
        getAllMedia = controller.getAllMedia;
    });

    beforeEach(() => {
        findAllCategories.mockReset();
        findAllMedia.mockReset();
    });

    describe('getAllCategories', () => {
        it('should return categories with 200', async () => {
            const categories = [{ id: 1, name: 'Desserts' }];
            findAllCategories.mockResolvedValue(categories);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getAllCategories(req, res);

            expect(findAllCategories).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(categories);
        });

        it('should return 500 on error', async () => {
            const error = new Error('DB error');
            findAllCategories.mockRejectedValue(error);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getAllCategories(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getAllMedia', () => {
        it('should return media with 200', async () => {
            const media = [{ id: 1, title: 'Inception' }];
            findAllMedia.mockResolvedValue(media);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getAllMedia(req, res);

            expect(findAllMedia).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(media);
        });

        it('should return 500 on error', async () => {
            const error = new Error('DB error');
            findAllMedia.mockRejectedValue(error);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getAllMedia(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});
