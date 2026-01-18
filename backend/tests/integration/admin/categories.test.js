/**
 * Admin Category Management Integration Tests
 */

import request from 'supertest';
import * as cheerio from 'cheerio';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';
import { generateToken } from '../../../src/utils/jwt.js';
import { cleanDatabase, createTestUser, createTestCategory } from '../../helpers/database.js';

const { User, Category } = db;

describe('Admin Category Management', () => {
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

    describe('GET /admin/categories', () => {
        it('should redirect unauthenticated users to login', async () => {
            const res = await request(app).get('/admin/categories');

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
                .get('/admin/categories')
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(403);
            expect(res.header['content-type']).toContain('text/html');
            const $ = cheerio.load(res.text);
            expect($('h1').text()).toContain('Accès refusé');
        });

        it('should render admin categories list for admin users', async () => {
            await createTestCategory(Category, { name: 'Desserts' });

            const res = await request(app)
                .get('/admin/categories')
                .set('Cookie', adminCookie);

            expect(res.statusCode).toEqual(200);
            expect(res.header['content-type']).toContain('text/html');
            const $ = cheerio.load(res.text);
            expect($('.admin-layout').length).toBe(1);
            expect($('.admin-categories').length).toBe(1);
            expect($('.category-row').length).toBe(1);
            expect($('.category-row').first().text()).toContain('Desserts');
        });
    });

    describe('POST /admin/categories', () => {
        it('should create category and redirect to admin list', async () => {
            const res = await request(app)
                .post('/admin/categories')
                .set('Cookie', adminCookie)
                .send({ name: 'Entrées', description: 'Catégorie test' });

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toBe('/admin/categories');

            const created = await Category.findOne({ where: { name: 'Entrées' } });
            expect(created).not.toBeNull();
        });
    });

    describe('GET /admin/categories/:id/edit', () => {
        it('should render edit form for admin users', async () => {
            const category = await createTestCategory(Category, { name: 'Plats' });

            const res = await request(app)
                .get(`/admin/categories/${category.id}/edit`)
                .set('Cookie', adminCookie);

            expect(res.statusCode).toEqual(200);
            const $ = cheerio.load(res.text);
            expect($('form[action="/admin/categories/' + category.id + '?_method=PUT"]').length).toBe(1);
            expect($('input[name="name"]').val()).toBe('Plats');
        });
    });

    describe('PUT /admin/categories/:id', () => {
        it('should update category and redirect to admin list', async () => {
            const category = await createTestCategory(Category, { name: 'Old Name' });

            const res = await request(app)
                .put(`/admin/categories/${category.id}`)
                .set('Cookie', adminCookie)
                .send({ name: 'New Name' });

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toBe('/admin/categories');

            const updated = await Category.findByPk(category.id);
            expect(updated.name).toBe('New Name');
        });
    });

    describe('DELETE /admin/categories/:id', () => {
        it('should delete category and redirect to admin list', async () => {
            const category = await createTestCategory(Category, { name: 'Delete Me' });

            const res = await request(app)
                .delete(`/admin/categories/${category.id}`)
                .set('Cookie', adminCookie);

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toBe('/admin/categories');

            const deleted = await Category.findByPk(category.id);
            expect(deleted).toBeNull();
        });
    });
});
