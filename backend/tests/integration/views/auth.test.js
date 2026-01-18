/**
 * Auth Views Integration Tests
 */

import request from 'supertest';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';
import { cleanDatabase, createTestUser } from '../../helpers/database.js';

const { User } = db;

describe('Auth Views', () => {
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    beforeEach(async () => {
        await cleanDatabase(db.sequelize);
    });

    describe('POST /login', () => {
        it('should redirect to profile edit when profile is incomplete', async () => {
            const user = await createTestUser(User, {
                email: 'incomplete@test.com',
                username: 'incompleteUser',
                avatar_url: null,
                bio: null
            });

            const res = await request(app)
                .post('/login')
                .send({ email: user.email, password: 'testpassword123' });

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toBe('/profile/edit');
        });

        it('should redirect to home when profile is complete', async () => {
            const user = await createTestUser(User, {
                email: 'complete@test.com',
                username: 'completeUser',
                avatar_url: 'https://example.com/avatar.png',
                bio: 'Bio completed'
            });

            const res = await request(app)
                .post('/login')
                .send({ email: user.email, password: 'testpassword123' });

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toBe('/');
        });
    });
});
