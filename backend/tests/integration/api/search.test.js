/**
 * Recipes API Integration Tests
 * Tests for listing recipes with included relations
 */

import request from 'supertest';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';
import { cleanDatabase, createTestUser, createTestRecipe, createTestMedia, createTestCategory } from '../../helpers/database.js';

const { Recipe, User, Category, Media } = db;

describe('Recipes List API', () => {
    let testUser, testMedia, testCategory;

    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    beforeEach(async () => {
        await cleanDatabase(db.sequelize);
        testUser = await createTestUser(User);
        testMedia = await createTestMedia(Media);
        testCategory = await createTestCategory(Category);
    });

    describe('GET /api/v1/recipes', () => {
        it('should return all recipes as JSON array', async () => {
            await createTestRecipe(Recipe, {
                user_id: testUser.id,
                title: 'Ratatouille du Chef',
                media_id: testMedia.id
            });
            await createTestRecipe(Recipe, {
                user_id: testUser.id,
                title: 'Burger Pulp Fiction',
                media_id: testMedia.id
            });

            const res = await request(app).get('/api/v1/recipes');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
        });

        it('should include author, category, and media relations', async () => {
            await createTestRecipe(Recipe, {
                user_id: testUser.id,
                title: 'Test Recipe',
                category_id: testCategory.id,
                media_id: testMedia.id
            });

            const res = await request(app).get('/api/v1/recipes');
            expect(res.statusCode).toEqual(200);
            expect(res.body[0]).toHaveProperty('author');
            expect(res.body[0]).toHaveProperty('category');
            expect(res.body[0]).toHaveProperty('media');
        });

        it('should return empty array when no recipes exist', async () => {
            const res = await request(app).get('/api/v1/recipes');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(0);
        });
    });
});
