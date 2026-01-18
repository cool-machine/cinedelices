/**
 * Favorites Integration Tests
 */

import request from 'supertest';
import * as cheerio from 'cheerio';
import app from '../../src/app.js';
import db from '../../src/models/index.js';
import { generateToken } from '../../src/utils/jwt.js';
import { cleanDatabase, createTestUser, createTestRecipe } from '../helpers/database.js';

const { User, Recipe, Favorite } = db;

describe('Favorites', () => {
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

    describe('POST /recipes/:id/favorite', () => {
        it('should add recipe to favorites when not favorited', async () => {
            const res = await request(app)
                .post(`/recipes/${testRecipe.id}/favorite`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(302);

            const favorite = await Favorite.findOne({ 
                where: { user_id: testUser.id, recipe_id: testRecipe.id } 
            });
            expect(favorite).not.toBeNull();
        });

        it('should remove recipe from favorites when already favorited', async () => {
            await Favorite.create({ user_id: testUser.id, recipe_id: testRecipe.id });

            const res = await request(app)
                .post(`/recipes/${testRecipe.id}/favorite`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(302);

            const favorite = await Favorite.findOne({ 
                where: { user_id: testUser.id, recipe_id: testRecipe.id } 
            });
            expect(favorite).toBeNull();
        });

        it('should require authentication', async () => {
            const res = await request(app)
                .post(`/recipes/${testRecipe.id}/favorite`);

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toContain('/login');
        });

        it('should return 404 for non-existent recipe', async () => {
            const res = await request(app)
                .post('/recipes/99999/favorite')
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(404);
        });
    });

    describe('GET /favorites', () => {
        it('should display user favorites page', async () => {
            await Favorite.create({ user_id: testUser.id, recipe_id: testRecipe.id });

            const res = await request(app)
                .get('/favorites')
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(200);
            const $ = cheerio.load(res.text);
            expect($('.favorites-page').length).toBe(1);
            expect($('.recipe-card').length).toBe(1);
        });

        it('should show empty state when no favorites', async () => {
            const res = await request(app)
                .get('/favorites')
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(200);
            const $ = cheerio.load(res.text);
            expect($('.no-favorites').length).toBe(1);
        });

        it('should require authentication', async () => {
            const res = await request(app)
                .get('/favorites');

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toContain('/login');
        });
    });

    describe('Recipe detail page with favorite button', () => {
        it('should show favorite button for authenticated user', async () => {
            const res = await request(app)
                .get(`/recipes/${testRecipe.id}`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(200);
            const $ = cheerio.load(res.text);
            expect($('.favorite-btn').length).toBe(1);
        });

        it('should show filled heart when recipe is favorited', async () => {
            await Favorite.create({ user_id: testUser.id, recipe_id: testRecipe.id });

            const res = await request(app)
                .get(`/recipes/${testRecipe.id}`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(200);
            const $ = cheerio.load(res.text);
            expect($('.favorite-btn.is-favorited').length).toBe(1);
        });
    });
});
