/**
 * Routes Index - Unit Tests
 */

import { jest } from '@jest/globals';

describe('Routes Index', () => {
    let router;

    beforeAll(async () => {
        const routerModule = await import('../../../src/routes/index.js');
        router = routerModule.default;
    });

    it('should export a router function', () => {
        expect(router).toBeDefined();
        expect(typeof router).toBe('function');
    });

    it('should have router stack with mounted routes', () => {
        expect(router.stack).toBeDefined();
        expect(Array.isArray(router.stack)).toBe(true);
        // Should have: 4 sub-routers (recipes, auth, users, admin) + 3 direct routes (categories, media, favorites)
        expect(router.stack.length).toBeGreaterThanOrEqual(7);
    });

    it('should have sub-routers mounted', () => {
        const subRouters = router.stack.filter(layer => layer.name === 'router');
        // recipes, auth, users, admin
        expect(subRouters.length).toBe(4);
    });

    it('should have direct routes for metadata and favorites', () => {
        const directRoutes = router.stack.filter(layer => layer.route);
        // /categories, /media, /favorites
        expect(directRoutes.length).toBe(3);
        
        const paths = directRoutes.map(layer => layer.route.path);
        expect(paths).toContain('/categories');
        expect(paths).toContain('/media');
        expect(paths).toContain('/favorites');
    });
});
