/**
 * Ratings and Reviews Integration Tests
 */

import request from 'supertest';
import * as cheerio from 'cheerio';
import app from '../../src/app.js';
import db from '../../src/models/index.js';
import { generateToken } from '../../src/utils/jwt.js';
import { cleanDatabase, createTestUser, createTestRecipe } from '../helpers/database.js';

const { User, Recipe, Rating, Review } = db;

describe('Ratings and Reviews', () => {
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

    describe('POST /recipes/:id/rate', () => {
        it('should create a rating and redirect to recipe', async () => {
            const res = await request(app)
                .post(`/recipes/${testRecipe.id}/rate`)
                .set('Cookie', authCookie)
                .send({ stars: 5 });

            expect(res.statusCode).toEqual(302);

            const rating = await Rating.findOne({ where: { user_id: testUser.id, recipe_id: testRecipe.id } });
            expect(rating).not.toBeNull();
            expect(rating.stars).toBe(5);
        });

        it('should update existing rating', async () => {
            await Rating.create({ user_id: testUser.id, recipe_id: testRecipe.id, stars: 3 });

            const res = await request(app)
                .post(`/recipes/${testRecipe.id}/rate`)
                .set('Cookie', authCookie)
                .send({ stars: 5 });

            expect(res.statusCode).toEqual(302);

            const rating = await Rating.findOne({ where: { user_id: testUser.id, recipe_id: testRecipe.id } });
            expect(rating.stars).toBe(5);
        });
    });

    describe('POST /recipes/:id/reviews', () => {
        it('should create a review and redirect to recipe', async () => {
            const res = await request(app)
                .post(`/recipes/${testRecipe.id}/reviews`)
                .set('Cookie', authCookie)
                .send({ content: 'This is a great recipe! Loved it.' });

            expect(res.statusCode).toEqual(302);

            const review = await Review.findOne({ where: { user_id: testUser.id, recipe_id: testRecipe.id } });
            expect(review).not.toBeNull();
            expect(review.content).toBe('This is a great recipe! Loved it.');
        });
    });

    describe('Recipe detail page with ratings/reviews', () => {
        it('should display average rating on recipe page', async () => {
            // Create ratings from different users
            const user2 = await User.create({ username: 'user2', email: 'u2@test.com', password_hash: 'hash' });
            await Rating.create({ user_id: testUser.id, recipe_id: testRecipe.id, stars: 4 });
            await Rating.create({ user_id: user2.id, recipe_id: testRecipe.id, stars: 5 });

            const res = await request(app)
                .get(`/recipes/${testRecipe.id}`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(200);
            const $ = cheerio.load(res.text);
            expect($('.average-rating').length).toBe(1);
        });

        it('should display reviews on recipe page', async () => {
            await Review.create({ user_id: testUser.id, recipe_id: testRecipe.id, content: 'Amazing dish!' });

            const res = await request(app)
                .get(`/recipes/${testRecipe.id}`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(200);
            const $ = cheerio.load(res.text);
            expect($('.reviews-section').length).toBe(1);
        });
    });
});
