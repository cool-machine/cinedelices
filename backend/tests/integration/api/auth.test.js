/**
 * Auth Routes - Integration Tests
 */

import request from 'supertest';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';
import { cleanDatabase } from '../../helpers/database.js';

const { User } = db;

describe('Auth Routes', () => {
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    beforeEach(async () => {
        await cleanDatabase(db.sequelize);
    });

    describe('POST /api/v1/auth/register', () => {
        const newUser = {
            username: 'newChef',
            email: 'chef@cinedelices.fr',
            password: 'SafePassword123'
        };

        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send(newUser);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('user');
            expect(res.body.user.username).toBe(newUser.username);
            expect(res.body.user).not.toHaveProperty('password_hash');
            expect(res.body).toHaveProperty('token');
        });

        it('should return 400 if email already exists', async () => {
            // Create existing user
            await User.create({
                username: 'existing',
                email: newUser.email,
                password_hash: 'hashed'
            });

            const res = await request(app)
                .post('/api/v1/auth/register')
                .send(newUser);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toContain('already exists');
        });
    });

    describe('POST /api/v1/auth/login', () => {
        const credentials = {
            email: 'login@test.com',
            password: 'password123'
        };

        beforeEach(async () => {
            const argon2 = await import('argon2');
            const hashedPassword = await argon2.hash(credentials.password);
            await User.create({
                username: 'loginUser',
                email: credentials.email,
                password_hash: hashedPassword
            });
        });

        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send(credentials);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user.email).toBe(credentials.email);
        });

        it('should return 401 with incorrect password', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ ...credentials, password: 'wrongpassword' });

            expect(res.statusCode).toEqual(401);
        });

        it('should return 401 if user does not exist', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'nonexistent@test.com', password: 'any' });

            expect(res.statusCode).toEqual(401);
        });
    });
});
