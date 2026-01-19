/**
 * Admin Controller - Unit Tests
 */

import { jest } from '@jest/globals';

const userCount = jest.fn();
const recipeCount = jest.fn();
const categoryCount = jest.fn();
const mediaCount = jest.fn();

const userFindAll = jest.fn();
const userFindByPk = jest.fn();

const recipeFindAll = jest.fn();
const recipeFindByPk = jest.fn();

const categoryFindAll = jest.fn();
const categoryFindByPk = jest.fn();
const categoryCreate = jest.fn();

const mediaFindAll = jest.fn();
const mediaFindByPk = jest.fn();
const mediaCreate = jest.fn();

jest.unstable_mockModule('../../../src/models/index.js', () => ({
    default: {
        User: {
            count: userCount,
            findAll: userFindAll,
            findByPk: userFindByPk
        },
        Recipe: {
            count: recipeCount,
            findAll: recipeFindAll,
            findByPk: recipeFindByPk
        },
        Category: {
            count: categoryCount,
            findAll: categoryFindAll,
            findByPk: categoryFindByPk,
            create: categoryCreate
        },
        Media: {
            count: mediaCount,
            findAll: mediaFindAll,
            findByPk: mediaFindByPk,
            create: mediaCreate
        }
    }
}));

let adminController;

const buildRes = () => ({
    status: jest.fn().mockReturnThis(),
    render: jest.fn(),
    redirect: jest.fn()
});

describe('Admin Controller', () => {
    beforeAll(async () => {
        adminController = await import('../../../src/controllers/adminController.js');
    });

    beforeEach(() => {
        userCount.mockReset();
        recipeCount.mockReset();
        categoryCount.mockReset();
        mediaCount.mockReset();
        userFindAll.mockReset();
        userFindByPk.mockReset();
        recipeFindAll.mockReset();
        recipeFindByPk.mockReset();
        categoryFindAll.mockReset();
        categoryFindByPk.mockReset();
        categoryCreate.mockReset();
        mediaFindAll.mockReset();
        mediaFindByPk.mockReset();
        mediaCreate.mockReset();
    });

    describe('getDashboard', () => {
        it('should render dashboard with stats', async () => {
            userCount.mockResolvedValue(2);
            recipeCount.mockResolvedValue(4);
            categoryCount.mockResolvedValue(3);
            mediaCount.mockResolvedValue(1);

            const req = {};
            const res = buildRes();

            await adminController.getDashboard(req, res);

            expect(res.render).toHaveBeenCalledWith('admin/dashboard', {
                title: 'Admin - Dashboard',
                layout: 'layouts/admin',
                stats: {
                    users: 2,
                    recipes: 4,
                    categories: 3,
                    media: 1
                }
            });
        });

        it('should render 500 on error', async () => {
            userCount.mockRejectedValue(new Error('DB error'));

            const req = {};
            const res = buildRes();

            await adminController.getDashboard(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('getAdminRecipesPage', () => {
        it('should render recipes list', async () => {
            recipeFindAll.mockResolvedValue([{ id: 1, title: 'Recipe' }]);

            const req = {};
            const res = buildRes();

            await adminController.getAdminRecipesPage(req, res);

            expect(recipeFindAll).toHaveBeenCalledTimes(1);
            expect(res.render).toHaveBeenCalledWith('admin/recipes/index', {
                title: 'Admin - Recettes',
                layout: 'layouts/admin',
                recipes: [{ id: 1, title: 'Recipe' }]
            });
        });

        it('should render 500 on error', async () => {
            recipeFindAll.mockRejectedValue(new Error('DB error'));

            const req = {};
            const res = buildRes();

            await adminController.getAdminRecipesPage(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('getAdminEditRecipePage', () => {
        it('should render edit page with recipe data', async () => {
            const recipe = { id: 1, title: 'Recipe' };
            recipeFindByPk.mockResolvedValue(recipe);
            categoryFindAll.mockResolvedValue([{ id: 1, name: 'Dessert' }]);
            mediaFindAll.mockResolvedValue([{ id: 1, title: 'Movie' }]);

            const req = { params: { id: 1 } };
            const res = buildRes();

            await adminController.getAdminEditRecipePage(req, res);

            expect(res.render).toHaveBeenCalledWith('admin/recipes/edit', {
                title: 'Admin - Modifier Recipe',
                layout: 'layouts/admin',
                recipe,
                categories: [{ id: 1, name: 'Dessert' }],
                mediaList: [{ id: 1, title: 'Movie' }]
            });
        });

        it('should render 404 when recipe is missing', async () => {
            recipeFindByPk.mockResolvedValue(null);

            const req = { params: { id: 999 } };
            const res = buildRes();

            await adminController.getAdminEditRecipePage(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.render).toHaveBeenCalledWith('404', { title: 'Recette introuvable' });
        });

        it('should render 500 on error', async () => {
            recipeFindByPk.mockRejectedValue(new Error('DB error'));

            const req = { params: { id: 1 } };
            const res = buildRes();

            await adminController.getAdminEditRecipePage(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('updateAdminRecipe', () => {
        it('should render 404 when recipe is missing', async () => {
            recipeFindByPk.mockResolvedValue(null);

            const req = { params: { id: 999 }, body: {} };
            const res = buildRes();

            await adminController.updateAdminRecipe(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.render).toHaveBeenCalledWith('404', { title: 'Recette introuvable' });
        });

        it('should update recipe and redirect', async () => {
            const recipe = {
                title: 'Old',
                description: 'Old desc',
                ingredients: 'Old ing',
                instructions: 'Old inst',
                category_id: 3,
                media_id: 4,
                difficulty: 'moyen',
                prep_time: 10,
                cook_time: 20,
                image_url: 'old.jpg',
                update: jest.fn().mockResolvedValue()
            };
            recipeFindByPk.mockResolvedValue(recipe);

            const req = {
                params: { id: 1 },
                body: {
                    title: 'New',
                    description: 'New desc',
                    ingredients: 'New ing',
                    instructions: 'New inst',
                    category_id: '',
                    media_id: '',
                    difficulty: '',
                    prep_time: 5,
                    cook_time: 6,
                    image_url: 'new.jpg'
                }
            };
            const res = buildRes();

            await adminController.updateAdminRecipe(req, res);

            expect(recipe.update).toHaveBeenCalledWith({
                title: 'New',
                description: 'New desc',
                ingredients: 'New ing',
                instructions: 'New inst',
                category_id: null,
                media_id: null,
                difficulty: 'moyen',
                prep_time: 5,
                cook_time: 6,
                image_url: 'new.jpg'
            });
            expect(res.redirect).toHaveBeenCalledWith('/admin/recipes');
        });

        it('should keep existing recipe values when fields are missing', async () => {
            const recipe = {
                title: 'Old',
                description: 'Old desc',
                ingredients: 'Old ing',
                instructions: 'Old inst',
                category_id: 3,
                media_id: 4,
                difficulty: 'moyen',
                prep_time: 10,
                cook_time: 20,
                image_url: 'old.jpg',
                update: jest.fn().mockResolvedValue()
            };
            recipeFindByPk.mockResolvedValue(recipe);

            const req = { params: { id: 1 }, body: { prep_time: 15 } };
            const res = buildRes();

            await adminController.updateAdminRecipe(req, res);

            expect(recipe.update).toHaveBeenCalledWith({
                title: 'Old',
                description: 'Old desc',
                ingredients: 'Old ing',
                instructions: 'Old inst',
                category_id: 3,
                media_id: 4,
                difficulty: 'moyen',
                prep_time: 15,
                cook_time: 20,
                image_url: 'old.jpg'
            });
            expect(res.redirect).toHaveBeenCalledWith('/admin/recipes');
        });

        it('should render 500 on error', async () => {
            recipeFindByPk.mockRejectedValue(new Error('DB error'));

            const req = { params: { id: 1 }, body: {} };
            const res = buildRes();

            await adminController.updateAdminRecipe(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('deleteAdminRecipe', () => {
        it('should render 404 when recipe is missing', async () => {
            recipeFindByPk.mockResolvedValue(null);

            const req = { params: { id: 999 } };
            const res = buildRes();

            await adminController.deleteAdminRecipe(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.render).toHaveBeenCalledWith('404', { title: 'Recette introuvable' });
        });

        it('should render 500 on error', async () => {
            recipeFindByPk.mockRejectedValue(new Error('DB error'));

            const req = { params: { id: 1 } };
            const res = buildRes();

            await adminController.deleteAdminRecipe(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('getAdminCategoriesPage', () => {
        it('should render categories list', async () => {
            categoryFindAll.mockResolvedValue([{ id: 1, name: 'Dessert' }]);

            const req = {};
            const res = buildRes();

            await adminController.getAdminCategoriesPage(req, res);

            expect(categoryFindAll).toHaveBeenCalledTimes(1);
            expect(res.render).toHaveBeenCalledWith('admin/categories/index', {
                title: 'Admin - Catégories',
                layout: 'layouts/admin',
                categories: [{ id: 1, name: 'Dessert' }]
            });
        });

        it('should render 500 on error', async () => {
            categoryFindAll.mockRejectedValue(new Error('DB error'));

            const req = {};
            const res = buildRes();

            await adminController.getAdminCategoriesPage(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('createAdminCategory', () => {
        it('should create category and redirect', async () => {
            categoryCreate.mockResolvedValue({ id: 1 });

            const req = { body: { name: 'Dessert', description: '' } };
            const res = buildRes();

            await adminController.createAdminCategory(req, res);

            expect(categoryCreate).toHaveBeenCalledWith({ name: 'Dessert', description: null });
            expect(res.redirect).toHaveBeenCalledWith('/admin/categories');
        });

        it('should render 500 on error', async () => {
            categoryCreate.mockRejectedValue(new Error('DB error'));

            const req = { body: { name: 'Dessert', description: '' } };
            const res = buildRes();

            await adminController.createAdminCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('getAdminEditCategoryPage', () => {
        it('should render 404 when category is missing', async () => {
            categoryFindByPk.mockResolvedValue(null);

            const req = { params: { id: 999 } };
            const res = buildRes();

            await adminController.getAdminEditCategoryPage(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.render).toHaveBeenCalledWith('404', { title: 'Catégorie introuvable' });
        });

        it('should render 500 on error', async () => {
            categoryFindByPk.mockRejectedValue(new Error('DB error'));

            const req = { params: { id: 1 } };
            const res = buildRes();

            await adminController.getAdminEditCategoryPage(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('updateAdminCategory', () => {
        it('should render 404 when category is missing', async () => {
            categoryFindByPk.mockResolvedValue(null);

            const req = { params: { id: 999 }, body: {} };
            const res = buildRes();

            await adminController.updateAdminCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.render).toHaveBeenCalledWith('404', { title: 'Catégorie introuvable' });
        });

        it('should update category and redirect', async () => {
            const category = { name: 'Old', description: 'Old desc', update: jest.fn().mockResolvedValue() };
            categoryFindByPk.mockResolvedValue(category);

            const req = { params: { id: 1 }, body: { name: 'New' } };
            const res = buildRes();

            await adminController.updateAdminCategory(req, res);

            expect(category.update).toHaveBeenCalledWith({
                name: 'New',
                description: 'Old desc'
            });
            expect(res.redirect).toHaveBeenCalledWith('/admin/categories');
        });

        it('should keep existing name when name is missing', async () => {
            const category = { name: 'Old', description: 'Old desc', update: jest.fn().mockResolvedValue() };
            categoryFindByPk.mockResolvedValue(category);

            const req = { params: { id: 1 }, body: { description: 'New desc' } };
            const res = buildRes();

            await adminController.updateAdminCategory(req, res);

            expect(category.update).toHaveBeenCalledWith({
                name: 'Old',
                description: 'New desc'
            });
            expect(res.redirect).toHaveBeenCalledWith('/admin/categories');
        });

        it('should render 500 on error', async () => {
            categoryFindByPk.mockRejectedValue(new Error('DB error'));

            const req = { params: { id: 1 }, body: {} };
            const res = buildRes();

            await adminController.updateAdminCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('deleteAdminCategory', () => {
        it('should render 404 when category is missing', async () => {
            categoryFindByPk.mockResolvedValue(null);

            const req = { params: { id: 999 } };
            const res = buildRes();

            await adminController.deleteAdminCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.render).toHaveBeenCalledWith('404', { title: 'Catégorie introuvable' });
        });

        it('should render 500 on error', async () => {
            categoryFindByPk.mockRejectedValue(new Error('DB error'));

            const req = { params: { id: 1 } };
            const res = buildRes();

            await adminController.deleteAdminCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('getAdminUsersPage', () => {
        it('should render users list', async () => {
            userFindAll.mockResolvedValue([{ id: 1, username: 'User' }]);

            const req = {};
            const res = buildRes();

            await adminController.getAdminUsersPage(req, res);

            expect(userFindAll).toHaveBeenCalledTimes(1);
            expect(res.render).toHaveBeenCalledWith('admin/users/index', {
                title: 'Admin - Utilisateurs',
                layout: 'layouts/admin',
                users: [{ id: 1, username: 'User' }]
            });
        });

        it('should render 500 on error', async () => {
            userFindAll.mockRejectedValue(new Error('DB error'));

            const req = {};
            const res = buildRes();

            await adminController.getAdminUsersPage(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('getAdminEditUserPage', () => {
        it('should render 404 when user is missing', async () => {
            userFindByPk.mockResolvedValue(null);

            const req = { params: { id: 999 } };
            const res = buildRes();

            await adminController.getAdminEditUserPage(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.render).toHaveBeenCalledWith('404', { title: 'Utilisateur introuvable' });
        });

        it('should render 500 on error', async () => {
            userFindByPk.mockRejectedValue(new Error('DB error'));

            const req = { params: { id: 1 } };
            const res = buildRes();

            await adminController.getAdminEditUserPage(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('updateAdminUser', () => {
        it('should render 404 when user is missing', async () => {
            userFindByPk.mockResolvedValue(null);

            const req = { params: { id: 999 }, body: {} };
            const res = buildRes();

            await adminController.updateAdminUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.render).toHaveBeenCalledWith('404', { title: 'Utilisateur introuvable' });
        });

        it('should update user and redirect', async () => {
            const user = {
                username: 'Old',
                email: 'old@test.com',
                role: 'user',
                bio: 'bio',
                avatar_url: 'avatar',
                update: jest.fn().mockResolvedValue()
            };
            userFindByPk.mockResolvedValue(user);

            const req = { params: { id: 1 }, body: { username: 'New', role: 'admin' } };
            const res = buildRes();

            await adminController.updateAdminUser(req, res);

            expect(user.update).toHaveBeenCalledWith({
                username: 'New',
                email: 'old@test.com',
                role: 'admin',
                bio: 'bio',
                avatar_url: 'avatar'
            });
            expect(res.redirect).toHaveBeenCalledWith('/admin/users');
        });

        it('should keep existing username and role when missing', async () => {
            const user = {
                username: 'Old',
                email: 'old@test.com',
                role: 'user',
                bio: 'bio',
                avatar_url: 'avatar',
                update: jest.fn().mockResolvedValue()
            };
            userFindByPk.mockResolvedValue(user);

            const req = { params: { id: 1 }, body: { email: 'new@test.com' } };
            const res = buildRes();

            await adminController.updateAdminUser(req, res);

            expect(user.update).toHaveBeenCalledWith({
                username: 'Old',
                email: 'new@test.com',
                role: 'user',
                bio: 'bio',
                avatar_url: 'avatar'
            });
            expect(res.redirect).toHaveBeenCalledWith('/admin/users');
        });

        it('should render 500 on error', async () => {
            userFindByPk.mockRejectedValue(new Error('DB error'));

            const req = { params: { id: 1 }, body: {} };
            const res = buildRes();

            await adminController.updateAdminUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('deleteAdminUser', () => {
        it('should render 404 when user is missing', async () => {
            userFindByPk.mockResolvedValue(null);

            const req = { params: { id: 999 } };
            const res = buildRes();

            await adminController.deleteAdminUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.render).toHaveBeenCalledWith('404', { title: 'Utilisateur introuvable' });
        });

        it('should render 500 on error', async () => {
            userFindByPk.mockRejectedValue(new Error('DB error'));

            const req = { params: { id: 1 } };
            const res = buildRes();

            await adminController.deleteAdminUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('getAdminMediaPage', () => {
        it('should render media list', async () => {
            mediaFindAll.mockResolvedValue([{ id: 1, title: 'Movie' }]);

            const req = {};
            const res = buildRes();

            await adminController.getAdminMediaPage(req, res);

            expect(mediaFindAll).toHaveBeenCalledTimes(1);
            expect(res.render).toHaveBeenCalledWith('admin/media/index', {
                title: 'Admin - Médias',
                layout: 'layouts/admin',
                mediaList: [{ id: 1, title: 'Movie' }]
            });
        });

        it('should render 500 on error', async () => {
            mediaFindAll.mockRejectedValue(new Error('DB error'));

            const req = {};
            const res = buildRes();

            await adminController.getAdminMediaPage(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('createAdminMedia', () => {
        it('should create media and redirect', async () => {
            mediaCreate.mockResolvedValue({ id: 1 });

            const req = { body: { title: 'Movie', type: 'film', image_url: '', release_year: '' } };
            const res = buildRes();

            await adminController.createAdminMedia(req, res);

            expect(mediaCreate).toHaveBeenCalledWith({
                title: 'Movie',
                type: 'film',
                image_url: null,
                release_year: null
            });
            expect(res.redirect).toHaveBeenCalledWith('/admin/media');
        });

        it('should render 500 on error', async () => {
            mediaCreate.mockRejectedValue(new Error('DB error'));

            const req = { body: { title: 'Movie', type: 'film', image_url: '', release_year: '' } };
            const res = buildRes();

            await adminController.createAdminMedia(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('getAdminEditMediaPage', () => {
        it('should render 404 when media is missing', async () => {
            mediaFindByPk.mockResolvedValue(null);

            const req = { params: { id: 999 } };
            const res = buildRes();

            await adminController.getAdminEditMediaPage(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.render).toHaveBeenCalledWith('404', { title: 'Média introuvable' });
        });

        it('should render 500 on error', async () => {
            mediaFindByPk.mockRejectedValue(new Error('DB error'));

            const req = { params: { id: 1 } };
            const res = buildRes();

            await adminController.getAdminEditMediaPage(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('updateAdminMedia', () => {
        it('should render 404 when media is missing', async () => {
            mediaFindByPk.mockResolvedValue(null);

            const req = { params: { id: 999 }, body: {} };
            const res = buildRes();

            await adminController.updateAdminMedia(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.render).toHaveBeenCalledWith('404', { title: 'Média introuvable' });
        });

        it('should update media and redirect', async () => {
            const media = {
                title: 'Old',
                type: 'film',
                image_url: 'old.jpg',
                release_year: 2020,
                update: jest.fn().mockResolvedValue()
            };
            mediaFindByPk.mockResolvedValue(media);

            const req = { params: { id: 1 }, body: { title: 'New', type: 'serie' } };
            const res = buildRes();

            await adminController.updateAdminMedia(req, res);

            expect(media.update).toHaveBeenCalledWith({
                title: 'New',
                type: 'serie',
                image_url: 'old.jpg',
                release_year: 2020
            });
            expect(res.redirect).toHaveBeenCalledWith('/admin/media');
        });

        it('should keep existing title and type when missing', async () => {
            const media = {
                title: 'Old',
                type: 'film',
                image_url: 'old.jpg',
                release_year: 2020,
                update: jest.fn().mockResolvedValue()
            };
            mediaFindByPk.mockResolvedValue(media);

            const req = { params: { id: 1 }, body: { release_year: 2021 } };
            const res = buildRes();

            await adminController.updateAdminMedia(req, res);

            expect(media.update).toHaveBeenCalledWith({
                title: 'Old',
                type: 'film',
                image_url: 'old.jpg',
                release_year: 2021
            });
            expect(res.redirect).toHaveBeenCalledWith('/admin/media');
        });

        it('should render 500 on error', async () => {
            mediaFindByPk.mockRejectedValue(new Error('DB error'));

            const req = { params: { id: 1 }, body: {} };
            const res = buildRes();

            await adminController.updateAdminMedia(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });

    describe('deleteAdminMedia', () => {
        it('should render 404 when media is missing', async () => {
            mediaFindByPk.mockResolvedValue(null);

            const req = { params: { id: 999 } };
            const res = buildRes();

            await adminController.deleteAdminMedia(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.render).toHaveBeenCalledWith('404', { title: 'Média introuvable' });
        });

        it('should render 500 on error', async () => {
            mediaFindByPk.mockRejectedValue(new Error('DB error'));

            const req = { params: { id: 1 } };
            const res = buildRes();

            await adminController.deleteAdminMedia(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.render).toHaveBeenCalledWith('500', {
                title: 'Erreur Serveur',
                error: 'DB error'
            });
        });
    });
});
