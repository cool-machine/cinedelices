/**
 * Recipe Model - Unit Tests
 * Following TDD: These tests define the expected behavior
 */

describe('Recipe Model', () => {
    let sequelize;
    let Recipe, User, Category, Media;

    beforeAll(async () => {
        const db = await import('../../../src/models/index.js');
        sequelize = db.default.sequelize;
        Recipe = db.default.Recipe;
        User = db.default.User;
        Category = db.default.Category;
        Media = db.default.Media;

        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    let testUser, testCategory, testMedia;

    beforeEach(async () => {
        // Create required associations
        testUser = await User.create({
            email: `user${Date.now()}@test.com`,
            password_hash: 'hash',
            username: `user${Date.now()}`
        });

        testCategory = await Category.create({
            name: `Category ${Date.now()}`,
            description: 'Test category'
        });

        testMedia = await Media.create({
            title: `Film ${Date.now()}`,
            type: 'film',
            release_year: 2024
        });
    });

    afterEach(async () => {
        await Recipe.destroy({ where: {}, truncate: true, cascade: true });
        await Media.destroy({ where: {}, truncate: true, cascade: true });
        await Category.destroy({ where: {}, truncate: true, cascade: true });
        await User.destroy({ where: {}, truncate: true, cascade: true });
    });

    describe('Model Definition', () => {
        it('should have correct table name', () => {
            expect(Recipe.tableName).toBe('recipes');
        });

        it('should have all required fields', () => {
            const attributes = Recipe.rawAttributes;
            expect(attributes).toHaveProperty('title');
            expect(attributes).toHaveProperty('description');
            expect(attributes).toHaveProperty('ingredients');
            expect(attributes).toHaveProperty('instructions');
            expect(attributes).toHaveProperty('anecdote');
            expect(attributes).toHaveProperty('difficulty');
            expect(attributes).toHaveProperty('prep_time');
            expect(attributes).toHaveProperty('cook_time');
            expect(attributes).toHaveProperty('image_url');
            expect(attributes).toHaveProperty('user_id');
            expect(attributes).toHaveProperty('category_id');
            expect(attributes).toHaveProperty('media_id');
        });
    });

    describe('Validations', () => {
        it('should require title', async () => {
            await expect(Recipe.create({
                ingredients: 'ingredients',
                instructions: 'instructions',
                user_id: testUser.id
            })).rejects.toThrow();
        });

        it('should require ingredients', async () => {
            await expect(Recipe.create({
                title: 'Test Recipe',
                instructions: 'instructions',
                user_id: testUser.id
            })).rejects.toThrow();
        });

        it('should require instructions', async () => {
            await expect(Recipe.create({
                title: 'Test Recipe',
                ingredients: 'ingredients',
                user_id: testUser.id
            })).rejects.toThrow();
        });

        it('should require user_id', async () => {
            await expect(Recipe.create({
                title: 'Test Recipe',
                ingredients: 'ingredients',
                instructions: 'instructions'
            })).rejects.toThrow();
        });

        it('should accept valid difficulty values', async () => {
            const validDifficulties = ['facile', 'moyen', 'difficile'];

            for (const difficulty of validDifficulties) {
                const recipe = await Recipe.create({
                    title: `Recipe ${difficulty}`,
                    ingredients: 'ingredients',
                    instructions: 'instructions',
                    difficulty,
                    user_id: testUser.id
                });
                expect(recipe.difficulty).toBe(difficulty);
            }
        });
    });

    describe('Default Values', () => {
        it('should default difficulty to "moyen"', async () => {
            const recipe = await Recipe.create({
                title: 'Test Recipe',
                ingredients: 'ingredients',
                instructions: 'instructions',
                user_id: testUser.id
            });
            expect(recipe.difficulty).toBe('moyen');
        });
    });

    describe('Instance Methods', () => {
        it('getTotalTime() should return prep_time + cook_time', async () => {
            const recipe = await Recipe.create({
                title: 'Test Recipe',
                ingredients: 'ingredients',
                instructions: 'instructions',
                prep_time: 15,
                cook_time: 30,
                user_id: testUser.id
            });
            expect(recipe.getTotalTime()).toBe(45);
        });

        it('getTotalTime() should handle null values', async () => {
            const recipe = await Recipe.create({
                title: 'Test Recipe',
                ingredients: 'ingredients',
                instructions: 'instructions',
                user_id: testUser.id
            });
            expect(recipe.getTotalTime()).toBe(0);
        });

        it('getTotalTime() should handle partial values', async () => {
            const recipe = await Recipe.create({
                title: 'Test Recipe',
                ingredients: 'ingredients',
                instructions: 'instructions',
                prep_time: 20,
                user_id: testUser.id
            });
            expect(recipe.getTotalTime()).toBe(20);
        });
    });

    describe('Associations', () => {
        it('should belong to a User (author)', async () => {
            const recipe = await Recipe.create({
                title: 'Test Recipe',
                ingredients: 'ingredients',
                instructions: 'instructions',
                user_id: testUser.id
            });

            const recipeWithAuthor = await Recipe.findByPk(recipe.id, {
                include: [{ model: User, as: 'author' }]
            });

            expect(recipeWithAuthor.author).toBeDefined();
            expect(recipeWithAuthor.author.id).toBe(testUser.id);
        });

        it('should belong to a Category', async () => {
            const recipe = await Recipe.create({
                title: 'Test Recipe',
                ingredients: 'ingredients',
                instructions: 'instructions',
                user_id: testUser.id,
                category_id: testCategory.id
            });

            const recipeWithCategory = await Recipe.findByPk(recipe.id, {
                include: [{ model: Category, as: 'category' }]
            });

            expect(recipeWithCategory.category).toBeDefined();
            expect(recipeWithCategory.category.id).toBe(testCategory.id);
        });

        it('should belong to a Media', async () => {
            const recipe = await Recipe.create({
                title: 'Test Recipe',
                ingredients: 'ingredients',
                instructions: 'instructions',
                user_id: testUser.id,
                media_id: testMedia.id
            });

            const recipeWithMedia = await Recipe.findByPk(recipe.id, {
                include: [{ model: Media, as: 'media' }]
            });

            expect(recipeWithMedia.media).toBeDefined();
            expect(recipeWithMedia.media.id).toBe(testMedia.id);
        });

        it('category_id should be optional (nullable)', async () => {
            const recipe = await Recipe.create({
                title: 'Test Recipe',
                ingredients: 'ingredients',
                instructions: 'instructions',
                user_id: testUser.id
            });
            expect(recipe.category_id).toBeNull();
        });

        it('media_id should be optional (nullable)', async () => {
            const recipe = await Recipe.create({
                title: 'Test Recipe',
                ingredients: 'ingredients',
                instructions: 'instructions',
                user_id: testUser.id
            });
            expect(recipe.media_id).toBeNull();
        });
    });

    describe('Cascade Delete', () => {
        it('should delete recipes when user is deleted', async () => {
            const deleteTestUser = await User.create({
                email: `deletetest${Date.now()}@test.com`,
                password_hash: 'hash',
                username: `deletetest${Date.now()}`
            });

            const recipe = await Recipe.create({
                title: 'Test Recipe for Delete',
                ingredients: 'ingredients',
                instructions: 'instructions',
                user_id: deleteTestUser.id
            });

            const recipeId = recipe.id;

            // Delete user - should cascade to recipe
            await deleteTestUser.destroy();

            const deletedRecipe = await Recipe.findByPk(recipeId);
            expect(deletedRecipe).toBeNull();
        });
    });
});
