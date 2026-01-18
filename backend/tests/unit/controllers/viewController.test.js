/**
 * View Controller - Unit Tests
 */

import { jest } from '@jest/globals';

const iLike = 'iLike';

const recipeFindOne = jest.fn();
const recipeFindAll = jest.fn();
const recipeFindByPk = jest.fn();
const recipeCreate = jest.fn();

const userFindOne = jest.fn();
const userFindByPk = jest.fn();
const userCreate = jest.fn();

const categoryFindAll = jest.fn();
const mediaFindAll = jest.fn();

const favoriteFindOne = jest.fn();
const favoriteFindAll = jest.fn();
const favoriteCreate = jest.fn();

const ratingFindOrCreate = jest.fn();
const reviewCreate = jest.fn();

const argonVerify = jest.fn();
const argonHash = jest.fn();
const generateToken = jest.fn();

jest.unstable_mockModule('../../../src/models/index.js', () => ({
    default: {
        Sequelize: { Op: { iLike } },
        Recipe: {
            findOne: recipeFindOne,
            findAll: recipeFindAll,
            findByPk: recipeFindByPk,
            create: recipeCreate
        },
        User: {
            findOne: userFindOne,
            findByPk: userFindByPk,
            create: userCreate
        },
        Category: { findAll: categoryFindAll },
        Media: { findAll: mediaFindAll },
        Favorite: {
            findOne: favoriteFindOne,
            findAll: favoriteFindAll,
            create: favoriteCreate
        },
        Rating: { findOrCreate: ratingFindOrCreate },
        Review: { create: reviewCreate }
    }
}));

jest.unstable_mockModule('argon2', () => ({
    default: {
        verify: argonVerify,
        hash: argonHash
    }
}));

jest.unstable_mockModule('../../../src/utils/jwt.js', () => ({
    generateToken
}));

let viewController;

const buildRes = () => ({
    status: jest.fn().mockReturnThis(),
    render: jest.fn(),
    redirect: jest.fn(),
    json: jest.fn(),
    cookie: jest.fn(),
    clearCookie: jest.fn()
});

describe('View Controller', () => {
    beforeAll(async () => {
        viewController = await import('../../../src/controllers/viewController.js');
    });

    beforeEach(() => {
        recipeFindOne.mockReset();
        recipeFindAll.mockReset();
        recipeFindByPk.mockReset();
        recipeCreate.mockReset();
        userFindOne.mockReset();
        userFindByPk.mockReset();
        userCreate.mockReset();
        categoryFindAll.mockReset();
        mediaFindAll.mockReset();
        favoriteFindOne.mockReset();
        favoriteFindAll.mockReset();
        favoriteCreate.mockReset();
        ratingFindOrCreate.mockReset();
        reviewCreate.mockReset();
        argonVerify.mockReset();
        argonHash.mockReset();
        generateToken.mockReset();
    });

    describe('getHomePage', () => {
        it('should render home with featured and latest recipes', async () => {
            recipeFindOne.mockResolvedValue({ id: 1, title: 'Featured' });
            recipeFindAll.mockResolvedValue([{ id: 2, title: 'Latest' }]);

            const req = {};
            const res = buildRes();

            await viewController.getHomePage(req, res);

            expect(res.render).toHaveBeenCalledWith('home', {
                title: 'CinéDélices - Accueil',
                featuredRecipe: { id: 1, title: 'Featured' },
                recipes: [{ id: 2, title: 'Latest' }]
            });
        });
    });

    describe('getRecipesPage', () => {
        it('should render recipes with filters and lists', async () => {
            recipeFindAll.mockResolvedValue([{ id: 1, title: 'Recipe' }]);
            categoryFindAll.mockResolvedValue([{ id: 1, name: 'Dessert' }]);
            mediaFindAll.mockResolvedValue([{ id: 1, title: 'Movie' }]);

            const req = { query: { search: 'cake', category: '1', media: '2' } };
            const res = buildRes();

            await viewController.getRecipesPage(req, res);

            const findAllArgs = recipeFindAll.mock.calls[0][0];
            expect(findAllArgs.where.title[iLike]).toBe('%cake%');
            expect(findAllArgs.where.category_id).toBe('1');
            expect(findAllArgs.where.media_id).toBe('2');

            expect(res.render).toHaveBeenCalledWith('recipes/index', {
                title: 'Nos Recettes - CinéDélices',
                recipes: [{ id: 1, title: 'Recipe' }],
                categories: [{ id: 1, name: 'Dessert' }],
                mediaList: [{ id: 1, title: 'Movie' }],
                search: 'cake',
                selectedCategory: '1',
                selectedMedia: '2'
            });
        });
    });

    describe('getRecipeDetailPage', () => {
        it('should render 404 when recipe missing', async () => {
            recipeFindByPk.mockResolvedValue(null);

            const req = { params: { id: 99 } };
            const res = buildRes();

            await viewController.getRecipeDetailPage(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.render).toHaveBeenCalledWith('404', { title: 'Recette introuvable' });
        });

        it('should render recipe detail with rating and favorite', async () => {
            const recipe = {
                id: 1,
                title: 'Recipe',
                ratings: [
                    { stars: 4, user_id: 2 },
                    { stars: 2, user_id: 1 }
                ]
            };
            recipeFindByPk.mockResolvedValue(recipe);
            favoriteFindOne.mockResolvedValue({ id: 1 });

            const req = { params: { id: 1 }, user: { id: 1 } };
            const res = buildRes();

            await viewController.getRecipeDetailPage(req, res);

            expect(res.render).toHaveBeenCalledWith('recipes/show', {
                title: 'Recipe - CinéDélices',
                recipe,
                averageRating: '3.0',
                userRating: { stars: 2, user_id: 1 },
                ratingCount: 2,
                isFavorited: true
            });
        });
    });

    describe('handleLogin', () => {
        it('should render error when user not found', async () => {
            userFindOne.mockResolvedValue(null);

            const req = { body: { email: 'test@test.com', password: 'pass' } };
            const res = buildRes();

            await viewController.handleLogin(req, res);

            expect(res.render).toHaveBeenCalledWith('auth/login', {
                title: 'Connexion - CinéDélices',
                error: 'Email ou mot de passe incorrect'
            });
        });

        it('should redirect to profile edit when profile incomplete', async () => {
            const user = { id: 1, email: 'a@a.com', role: 'user', password_hash: 'hash' };
            userFindOne.mockResolvedValue(user);
            argonVerify.mockResolvedValue(true);
            generateToken.mockReturnValue('token');

            const req = { body: { email: 'a@a.com', password: 'pass' } };
            const res = buildRes();

            await viewController.handleLogin(req, res);

            expect(res.cookie).toHaveBeenCalledWith('token', 'token', expect.any(Object));
            expect(res.redirect).toHaveBeenCalledWith('/profile/edit');
        });
    });

    describe('handleRegister', () => {
        it('should render error when email already exists', async () => {
            userFindOne.mockResolvedValue({ id: 1 });

            const req = { body: { username: 'u', email: 'a@a.com', password: 'pass' } };
            const res = buildRes();

            await viewController.handleRegister(req, res);

            expect(res.render).toHaveBeenCalledWith('auth/register', {
                title: 'Inscription - CinéDélices',
                error: 'Cet email est déjà utilisé'
            });
        });

        it('should create user and redirect to login', async () => {
            userFindOne.mockResolvedValue(null);
            argonHash.mockResolvedValue('hash');

            const req = { body: { username: 'u', email: 'a@a.com', password: 'pass' } };
            const res = buildRes();

            await viewController.handleRegister(req, res);

            expect(userCreate).toHaveBeenCalledWith({ username: 'u', email: 'a@a.com', password_hash: 'hash' });
            expect(res.redirect).toHaveBeenCalledWith('/login');
        });
    });

    describe('toggleFavorite', () => {
        it('should render 404 when recipe missing', async () => {
            recipeFindByPk.mockResolvedValue(null);

            const req = { params: { id: 99 } };
            const res = buildRes();

            await viewController.toggleFavorite(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.render).toHaveBeenCalledWith('404', { title: 'Recette introuvable' });
        });

        it('should delete favorite and redirect to referer', async () => {
            const favorite = { destroy: jest.fn() };
            recipeFindByPk.mockResolvedValue({ id: 1 });
            favoriteFindOne.mockResolvedValue(favorite);

            const req = {
                params: { id: 1 },
                user: { id: 1 },
                get: jest.fn().mockReturnValue('/recipes/1')
            };
            const res = buildRes();

            await viewController.toggleFavorite(req, res);

            expect(favorite.destroy).toHaveBeenCalledTimes(1);
            expect(res.redirect).toHaveBeenCalledWith('/recipes/1');
        });

        it('should create favorite and redirect when none exists', async () => {
            recipeFindByPk.mockResolvedValue({ id: 1 });
            favoriteFindOne.mockResolvedValue(null);

            const req = {
                params: { id: 1 },
                user: { id: 1 },
                get: jest.fn().mockReturnValue(null)
            };
            const res = buildRes();

            await viewController.toggleFavorite(req, res);

            expect(favoriteCreate).toHaveBeenCalledWith({ user_id: 1, recipe_id: 1 });
            expect(res.redirect).toHaveBeenCalledWith('/recipes/1');
        });
    });

    describe('getFavoritesPage', () => {
        it('should render favorites list', async () => {
            favoriteFindAll.mockResolvedValue([
                { recipe: { id: 1, title: 'Recipe' } }
            ]);

            const req = { user: { id: 1 } };
            const res = buildRes();

            await viewController.getFavoritesPage(req, res);

            expect(res.render).toHaveBeenCalledWith('favorites/index', {
                title: 'Mes Favoris - CinéDélices',
                recipes: [{ id: 1, title: 'Recipe' }]
            });
        });
    });
});
