/**
 * User Routes - Unit Tests
 */

import { jest } from '@jest/globals';

describe('User Routes', () => {
    let router;

    beforeAll(async () => {
        const routerModule = await import('../../../src/routes/userRoutes.js');
        router = routerModule.default;
    });

    it('should export a router', () => {
        expect(router).toBeDefined();
        expect(typeof router).toBe('function');
    });

    it('should have GET / route for all users (admin)', () => {
        const route = router.stack.find(layer => 
            layer.route && layer.route.path === '/' && layer.route.methods.get
        );
        expect(route).toBeDefined();
    });

    it('should have GET /:id route for single user', () => {
        const route = router.stack.find(layer => 
            layer.route && layer.route.path === '/:id' && layer.route.methods.get
        );
        expect(route).toBeDefined();
    });

    it('should have PUT /:id route for updating user', () => {
        const route = router.stack.find(layer => 
            layer.route && layer.route.path === '/:id' && layer.route.methods.put
        );
        expect(route).toBeDefined();
    });

    it('should have DELETE /:id route for deleting user', () => {
        const route = router.stack.find(layer => 
            layer.route && layer.route.path === '/:id' && layer.route.methods.delete
        );
        expect(route).toBeDefined();
    });
});
