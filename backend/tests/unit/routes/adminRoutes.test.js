/**
 * Admin Routes - Unit Tests
 */

import { jest } from '@jest/globals';

describe('Admin Routes', () => {
    let router;

    beforeAll(async () => {
        const routerModule = await import('../../../src/routes/adminRoutes.js');
        router = routerModule.default;
    });

    it('should export a router', () => {
        expect(router).toBeDefined();
        expect(typeof router).toBe('function');
    });

    describe('Recipe Admin Routes', () => {
        it('should have GET /recipes route', () => {
            const route = router.stack.find(layer => 
                layer.route && layer.route.path === '/recipes' && layer.route.methods.get
            );
            expect(route).toBeDefined();
        });

        it('should have PUT /recipes/:id route', () => {
            const route = router.stack.find(layer => 
                layer.route && layer.route.path === '/recipes/:id' && layer.route.methods.put
            );
            expect(route).toBeDefined();
        });

        it('should have DELETE /recipes/:id route', () => {
            const route = router.stack.find(layer => 
                layer.route && layer.route.path === '/recipes/:id' && layer.route.methods.delete
            );
            expect(route).toBeDefined();
        });
    });

    describe('Category Admin Routes', () => {
        it('should have GET /categories route', () => {
            const route = router.stack.find(layer => 
                layer.route && layer.route.path === '/categories' && layer.route.methods.get
            );
            expect(route).toBeDefined();
        });

        it('should have POST /categories route', () => {
            const route = router.stack.find(layer => 
                layer.route && layer.route.path === '/categories' && layer.route.methods.post
            );
            expect(route).toBeDefined();
        });

        it('should have PUT /categories/:id route', () => {
            const route = router.stack.find(layer => 
                layer.route && layer.route.path === '/categories/:id' && layer.route.methods.put
            );
            expect(route).toBeDefined();
        });

        it('should have DELETE /categories/:id route', () => {
            const route = router.stack.find(layer => 
                layer.route && layer.route.path === '/categories/:id' && layer.route.methods.delete
            );
            expect(route).toBeDefined();
        });
    });

    describe('Media Admin Routes', () => {
        it('should have GET /media route', () => {
            const route = router.stack.find(layer => 
                layer.route && layer.route.path === '/media' && layer.route.methods.get
            );
            expect(route).toBeDefined();
        });

        it('should have POST /media route', () => {
            const route = router.stack.find(layer => 
                layer.route && layer.route.path === '/media' && layer.route.methods.post
            );
            expect(route).toBeDefined();
        });

        it('should have PUT /media/:id route', () => {
            const route = router.stack.find(layer => 
                layer.route && layer.route.path === '/media/:id' && layer.route.methods.put
            );
            expect(route).toBeDefined();
        });

        it('should have DELETE /media/:id route', () => {
            const route = router.stack.find(layer => 
                layer.route && layer.route.path === '/media/:id' && layer.route.methods.delete
            );
            expect(route).toBeDefined();
        });
    });

    describe('User Admin Routes', () => {
        it('should have GET /users route', () => {
            const route = router.stack.find(layer => 
                layer.route && layer.route.path === '/users' && layer.route.methods.get
            );
            expect(route).toBeDefined();
        });

        it('should have PUT /users/:id route', () => {
            const route = router.stack.find(layer => 
                layer.route && layer.route.path === '/users/:id' && layer.route.methods.put
            );
            expect(route).toBeDefined();
        });

        it('should have DELETE /users/:id route', () => {
            const route = router.stack.find(layer => 
                layer.route && layer.route.path === '/users/:id' && layer.route.methods.delete
            );
            expect(route).toBeDefined();
        });
    });

    describe('Stats Route', () => {
        it('should have GET /stats route', () => {
            const route = router.stack.find(layer => 
                layer.route && layer.route.path === '/stats' && layer.route.methods.get
            );
            expect(route).toBeDefined();
        });
    });
});
