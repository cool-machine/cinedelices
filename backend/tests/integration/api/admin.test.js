/**
 * Admin API - Integration Tests
 */

import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';
import { cleanDatabase, createTestUser, createTestCategory, createTestMedia, createTestRecipe } from '../../helpers/database.js';
import { generateToken } from '../../../src/utils/jwt.js';

const { User, Recipe, Category, Media } = db;

describe('Admin API', () => {
    let adminUser;
    let adminToken;
    let regularUser;
    let regularToken;

    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    beforeEach(async () => {
        await cleanDatabase(db.sequelize);
        
        // Create admin user
        adminUser = await createTestUser(User, {
            username: 'admin',
            email: 'admin@test.com',
            role: 'admin'
        });
        adminToken = generateToken({ id: adminUser.id, email: adminUser.email, role: 'admin' });

        // Create regular user
        regularUser = await createTestUser(User, {
            username: 'user',
            email: 'user@test.com',
            role: 'user'
        });
        regularToken = generateToken({ id: regularUser.id, email: regularUser.email, role: 'user' });
    });

    describe('GET /api/v1/admin/stats', () => {
        it('should return stats for admin', async () => {
            const res = await request(app)
                .get('/api/v1/admin/stats')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('recipes');
            expect(res.body).toHaveProperty('users');
            expect(res.body).toHaveProperty('categories');
            expect(res.body).toHaveProperty('media');
        });

        it('should return 403 for non-admin', async () => {
            const res = await request(app)
                .get('/api/v1/admin/stats')
                .set('Authorization', `Bearer ${regularToken}`);

            expect(res.status).toBe(403);
        });

        it('should return 401 without token', async () => {
            const res = await request(app)
                .get('/api/v1/admin/stats');

            expect(res.status).toBe(401);
        });
    });

    describe('Admin Recipes', () => {
        let recipe;
        let category;

        beforeEach(async () => {
            category = await createTestCategory(Category, { name: 'Test Category' });
            recipe = await createTestRecipe(Recipe, {
                title: 'Admin Test Recipe',
                user_id: regularUser.id,
                category_id: category.id
            });
        });

        it('GET /api/v1/admin/recipes should return all recipes', async () => {
            const res = await request(app)
                .get('/api/v1/admin/recipes')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('PUT /api/v1/admin/recipes/:id should update recipe', async () => {
            const res = await request(app)
                .put(`/api/v1/admin/recipes/${recipe.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ title: 'Updated by Admin' });

            expect(res.status).toBe(200);
            expect(res.body.title).toBe('Updated by Admin');
        });

        it('DELETE /api/v1/admin/recipes/:id should delete recipe', async () => {
            const res = await request(app)
                .delete(`/api/v1/admin/recipes/${recipe.id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(204);
        });
    });

    describe('Admin Categories', () => {
        let category;

        beforeEach(async () => {
            category = await createTestCategory(Category, { name: 'Existing Category' });
        });

        it('GET /api/v1/admin/categories should return all categories', async () => {
            const res = await request(app)
                .get('/api/v1/admin/categories')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('POST /api/v1/admin/categories should create category', async () => {
            const res = await request(app)
                .post('/api/v1/admin/categories')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'New Category' });

            expect(res.status).toBe(201);
            expect(res.body.name).toBe('New Category');
        });

        it('PUT /api/v1/admin/categories/:id should update category', async () => {
            const res = await request(app)
                .put(`/api/v1/admin/categories/${category.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Updated Category' });

            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Updated Category');
        });

        it('DELETE /api/v1/admin/categories/:id should delete category', async () => {
            const res = await request(app)
                .delete(`/api/v1/admin/categories/${category.id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(204);
        });
    });

    describe('Admin Media', () => {
        let media;

        beforeEach(async () => {
            media = await createTestMedia(Media, { title: 'Test Film', type: 'film' });
        });

        it('GET /api/v1/admin/media should return all media', async () => {
            const res = await request(app)
                .get('/api/v1/admin/media')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('POST /api/v1/admin/media should create media', async () => {
            const res = await request(app)
                .post('/api/v1/admin/media')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ title: 'New Film', type: 'film' });

            expect(res.status).toBe(201);
            expect(res.body.title).toBe('New Film');
        });

        it('PUT /api/v1/admin/media/:id should update media', async () => {
            const res = await request(app)
                .put(`/api/v1/admin/media/${media.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ title: 'Updated Film' });

            expect(res.status).toBe(200);
            expect(res.body.title).toBe('Updated Film');
        });

        it('DELETE /api/v1/admin/media/:id should delete media', async () => {
            const res = await request(app)
                .delete(`/api/v1/admin/media/${media.id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(204);
        });
    });

    describe('Admin Users', () => {
        it('GET /api/v1/admin/users should return all users', async () => {
            const res = await request(app)
                .get('/api/v1/admin/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
        });

        it('PUT /api/v1/admin/users/:id should update user', async () => {
            const res = await request(app)
                .put(`/api/v1/admin/users/${regularUser.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ role: 'admin' });

            expect(res.status).toBe(200);
            expect(res.body.role).toBe('admin');
        });

        it('DELETE /api/v1/admin/users/:id should delete user', async () => {
            const res = await request(app)
                .delete(`/api/v1/admin/users/${regularUser.id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(204);
        });

        it('should not return password_hash in user list', async () => {
            const res = await request(app)
                .get('/api/v1/admin/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            res.body.forEach(user => {
                expect(user).not.toHaveProperty('password_hash');
            });
        });
    });
});
