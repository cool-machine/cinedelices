/**
 * General API Tests
 * Testing basic Express app routes
 */

import request from 'supertest';
import app from '../../src/app.js';

describe('General API Routes', () => {
    describe('GET /health', () => {
        it('should return 200 and OK status', async () => {
            const res = await request(app).get('/health');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('status', 'OK');
            expect(res.body).toHaveProperty('message', 'CinéDélices API is running');
        });
    });

    describe('404 Handling', () => {
        it('should return 404 JSON for non-existent API routes', async () => {
            const res = await request(app).get('/api/v1/non-existent');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Not found');
        });

        it('should return 404 JSON for non-existent root routes', async () => {
            const res = await request(app).get('/non-existent-page');
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Not found');
        });
    });
});
