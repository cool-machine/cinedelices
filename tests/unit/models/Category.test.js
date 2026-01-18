/**
 * Category Model - Unit Tests
 */

describe('Category Model', () => {
    let sequelize;
    let Category;

    beforeAll(async () => {
        const db = await import('../../../src/models/index.js');
        sequelize = db.default.sequelize;
        Category = db.default.Category;

        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        await Category.destroy({ where: {}, truncate: true, cascade: true });
    });

    describe('Model Definition', () => {
        it('should have correct table name', () => {
            expect(Category.tableName).toBe('categories');
        });

        it('should have required fields', () => {
            const attributes = Category.rawAttributes;
            expect(attributes).toHaveProperty('id');
            expect(attributes).toHaveProperty('name');
            expect(attributes).toHaveProperty('description');
        });
    });

    describe('Validations', () => {
        it('should require name', async () => {
            await expect(Category.create({
                description: 'A category without name'
            })).rejects.toThrow();
        });

        it('should require unique name', async () => {
            await Category.create({ name: 'Dessert' });
            await expect(Category.create({ name: 'Dessert' })).rejects.toThrow();
        });
    });

    describe('Optional Fields', () => {
        it('description should be optional', async () => {
            const category = await Category.create({ name: 'Test Category' });
            expect(category.description).toBeNull();
        });
    });

    describe('CRUD Operations', () => {
        it('should create a category', async () => {
            const category = await Category.create({
                name: 'Plat Principal',
                description: 'Main dishes'
            });
            expect(category.id).toBeDefined();
            expect(category.name).toBe('Plat Principal');
        });

        it('should find all categories', async () => {
            await Category.create({ name: 'Entrée' });
            await Category.create({ name: 'Plat' });
            await Category.create({ name: 'Dessert' });

            const categories = await Category.findAll();
            expect(categories).toHaveLength(3);
        });
    });
});
