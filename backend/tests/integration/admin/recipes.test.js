/**
 * Admin Recipe Management Integration Tests
 */

import request from 'supertest';
import * as cheerio from 'cheerio';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';
import { generateToken } from '../../../src/utils/jwt.js';
import {
    cleanDatabase,
    createTestUser,
    createTestRecipe,
    createTestCategory,
    createTestMedia
} from '../../helpers/database.js';

const { User, Recipe, Category, Media } = db;

describe('Admin Recipe Management', () => {
    let adminUser, adminCookie;

    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    beforeEach(async () => {
        await cleanDatabase(db.sequelize);
        adminUser = await createTestUser(User, {
            email: 'admin@test.com',
            username: 'adminUser',
            role: 'admin'
        });

        const token = generateToken({ id: adminUser.id, email: adminUser.email, role: adminUser.role });
        adminCookie = [`token=${token}`];
    });

    describe('GET /admin/recipes', () => {
        it('should redirect unauthenticated users to login', async () => {
            const res = await request(app).get('/admin/recipes');

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toContain('/login');
        });

        it('should render 403 page for non-admin users', async () => {
            const user = await createTestUser(User, {
                email: 'user@test.com',
                username: 'regularUser',
                role: 'user'
            });
            const token = generateToken({ id: user.id, email: user.email, role: user.role });
            const authCookie = [`token=${token}`];

            const res = await request(app)
                .get('/admin/recipes')
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(403);
            expect(res.header['content-type']).toContain('text/html');
            const $ = cheerio.load(res.text);
            expect($('h1').text()).toContain('Accès refusé');
        });

        it('should render admin recipes list for admin users', async () => {
            const category = await createTestCategory(Category);
            const media = await createTestMedia(Media);
            await createTestRecipe(Recipe, {
                user_id: adminUser.id,
                category_id: category.id,
                media_id: media.id,
                title: 'Admin Recipe'
            });

            const res = await request(app)
                .get('/admin/recipes')
                .set('Cookie', adminCookie);

            expect(res.statusCode).toEqual(200);
            expect(res.header['content-type']).toContain('text/html');
            const $ = cheerio.load(res.text);
            expect($('.admin-layout').length).toBe(1);
            expect($('.admin-recipes').length).toBe(1);
            expect($('.recipe-row').length).toBe(1);
            expect($('.recipe-row').first().text()).toContain('Admin Recipe');
        });
    });

    describe('GET /admin/recipes/:id/edit', () => {
        it('should render edit form for admin users', async () => {
            const category = await createTestCategory(Category);
            const media = await createTestMedia(Media);
            const recipe = await createTestRecipe(Recipe, {
                user_id: adminUser.id,
                category_id: category.id,
                media_id: media.id,
                title: 'Editable Recipe'
            });

            const res = await request(app)
                .get(`/admin/recipes/${recipe.id}/edit`)
                .set('Cookie', adminCookie);

            expect(res.statusCode).toEqual(200);
            const $ = cheerio.load(res.text);
            expect($('form[action="/admin/recipes/' + recipe.id + '?_method=PUT"]').length).toBe(1);
            expect($('input[name="title"]').val()).toBe('Editable Recipe');
        });
    });

    describe('PUT /admin/recipes/:id', () => {
        it('should update recipe and redirect to admin list', async () => {
            const recipe = await createTestRecipe(Recipe, {
                user_id: adminUser.id,
                title: 'Old Title'
            });

            const res = await request(app)
                .put(`/admin/recipes/${recipe.id}`)
                .set('Cookie', adminCookie)
                .send({ title: 'New Title' });

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toBe('/admin/recipes');

            const updated = await Recipe.findByPk(recipe.id);
            expect(updated.title).toBe('New Title');
        });
    });

    describe('DELETE /admin/recipes/:id', () => {
        it('should delete recipe and redirect to admin list', async () => {
            const recipe = await createTestRecipe(Recipe, {
                user_id: adminUser.id,
                title: 'Delete Recipe'
            });

            const res = await request(app)
                .delete(`/admin/recipes/${recipe.id}`)
                .set('Cookie', adminCookie);

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toBe('/admin/recipes');

            const deleted = await Recipe.findByPk(recipe.id);
            expect(deleted).toBeNull();
        });
    });
});
