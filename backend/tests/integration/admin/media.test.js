/**
 * Admin Media Management Integration Tests
 */

import request from 'supertest';
import * as cheerio from 'cheerio';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';
import { generateToken } from '../../../src/utils/jwt.js';
import { cleanDatabase, createTestUser, createTestMedia } from '../../helpers/database.js';

const { User, Media } = db;

describe('Admin Media Management', () => {
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

    describe('GET /admin/media', () => {
        it('should redirect unauthenticated users to login', async () => {
            const res = await request(app).get('/admin/media');

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
                .get('/admin/media')
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(403);
            expect(res.header['content-type']).toContain('text/html');
            const $ = cheerio.load(res.text);
            expect($('h1').text()).toContain('Accès refusé');
        });

        it('should render admin media list for admin users', async () => {
            await createTestMedia(Media, { title: 'Inception', type: 'film' });

            const res = await request(app)
                .get('/admin/media')
                .set('Cookie', adminCookie);

            expect(res.statusCode).toEqual(200);
            expect(res.header['content-type']).toContain('text/html');
            const $ = cheerio.load(res.text);
            expect($('.admin-layout').length).toBe(1);
            expect($('.admin-media').length).toBe(1);
            expect($('.media-row').length).toBe(1);
            expect($('.media-row').first().text()).toContain('Inception');
        });
    });

    describe('POST /admin/media', () => {
        it('should create media and redirect to admin list', async () => {
            const res = await request(app)
                .post('/admin/media')
                .set('Cookie', adminCookie)
                .send({ title: 'Interstellar', type: 'film', release_year: 2014 });

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toBe('/admin/media');

            const created = await Media.findOne({ where: { title: 'Interstellar' } });
            expect(created).not.toBeNull();
        });
    });

    describe('GET /admin/media/:id/edit', () => {
        it('should render edit form for admin users', async () => {
            const media = await createTestMedia(Media, { title: 'Matrix', type: 'film' });

            const res = await request(app)
                .get(`/admin/media/${media.id}/edit`)
                .set('Cookie', adminCookie);

            expect(res.statusCode).toEqual(200);
            const $ = cheerio.load(res.text);
            expect($('form[action="/admin/media/' + media.id + '?_method=PUT"]').length).toBe(1);
            expect($('input[name="title"]').val()).toBe('Matrix');
            expect($('select[name="type"]').length).toBe(1);
        });
    });

    describe('PUT /admin/media/:id', () => {
        it('should update media and redirect to admin list', async () => {
            const media = await createTestMedia(Media, { title: 'Old Media', type: 'serie' });

            const res = await request(app)
                .put(`/admin/media/${media.id}`)
                .set('Cookie', adminCookie)
                .send({ title: 'New Media', type: 'film' });

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toBe('/admin/media');

            const updated = await Media.findByPk(media.id);
            expect(updated.title).toBe('New Media');
            expect(updated.type).toBe('film');
        });
    });

    describe('DELETE /admin/media/:id', () => {
        it('should delete media and redirect to admin list', async () => {
            const media = await createTestMedia(Media, { title: 'Delete Media', type: 'film' });

            const res = await request(app)
                .delete(`/admin/media/${media.id}`)
                .set('Cookie', adminCookie);

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toBe('/admin/media');

            const deleted = await Media.findByPk(media.id);
            expect(deleted).toBeNull();
        });
    });
});
