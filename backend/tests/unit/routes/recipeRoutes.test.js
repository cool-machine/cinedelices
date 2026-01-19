/**
 * Recipe Routes - Unit Tests
 */

import { jest } from '@jest/globals';

describe('Recipe Routes', () => {
    let router;

    beforeAll(async () => {
        const routerModule = await import('../../../src/routes/recipeRoutes.js');
        router = routerModule.default;
    });

    it('should export a router', () => {
        expect(router).toBeDefined();
        expect(typeof router).toBe('function');
    });

    it('should have GET / route for all recipes', () => {
        const route = router.stack.find(layer => 
            layer.route && layer.route.path === '/' && layer.route.methods.get
        );
        expect(route).toBeDefined();
    });

    it('should have GET /:id route for single recipe', () => {
        const route = router.stack.find(layer => 
            layer.route && layer.route.path === '/:id' && layer.route.methods.get
        );
        expect(route).toBeDefined();
    });

    it('should have POST / route for creating recipes', () => {
        const route = router.stack.find(layer => 
            layer.route && layer.route.path === '/' && layer.route.methods.post
        );
        expect(route).toBeDefined();
    });

    it('should have PUT /:id route for updating recipes', () => {
        const route = router.stack.find(layer => 
            layer.route && layer.route.path === '/:id' && layer.route.methods.put
        );
        expect(route).toBeDefined();
    });

    it('should have DELETE /:id route for deleting recipes', () => {
        const route = router.stack.find(layer => 
            layer.route && layer.route.path === '/:id' && layer.route.methods.delete
        );
        expect(route).toBeDefined();
    });

    it('should have POST /:id/favorite route', () => {
        const route = router.stack.find(layer => 
            layer.route && layer.route.path === '/:id/favorite' && layer.route.methods.post
        );
        expect(route).toBeDefined();
    });

    it('should have POST /:id/rate route', () => {
        const route = router.stack.find(layer => 
            layer.route && layer.route.path === '/:id/rate' && layer.route.methods.post
        );
        expect(route).toBeDefined();
    });

    it('should have GET /:id/reviews route', () => {
        const route = router.stack.find(layer => 
            layer.route && layer.route.path === '/:id/reviews' && layer.route.methods.get
        );
        expect(route).toBeDefined();
    });

    it('should have POST /:id/reviews route', () => {
        const route = router.stack.find(layer => 
            layer.route && layer.route.path === '/:id/reviews' && layer.route.methods.post
        );
        expect(route).toBeDefined();
    });
});
