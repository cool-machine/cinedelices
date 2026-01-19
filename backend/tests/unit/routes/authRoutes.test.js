/**
 * Auth Routes - Unit Tests
 */

import { jest } from '@jest/globals';

describe('Auth Routes', () => {
    let router;

    beforeAll(async () => {
        const routerModule = await import('../../../src/routes/authRoutes.js');
        router = routerModule.default;
    });

    it('should export a router', () => {
        expect(router).toBeDefined();
        expect(typeof router).toBe('function');
    });

    it('should have POST /register route', () => {
        const registerRoute = router.stack.find(layer => 
            layer.route && layer.route.path === '/register' && layer.route.methods.post
        );
        expect(registerRoute).toBeDefined();
    });

    it('should have POST /login route', () => {
        const loginRoute = router.stack.find(layer => 
            layer.route && layer.route.path === '/login' && layer.route.methods.post
        );
        expect(loginRoute).toBeDefined();
    });

    it('should have GET /me route', () => {
        const meRoute = router.stack.find(layer => 
            layer.route && layer.route.path === '/me' && layer.route.methods.get
        );
        expect(meRoute).toBeDefined();
    });

    it('should have POST /logout route', () => {
        const logoutRoute = router.stack.find(layer => 
            layer.route && layer.route.path === '/logout' && layer.route.methods.post
        );
        expect(logoutRoute).toBeDefined();
    });
});
