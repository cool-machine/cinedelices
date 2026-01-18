/**
 * Views Integration Tests
 * Verifying HTML rendering using Cheerio
 */

import request from 'supertest';
import * as cheerio from 'cheerio';
import app from '../../src/app.js';

describe('Frontend Views', () => {
    describe('GET /', () => {
        it('should render the homepage with correct layout', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toEqual(200);
            expect(res.header['content-type']).toContain('text/html');

            const $ = cheerio.load(res.text);

            // Check for layout elements
            expect($('header').length).toBe(1); // Header partial
            expect($('footer').length).toBe(1); // Footer partial
            expect($('main').length).toBe(1);
        });
    });

    describe('GET /non-existent-page', () => {
        it('should render a custom 404 page', async () => {
            const res = await request(app).get('/this-path-does-not-exist');
            expect(res.statusCode).toEqual(404);
            expect(res.header['content-type']).toContain('text/html');

            const $ = cheerio.load(res.text);
            expect($('h1').text()).toContain('Page non trouvée');
        });
    });
});
