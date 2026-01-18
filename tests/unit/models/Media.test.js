/**
 * Media Model - Unit Tests
 */

describe('Media Model', () => {
    let sequelize;
    let Media;

    beforeAll(async () => {
        const db = await import('../../../src/models/index.js');
        sequelize = db.default.sequelize;
        Media = db.default.Media;

        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        await Media.destroy({ where: {}, truncate: true, cascade: true });
    });

    describe('Model Definition', () => {
        it('should have correct table name', () => {
            expect(Media.tableName).toBe('media');
        });

        it('should have required fields', () => {
            const attributes = Media.rawAttributes;
            expect(attributes).toHaveProperty('id');
            expect(attributes).toHaveProperty('title');
            expect(attributes).toHaveProperty('type');
            expect(attributes).toHaveProperty('image_url');
            expect(attributes).toHaveProperty('release_year');
        });
    });

    describe('Validations', () => {
        it('should require title', async () => {
            await expect(Media.create({
                type: 'film'
            })).rejects.toThrow();
        });

        it('should require type', async () => {
            await expect(Media.create({
                title: 'Ratatouille'
            })).rejects.toThrow();
        });

        it('should only accept "film" or "serie" as type', async () => {
            const film = await Media.create({ title: 'Film', type: 'film' });
            expect(film.type).toBe('film');

            const serie = await Media.create({ title: 'Serie', type: 'serie' });
            expect(serie.type).toBe('serie');
        });

        it('should reject invalid type values', async () => {
            await expect(Media.create({
                title: 'Test',
                type: 'documentary' // Invalid
            })).rejects.toThrow();
        });
    });

    describe('Optional Fields', () => {
        it('image_url should be optional', async () => {
            const media = await Media.create({
                title: 'No Image Film',
                type: 'film'
            });
            expect(media.image_url).toBeNull();
        });

        it('release_year should be optional', async () => {
            const media = await Media.create({
                title: 'Unknown Year Film',
                type: 'film'
            });
            expect(media.release_year).toBeNull();
        });
    });

    describe('CRUD Operations', () => {
        it('should create a media item', async () => {
            const media = await Media.create({
                title: 'Ratatouille',
                type: 'film',
                release_year: 2007,
                image_url: 'https://example.com/poster.jpg'
            });

            expect(media.id).toBeDefined();
            expect(media.title).toBe('Ratatouille');
            expect(media.type).toBe('film');
            expect(media.release_year).toBe(2007);
        });

        it('should find media by type', async () => {
            await Media.create({ title: 'Film 1', type: 'film' });
            await Media.create({ title: 'Film 2', type: 'film' });
            await Media.create({ title: 'Serie 1', type: 'serie' });

            const films = await Media.findAll({ where: { type: 'film' } });
            expect(films).toHaveLength(2);

            const series = await Media.findAll({ where: { type: 'serie' } });
            expect(series).toHaveLength(1);
        });
    });
});
