/**
 * Recipe Routes - Integration Tests
 */

import request from 'supertest';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';
import { cleanDatabase, createTestUser, createTestRecipe } from '../../helpers/database.js';
import { generateToken } from '../../../src/utils/jwt.js';

const { Recipe, User } = db;

describe('Recipe Routes', () => {
    let testUser;
    let authToken;

    beforeAll(async () => {
        // Force sync database to ensure clean state
        await db.sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    beforeEach(async () => {
        await cleanDatabase(db.sequelize);
        testUser = await createTestUser(User);
        authToken = generateToken(testUser);
    });

    describe('GET /api/v1/recipes', () => {
        it('should return an empty array when no recipes exist', async () => {
            const res = await request(app).get('/api/v1/recipes');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(0);
        });

        it('should return all recipes', async () => {
            await createTestRecipe(Recipe, { user_id: testUser.id, title: 'Recipe 1' });
            await createTestRecipe(Recipe, { user_id: testUser.id, title: 'Recipe 2' });

            const res = await request(app).get('/api/v1/recipes');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(2);
        });
    });

    describe('GET /api/v1/recipes/:id', () => {
        it('should return a specific recipe', async () => {
            const recipe = await createTestRecipe(Recipe, { user_id: testUser.id, title: 'Found Me' });
            const res = await request(app).get(`/api/v1/recipes/${recipe.id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toBe('Found Me');
        });

        it('should return 404 if recipe not found', async () => {
            const res = await request(app).get('/api/v1/recipes/999');
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('POST /api/v1/recipes', () => {
        const validRecipe = {
            title: 'New Movie Recipe',
            ingredients: 'Ingredients',
            instructions: 'Instructions',
            difficulty: 'facile'
        };

        it('should create a new recipe', async () => {
            const res = await request(app)
                .post('/api/v1/recipes')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ ...validRecipe, user_id: testUser.id });

            expect(res.statusCode).toEqual(201);
            expect(res.body.title).toBe(validRecipe.title);
        });

        it('should return 401 if no token is provided', async () => {
            const res = await request(app)
                .post('/api/v1/recipes')
                .send({ ...validRecipe, user_id: testUser.id });

            expect(res.statusCode).toEqual(401);
        });

        it('should return 400 if required fields are missing', async () => {
            const res = await request(app)
                .post('/api/v1/recipes')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Missing ingredients' });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('errors');
        });
    });

    describe('PUT /api/v1/recipes/:id', () => {
        it('should update a recipe', async () => {
            const recipe = await createTestRecipe(Recipe, { user_id: testUser.id, title: 'Old Title' });
            const res = await request(app)
                .put(`/api/v1/recipes/${recipe.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'New Improved Title' });

            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toBe('New Improved Title');
        });
        it('should return 401 if no token is provided for update', async () => {
            const recipe = await createTestRecipe(Recipe, { user_id: testUser.id });
            const res = await request(app)
                .put(`/api/v1/recipes/${recipe.id}`)
                .send({ title: 'Unauthorized update' });

            expect(res.statusCode).toEqual(401);
        });

        it('should return 404 if recipe to update not found', async () => {
            const res = await request(app)
                .put('/api/v1/recipes/999')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'New Title' });

            expect(res.statusCode).toEqual(404);
        });
    });

    describe('DELETE /api/v1/recipes/:id', () => {
        it('should delete a recipe', async () => {
            const recipe = await createTestRecipe(Recipe, { user_id: testUser.id });
            const res = await request(app)
                .delete(`/api/v1/recipes/${recipe.id}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.statusCode).toEqual(204);

            const found = await Recipe.findByPk(recipe.id);
            expect(found).toBeNull();
        });
        it('should return 401 if no token is provided for delete', async () => {
            const recipe = await createTestRecipe(Recipe, { user_id: testUser.id });
            const res = await request(app).delete(`/api/v1/recipes/${recipe.id}`);
            expect(res.statusCode).toEqual(401);
        });

        it('should return 404 if recipe to delete not found', async () => {
            const res = await request(app)
                .delete('/api/v1/recipes/999')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.statusCode).toEqual(404);
        });
    });
});
