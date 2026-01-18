/**
 * User Profile Integration Tests
 */

import request from 'supertest';
import * as cheerio from 'cheerio';
import app from '../../src/app.js';
import db from '../../src/models/index.js';
import { generateToken } from '../../src/utils/jwt.js';
import { cleanDatabase, createTestUser, createTestRecipe } from '../helpers/database.js';

const { User, Recipe } = db;

describe('User Profile Views', () => {
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

        // Generate JWT token directly for testing
        const token = generateToken({ id: testUser.id, email: testUser.email, role: testUser.role });
        authCookie = [`token=${token}`];
    });

    describe('GET /profile/:id', () => {
        it('should render the profile page with user info and recipes', async () => {
            // Create some recipes for the user
            await createTestRecipe(Recipe, { user_id: testUser.id, title: 'Recipe 1' });
            await createTestRecipe(Recipe, { user_id: testUser.id, title: 'Recipe 2' });

            const res = await request(app)
                .get(`/profile/${testUser.id}`)
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(200);
            const $ = cheerio.load(res.text);
            expect($('h1').text()).toContain('TestChef');
            expect($('.profile-bio').text()).toContain('Cooking is my passion');
            expect($('.profile-recipes .recipe-card').length).toBe(2);
        });

        it('should return 404 for non-existent user profile', async () => {
            const res = await request(app)
                .get('/profile/99999')
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(404);
        });
    });

    describe('GET /profile/edit', () => {
        it('should render the edit profile form for authenticated user', async () => {
            const res = await request(app)
                .get('/profile/edit')
                .set('Cookie', authCookie);

            expect(res.statusCode).toEqual(200);
            const $ = cheerio.load(res.text);
            expect($('form[action="/profile/edit?_method=PUT"]').length).toBe(1);
            expect($('input[name="username"]').val()).toBe('TestChef');
            expect($('textarea[name="bio"]').val()).toBe('Cooking is my passion');
        });

        it('should redirect unauthenticated users to login', async () => {
            const res = await request(app).get('/profile/edit');
            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toContain('/login');
        });
    });

    describe('PUT /profile/edit', () => {
        it('should update user profile and redirect', async () => {
            const updateData = {
                username: 'UpdatedChef',
                bio: 'New bio content',
                avatar_url: 'https://example.com/new-avatar.jpg'
            };

            const res = await request(app)
                .put('/profile/edit')
                .set('Cookie', authCookie)
                .send(updateData);

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toBe(`/profile/${testUser.id}`);

            // Verify update in DB
            const updatedUser = await User.findByPk(testUser.id);
            expect(updatedUser.username).toBe('UpdatedChef');
            expect(updatedUser.bio).toBe('New bio content');
        });
    });
});
