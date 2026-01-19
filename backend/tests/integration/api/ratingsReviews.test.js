/**
 * Ratings and Reviews API Integration Tests
 */

import request from 'supertest';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';
import { generateToken } from '../../../src/utils/jwt.js';
import { cleanDatabase, createTestUser, createTestRecipe } from '../../helpers/database.js';

const { User, Recipe, Rating, Review } = db;

describe('Ratings and Reviews API', () => {
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

    describe('POST /api/v1/recipes/:id/rate', () => {
        it('should create a rating', async () => {
            const res = await request(app)
                .post(`/api/v1/recipes/${testRecipe.id}/rate`)
                .set('Cookie', authCookie)
                .send({ score: 5 });

            expect([200, 201]).toContain(res.statusCode);
            expect(res.body).toHaveProperty('score', 5);

            const rating = await Rating.findOne({ where: { user_id: testUser.id, recipe_id: testRecipe.id } });
            expect(rating).not.toBeNull();
            expect(rating.stars).toBe(5);
        });

        it('should update existing rating', async () => {
            await Rating.create({ user_id: testUser.id, recipe_id: testRecipe.id, stars: 3 });

            const res = await request(app)
                .post(`/api/v1/recipes/${testRecipe.id}/rate`)
                .set('Cookie', authCookie)
                .send({ score: 5 });

            expect(res.statusCode).toEqual(200);

            const rating = await Rating.findOne({ where: { user_id: testUser.id, recipe_id: testRecipe.id } });
            expect(rating.stars).toBe(5);
        });

        it('should require authentication', async () => {
            const res = await request(app)
                .post(`/api/v1/recipes/${testRecipe.id}/rate`)
                .send({ score: 5 });

            expect(res.statusCode).toEqual(401);
        });
    });

    describe('POST /api/v1/recipes/:id/reviews', () => {
        it('should create a review', async () => {
            const res = await request(app)
                .post(`/api/v1/recipes/${testRecipe.id}/reviews`)
                .set('Cookie', authCookie)
                .send({ content: 'This is a great recipe! Loved it.' });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('content', 'This is a great recipe! Loved it.');

            const review = await Review.findOne({ where: { user_id: testUser.id, recipe_id: testRecipe.id } });
            expect(review).not.toBeNull();
        });

        it('should require authentication', async () => {
            const res = await request(app)
                .post(`/api/v1/recipes/${testRecipe.id}/reviews`)
                .send({ content: 'Unauthenticated review' });

            expect(res.statusCode).toEqual(401);
        });
    });

    describe('GET /api/v1/recipes/:id/reviews', () => {
        it('should return reviews for a recipe', async () => {
            await Review.create({ user_id: testUser.id, recipe_id: testRecipe.id, content: 'Amazing dish!' });

            const res = await request(app)
                .get(`/api/v1/recipes/${testRecipe.id}/reviews`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0].content).toBe('Amazing dish!');
        });
    });
});
