/**
 * Category & Media Routes - Integration Tests
 */

import request from 'supertest';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';

const { Category, Media } = db;

describe('Category & Media Routes', () => {
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });

        // Seed some data
        await Category.create({ name: 'Entrée' });
        await Category.create({ name: 'Plat' });

        await Media.create({ title: 'Film 1', type: 'film' });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    describe('GET /api/v1/categories', () => {
        it('should return all categories', async () => {
            const res = await request(app).get('/api/v1/categories');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(2);
            expect(res.body[0].name).toBe('Entrée');
        });
    });

    describe('GET /api/v1/media', () => {
        it('should return all media items', async () => {
            const res = await request(app).get('/api/v1/media');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].title).toBe('Film 1');
        });
    });
});
