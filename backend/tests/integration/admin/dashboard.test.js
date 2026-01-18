/**
 * Admin Dashboard Integration Tests
 */

import request from 'supertest';
import * as cheerio from 'cheerio';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';
import { generateToken } from '../../../src/utils/jwt.js';
import {
    cleanDatabase,
    createTestUser,
    createTestCategory,
    createTestMedia,
    createTestRecipe
} from '../../helpers/database.js';

const { User, Category, Media, Recipe } = db;

describe('Admin Dashboard', () => {
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    beforeEach(async () => {
        await cleanDatabase(db.sequelize);
    });

    describe('GET /admin', () => {
        it('should redirect unauthenticated users to login', async () => {
            const res = await request(app).get('/admin');

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
                .get('/admin')
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(403);
            expect(res.header['content-type']).toContain('text/html');
            const $ = cheerio.load(res.text);
            expect($('h1').text()).toContain('Accès refusé');
        });

        it('should render admin dashboard for admin users with stats', async () => {
            const admin = await createTestUser(User, {
                email: 'admin@test.com',
                username: 'adminUser',
                role: 'admin'
            });
            await createTestUser(User, { email: 'user2@test.com', username: 'user2' });

            const category = await createTestCategory(Category);
            const media = await createTestMedia(Media);
            await createTestRecipe(Recipe, { user_id: admin.id, category_id: category.id, media_id: media.id });

            const token = generateToken({ id: admin.id, email: admin.email, role: admin.role });
            const authCookie = [`token=${token}`];

            const res = await request(app)
                .get('/admin')
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(200);
            expect(res.header['content-type']).toContain('text/html');
            const $ = cheerio.load(res.text);
            expect($('.admin-dashboard').length).toBe(1);
            expect($('.admin-layout').length).toBe(1);
            expect($('.admin-sidebar').length).toBe(1);
            expect($('.stat-card').length).toBe(4);
        });
    });
});
