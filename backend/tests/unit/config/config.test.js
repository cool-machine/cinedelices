/**
 * Config - Unit Tests
 */

describe('Config', () => {
    it('should expose environment configs', async () => {
        const { default: config } = await import('../../../src/config/config.js');

        expect(config).toHaveProperty('development');
        expect(config).toHaveProperty('test');
        expect(config).toHaveProperty('production');
    });
});
