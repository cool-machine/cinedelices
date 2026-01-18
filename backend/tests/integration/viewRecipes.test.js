/**
 * Recipe Views Integration Tests
 */

import request from 'supertest';
import * as cheerio from 'cheerio';
import app from '../../src/app.js';
import db from '../../src/models/index.js';
import { cleanDatabase, createTestUser, createTestRecipe } from '../helpers/database.js';

const { Recipe, User } = db;

describe('Recipe Views', () => {
    let testUser;

    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    beforeEach(async () => {
        await cleanDatabase(db.sequelize);
        testUser = await createTestUser(User);
    });

    describe('GET /recipes', () => {
        it('should display a list of recipes', async () => {
            // Create some recipes
            await createTestRecipe(Recipe, { user_id: testUser.id, title: 'Ratatouille' });
            await createTestRecipe(Recipe, { user_id: testUser.id, title: 'Burger de la mort' });

            const res = await request(app).get('/recipes');
            expect(res.statusCode).toEqual(200);

            const $ = cheerio.load(res.text);
            expect($('h1').text()).toContain('Recettes');
            expect($('.recipe-card').length).toBe(2);
            expect($('.recipe-card').text()).toContain('Ratatouille');
            expect($('.recipe-card').text()).toContain('Burger de la mort');
        });
    });

    describe('GET /recipes/:id', () => {
        it('should display recipe details', async () => {
            const recipe = await createTestRecipe(Recipe, {
                user_id: testUser.id,
                title: 'Lasagnes de Garfield',
                description: 'Miam miam',
                ingredients: '- Pates\n- Sauce',
                instructions: 'Cuire'
            });

            const res = await request(app).get(`/recipes/${recipe.id}`);
            expect(res.statusCode).toEqual(200);

            const $ = cheerio.load(res.text);
            expect($('h1').text()).toContain('Lasagnes de Garfield');
            expect($('.ingredients').text()).toContain('Pates');
            expect($('.instructions').text()).toContain('Cuire');
        });
    });
});
