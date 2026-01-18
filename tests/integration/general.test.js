/**
 * Main Integration Tests
 * Testing the Express app routes
 */

import request from 'supertest';
import app from '../../src/app.js';

describe('General API Routes', () => {
    describe('GET /health', () => {
        it('should return 200 and OK status', async () => {
            const res = await request(app).get('/health');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('status', 'OK');
        });
    });

    describe('GET /', () => {
        it('should return homepage content', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toEqual(200);
            // Either shows recipes or the empty message
            expect(res.text).toMatch(/recette|Aucune recette/i);
        });
    });

    describe('404 Handling', () => {
        it('should return 404 for non-existent routes', async () => {
            const res = await request(app).get('/api/v1/non-existent');
            expect(res.statusCode).toEqual(404);
        });
    });
});
