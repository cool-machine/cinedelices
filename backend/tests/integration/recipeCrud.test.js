/**
 * Recipe CRUD Integration Tests
 * TDD for Create, Edit, Delete Recipe forms
 */

import request from 'supertest';
import * as cheerio from 'cheerio';
import app from '../../src/app.js';
import db from '../../src/models/index.js';
import { generateToken } from '../../src/utils/jwt.js';
import { cleanDatabase, createTestUser, createTestRecipe, createTestCategory, createTestMedia } from '../helpers/database.js';

const { Recipe, User, Category, Media } = db;

describe('Recipe CRUD Forms', () => {
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

        // Generate JWT token directly for testing
        const token = generateToken({ id: testUser.id, email: testUser.email, role: testUser.role });
        authCookie = [`token=${token}`];
    });

    describe('GET /recipes/new', () => {
        it('should render create recipe form for authenticated users', async () => {
            const res = await request(app)
                .get('/recipes/new')
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(200);
            const $ = cheerio.load(res.text);
            expect($('form[action="/recipes"]').length).toBe(1);
            expect($('input[name="title"]').length).toBe(1);
            expect($('textarea[name="description"]').length).toBe(1);
            expect($('select[name="category_id"]').length).toBe(1);
        });

        it('should redirect unauthenticated users to login', async () => {
            const res = await request(app).get('/recipes/new');
            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toContain('/login');
        });
    });

    describe('POST /recipes', () => {
        it('should create a new recipe and redirect', async () => {
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
                .post('/recipes')
                .set('Cookie', authCookie)
                .send(recipeData);

            expect(res.statusCode).toEqual(302);

            // Verify recipe was created
            const recipe = await Recipe.findOne({ where: { title: 'Test Recipe' } });
            expect(recipe).not.toBeNull();
            expect(recipe.user_id).toBe(testUser.id);
        });
    });

    describe('GET /recipes/:id/edit', () => {
        it('should render edit form for recipe author', async () => {
            const recipe = await createTestRecipe(Recipe, {
                user_id: testUser.id,
                title: 'My Recipe'
            });

            const res = await request(app)
                .get(`/recipes/${recipe.id}/edit`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(200);
            const $ = cheerio.load(res.text);
            expect($('input[name="title"]').val()).toBe('My Recipe');
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
                .get(`/recipes/${recipe.id}/edit`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(403);
        });
    });

    describe('DELETE /recipes/:id', () => {
        it('should delete recipe and redirect', async () => {
            const recipe = await createTestRecipe(Recipe, {
                user_id: testUser.id,
                title: 'To Delete'
            });

            const res = await request(app)
                .delete(`/recipes/${recipe.id}`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(302);

            // Verify deletion
            const deleted = await Recipe.findByPk(recipe.id);
            expect(deleted).toBeNull();
        });
    });
});
