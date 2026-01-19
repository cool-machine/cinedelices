/**
 * Recipe CRUD API Integration Tests
 */

import request from 'supertest';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';
import { generateToken } from '../../../src/utils/jwt.js';
import { cleanDatabase, createTestUser, createTestRecipe, createTestCategory, createTestMedia } from '../../helpers/database.js';

const { Recipe, User, Category, Media } = db;

describe('Recipe CRUD API', () => {
    let testUser, testCategory, testMedia, authCookie;

    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    beforeEach(async () => {
        await cleanDatabase(db.sequelize);
        testUser = await createTestUser(User);
        testCategory = await createTestCategory(Category);
        testMedia = await createTestMedia(Media);

        const token = generateToken({ id: testUser.id, email: testUser.email, role: testUser.role });
        authCookie = [`token=${token}`];
    });

    describe('POST /api/v1/recipes', () => {
        it('should create a new recipe', async () => {
            const recipeData = {
                title: 'Test Recipe',
                description: 'A test recipe',
                ingredients: 'Ingredient 1\nIngredient 2',
                instructions: 'Step 1\nStep 2',
                category_id: testCategory.id,
                media_id: testMedia.id,
                difficulty: 'facile',
                prep_time: 15,
                cook_time: 30
            };

            const res = await request(app)
                .post('/api/v1/recipes')
                .set('Cookie', authCookie)
                .send(recipeData);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.title).toBe('Test Recipe');
            expect(res.body.user_id).toBe(testUser.id);
        });

        it('should require authentication', async () => {
            const res = await request(app)
                .post('/api/v1/recipes')
                .send({ title: 'Unauthorized Recipe' });

            expect(res.statusCode).toEqual(401);
        });
    });

    describe('GET /api/v1/recipes/:id', () => {
        it('should return recipe by id', async () => {
            const recipe = await createTestRecipe(Recipe, {
                user_id: testUser.id,
                title: 'My Recipe'
            });

            const res = await request(app).get(`/api/v1/recipes/${recipe.id}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toBe('My Recipe');
        });

        it('should return 404 for non-existent recipe', async () => {
            const res = await request(app).get('/api/v1/recipes/99999');
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('PUT /api/v1/recipes/:id', () => {
        it('should update recipe for author', async () => {
            const recipe = await createTestRecipe(Recipe, {
                user_id: testUser.id,
                title: 'Original Title'
            });

            const res = await request(app)
                .put(`/api/v1/recipes/${recipe.id}`)
                .set('Cookie', authCookie)
                .send({ title: 'Updated Title' });

            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toBe('Updated Title');
        });

        it('should deny access to non-authors', async () => {
            const otherUser = await User.create({
                email: 'other@test.com',
                password_hash: 'hash',
                username: 'other'
            });

            const recipe = await createTestRecipe(Recipe, {
                user_id: otherUser.id,
                title: 'Not My Recipe'
            });

            const res = await request(app)
                .put(`/api/v1/recipes/${recipe.id}`)
                .set('Cookie', authCookie)
                .send({ title: 'Hacked' });

            expect(res.statusCode).toEqual(403);
        });
    });

    describe('DELETE /api/v1/recipes/:id', () => {
        it('should delete recipe for author', async () => {
            const recipe = await createTestRecipe(Recipe, {
                user_id: testUser.id,
                title: 'To Delete'
            });

            const res = await request(app)
                .delete(`/api/v1/recipes/${recipe.id}`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(204);

            const deleted = await Recipe.findByPk(recipe.id);
            expect(deleted).toBeNull();
        });

        it('should require authentication', async () => {
            const recipe = await createTestRecipe(Recipe, {
                user_id: testUser.id,
                title: 'Protected'
            });

            const res = await request(app).delete(`/api/v1/recipes/${recipe.id}`);
            expect(res.statusCode).toEqual(401);
        });
    });
});
