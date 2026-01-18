/**
 * Search & Filter Integration Tests
 */

import request from 'supertest';
import * as cheerio from 'cheerio';
import app from '../../src/app.js';
import db from '../../src/models/index.js';
import { cleanDatabase, createTestUser, createTestRecipe, createTestMedia, createTestCategory } from '../helpers/database.js';

const { Recipe, User, Category, Media } = db;

describe('Search & Filter', () => {
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

    describe('GET /recipes?search=query', () => {
        it('should filter recipes by title', async () => {
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

            const res = await request(app).get('/recipes?search=ratatouille');
            expect(res.statusCode).toEqual(200);

            const $ = cheerio.load(res.text);
            expect($('.recipe-card').length).toBe(1);
            expect(res.text).toContain('Ratatouille du Chef');
            expect(res.text).not.toContain('Burger Pulp Fiction');
        });

        it('should return all recipes when search is empty', async () => {
            await createTestRecipe(Recipe, { user_id: testUser.id, title: 'Recipe 1' });
            await createTestRecipe(Recipe, { user_id: testUser.id, title: 'Recipe 2' });

            const res = await request(app).get('/recipes?search=');
            expect(res.statusCode).toEqual(200);

            const $ = cheerio.load(res.text);
            expect($('.recipe-card').length).toBe(2);
        });
    });

    describe('GET /recipes?category=id', () => {
        it('should filter recipes by category', async () => {
            const dessert = await Category.create({ name: 'Dessert' });

            await createTestRecipe(Recipe, {
                user_id: testUser.id,
                title: 'Cannoli',
                category_id: dessert.id
            });
            await createTestRecipe(Recipe, {
                user_id: testUser.id,
                title: 'Steak',
                category_id: testCategory.id
            });

            const res = await request(app).get(`/recipes?category=${dessert.id}`);
            expect(res.statusCode).toEqual(200);

            const $ = cheerio.load(res.text);
            expect($('.recipe-card').length).toBe(1);
            expect(res.text).toContain('Cannoli');
        });
    });

    describe('GET /recipes?media=id', () => {
        it('should filter recipes by media', async () => {
            const breakingBad = await Media.create({ title: 'Breaking Bad', type: 'serie' });

            await createTestRecipe(Recipe, {
                user_id: testUser.id,
                title: 'Los Pollos Hermanos',
                media_id: breakingBad.id
            });
            await createTestRecipe(Recipe, {
                user_id: testUser.id,
                title: 'Ratatouille',
                media_id: testMedia.id
            });

            const res = await request(app).get(`/recipes?media=${breakingBad.id}`);
            expect(res.statusCode).toEqual(200);

            const $ = cheerio.load(res.text);
            expect($('.recipe-card').length).toBe(1);
            expect(res.text).toContain('Los Pollos Hermanos');
        });
    });
});
