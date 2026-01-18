/**
 * Admin User Management Integration Tests
 */

import request from 'supertest';
import * as cheerio from 'cheerio';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';
import { generateToken } from '../../../src/utils/jwt.js';
import { cleanDatabase, createTestUser } from '../../helpers/database.js';

const { User } = db;

describe('Admin User Management', () => {
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

    describe('GET /admin/users', () => {
        it('should redirect unauthenticated users to login', async () => {
            const res = await request(app).get('/admin/users');

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
                .get('/admin/users')
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(403);
            expect(res.header['content-type']).toContain('text/html');
            const $ = cheerio.load(res.text);
            expect($('h1').text()).toContain('Accès refusé');
        });

        it('should render admin users list for admin users', async () => {
            await createTestUser(User, { email: 'chef@test.com', username: 'Chef' });

            const res = await request(app)
                .get('/admin/users')
                .set('Cookie', adminCookie);

            expect(res.statusCode).toEqual(200);
            expect(res.header['content-type']).toContain('text/html');
            const $ = cheerio.load(res.text);
            expect($('.admin-layout').length).toBe(1);
            expect($('.admin-users').length).toBe(1);
            expect($('.user-row').length).toBeGreaterThan(0);
            expect($('.user-row').first().text()).toContain('Chef');
        });
    });

    describe('GET /admin/users/:id/edit', () => {
        it('should render edit form for admin users', async () => {
            const user = await createTestUser(User, { email: 'edit@test.com', username: 'EditUser' });

            const res = await request(app)
                .get(`/admin/users/${user.id}/edit`)
                .set('Cookie', adminCookie);

            expect(res.statusCode).toEqual(200);
            const $ = cheerio.load(res.text);
            expect($('form[action="/admin/users/' + user.id + '?_method=PUT"]').length).toBe(1);
            expect($('input[name="username"]').val()).toBe('EditUser');
            expect($('select[name="role"]').length).toBe(1);
        });
    });

    describe('PUT /admin/users/:id', () => {
        it('should update user role and redirect to admin list', async () => {
            const user = await createTestUser(User, { email: 'role@test.com', username: 'RoleUser' });

            const res = await request(app)
                .put(`/admin/users/${user.id}`)
                .set('Cookie', adminCookie)
                .send({ role: 'admin', username: 'RoleUser' });

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toBe('/admin/users');

            const updated = await User.findByPk(user.id);
            expect(updated.role).toBe('admin');
        });
    });

    describe('DELETE /admin/users/:id', () => {
        it('should delete user and redirect to admin list', async () => {
            const user = await createTestUser(User, { email: 'delete@test.com', username: 'DeleteUser' });

            const res = await request(app)
                .delete(`/admin/users/${user.id}`)
                .set('Cookie', adminCookie);

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toBe('/admin/users');

            const deleted = await User.findByPk(user.id);
            expect(deleted).toBeNull();
        });
    });
});
