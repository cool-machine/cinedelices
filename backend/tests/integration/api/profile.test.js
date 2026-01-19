/**
 * User Profile API Integration Tests
 */

import request from 'supertest';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';
import { generateToken } from '../../../src/utils/jwt.js';
import { cleanDatabase, createTestUser, createTestRecipe } from '../../helpers/database.js';

const { User, Recipe } = db;

describe('User Profile API', () => {
    let testUser, otherUser, authCookie;

    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    beforeEach(async () => {
        await cleanDatabase(db.sequelize);
        testUser = await createTestUser(User, {
            username: 'TestChef',
            bio: 'Cooking is my passion',
            avatar_url: 'https://example.com/avatar.jpg'
        });

        otherUser = await User.create({
            username: 'OtherChef',
            email: 'other@chef.com',
            password_hash: 'hash'
        });

        const token = generateToken({ id: testUser.id, email: testUser.email, role: testUser.role });
        authCookie = [`token=${token}`];
    });

    describe('GET /api/v1/users/:id', () => {
        it('should return user profile with recipes', async () => {
            await createTestRecipe(Recipe, { user_id: testUser.id, title: 'Recipe 1' });
            await createTestRecipe(Recipe, { user_id: testUser.id, title: 'Recipe 2' });

            const res = await request(app)
                .get(`/api/v1/users/${testUser.id}`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('username', 'TestChef');
            expect(res.body).toHaveProperty('bio', 'Cooking is my passion');
        });

        it('should return 404 for non-existent user', async () => {
            const res = await request(app)
                .get('/api/v1/users/99999')
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(404);
        });
    });

    describe('PUT /api/v1/users/:id', () => {
        it('should update own profile', async () => {
            const updateData = {
                username: 'UpdatedChef',
                bio: 'New bio content'
            };

            const res = await request(app)
                .put(`/api/v1/users/${testUser.id}`)
                .set('Cookie', authCookie)
                .send(updateData);

            expect(res.statusCode).toEqual(200);
            expect(res.body.username).toBe('UpdatedChef');
            expect(res.body.bio).toBe('New bio content');
        });

        it('should require authentication', async () => {
            const res = await request(app)
                .put(`/api/v1/users/${testUser.id}`)
                .send({ username: 'Hacker' });

            expect(res.statusCode).toEqual(401);
        });

        it('should not allow updating other users profile', async () => {
            const res = await request(app)
                .put(`/api/v1/users/${otherUser.id}`)
                .set('Cookie', authCookie)
                .send({ username: 'Hacked' });

            expect(res.statusCode).toEqual(403);
        });
    });
});
