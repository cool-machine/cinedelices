/**
 * Favorites API Integration Tests
 */

import request from 'supertest';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';
import { generateToken } from '../../../src/utils/jwt.js';
import { cleanDatabase, createTestUser, createTestRecipe } from '../../helpers/database.js';

const { User, Recipe, Favorite } = db;

describe('Favorites API', () => {
    let testUser, testRecipe, authCookie;

    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    beforeEach(async () => {
        await cleanDatabase(db.sequelize);
        testUser = await createTestUser(User);
        testRecipe = await createTestRecipe(Recipe, { user_id: testUser.id, title: 'Test Recipe' });

        const token = generateToken({ id: testUser.id, email: testUser.email, role: testUser.role });
        authCookie = [`token=${token}`];
    });

    describe('POST /api/v1/recipes/:id/favorite', () => {
        it('should add recipe to favorites when not favorited', async () => {
            const res = await request(app)
                .post(`/api/v1/recipes/${testRecipe.id}/favorite`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('favorited', true);

            const favorite = await Favorite.findOne({ 
                where: { user_id: testUser.id, recipe_id: testRecipe.id } 
            });
            expect(favorite).not.toBeNull();
        });

        it('should remove recipe from favorites when already favorited', async () => {
            await Favorite.create({ user_id: testUser.id, recipe_id: testRecipe.id });

            const res = await request(app)
                .post(`/api/v1/recipes/${testRecipe.id}/favorite`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('favorited', false);

            const favorite = await Favorite.findOne({ 
                where: { user_id: testUser.id, recipe_id: testRecipe.id } 
            });
            expect(favorite).toBeNull();
        });

        it('should require authentication', async () => {
            const res = await request(app)
                .post(`/api/v1/recipes/${testRecipe.id}/favorite`);

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message');
        });

        it('should return 404 for non-existent recipe', async () => {
            const res = await request(app)
                .post('/api/v1/recipes/99999/favorite')
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(404);
        });
    });

    describe('GET /api/v1/favorites', () => {
        it('should return user favorites as JSON', async () => {
            await Favorite.create({ user_id: testUser.id, recipe_id: testRecipe.id });

            const res = await request(app)
                .get('/api/v1/favorites')
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
        });

        it('should return empty array when no favorites', async () => {
            const res = await request(app)
                .get('/api/v1/favorites')
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(0);
        });

        it('should require authentication', async () => {
            const res = await request(app)
                .get('/api/v1/favorites');

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message');
        });
    });
});
