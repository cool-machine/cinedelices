/**
 * Interaction Controller - Unit Tests
 */

import { jest } from '@jest/globals';

const mockRecipe = { id: 1, title: 'Test Recipe' };
const mockFavorite = { id: 1, user_id: 1, recipe_id: 1, destroy: jest.fn() };
const mockRating = { id: 1, user_id: 1, recipe_id: 1, stars: 4, update: jest.fn(), toJSON: () => ({ id: 1, user_id: 1, recipe_id: 1, stars: 4 }) };
const mockReview = { id: 1, user_id: 1, recipe_id: 1, content: 'Great!', author: { username: 'test' } };

const recipeFindByPk = jest.fn();
const favoriteFindAll = jest.fn();
const favoriteFindOne = jest.fn();
const favoriteCreate = jest.fn();
const ratingFindOrCreate = jest.fn();
const ratingFindAll = jest.fn();
const reviewCreate = jest.fn();
const reviewFindByPk = jest.fn();
const reviewFindAll = jest.fn();

jest.unstable_mockModule('../../../src/models/index.js', () => ({
    default: {
        Recipe: { findByPk: recipeFindByPk },
        Favorite: { findAll: favoriteFindAll, findOne: favoriteFindOne, create: favoriteCreate },
        Rating: { findOrCreate: ratingFindOrCreate, findAll: ratingFindAll },
        Review: { create: reviewCreate, findByPk: reviewFindByPk, findAll: reviewFindAll },
        User: {}
    }
}));

let interactionController;

const buildRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
});

describe('Interaction Controller', () => {
    beforeAll(async () => {
        interactionController = await import('../../../src/controllers/interactionController.js');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getFavorites', () => {
        it('should return user favorites', async () => {
            const favorites = [{ recipe_id: 1, recipe: mockRecipe }];
            favoriteFindAll.mockResolvedValue(favorites);

            const req = { user: { id: 1 } };
            const res = buildRes();

            await interactionController.getFavorites(req, res);

            expect(favoriteFindAll).toHaveBeenCalledWith(expect.objectContaining({
                where: { user_id: 1 }
            }));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(favorites);
        });

        it('should return 500 on error', async () => {
            favoriteFindAll.mockRejectedValue(new Error('DB error'));

            const req = { user: { id: 1 } };
            const res = buildRes();

            await interactionController.getFavorites(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('toggleFavorite', () => {
        it('should add favorite when not exists', async () => {
            recipeFindByPk.mockResolvedValue(mockRecipe);
            favoriteFindOne.mockResolvedValue(null);
            favoriteCreate.mockResolvedValue({ id: 1 });

            const req = { params: { id: 1 }, user: { id: 1 } };
            const res = buildRes();

            await interactionController.toggleFavorite(req, res);

            expect(favoriteCreate).toHaveBeenCalledWith({ user_id: 1, recipe_id: 1 });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ favorited: true, message: 'Added to favorites' });
        });

        it('should remove favorite when exists', async () => {
            recipeFindByPk.mockResolvedValue(mockRecipe);
            favoriteFindOne.mockResolvedValue(mockFavorite);

            const req = { params: { id: 1 }, user: { id: 1 } };
            const res = buildRes();

            await interactionController.toggleFavorite(req, res);

            expect(mockFavorite.destroy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ favorited: false, message: 'Removed from favorites' });
        });

        it('should return 404 when recipe not found', async () => {
            recipeFindByPk.mockResolvedValue(null);

            const req = { params: { id: 999 }, user: { id: 1 } };
            const res = buildRes();

            await interactionController.toggleFavorite(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Recipe not found' });
        });
    });

    describe('rateRecipe', () => {
        it('should create new rating', async () => {
            recipeFindByPk.mockResolvedValue(mockRecipe);
            ratingFindOrCreate.mockResolvedValue([mockRating, true]);
            ratingFindAll.mockResolvedValue([{ stars: 4 }, { stars: 5 }]);

            const req = { params: { id: 1 }, user: { id: 1 }, body: { score: 4 } };
            const res = buildRes();

            await interactionController.rateRecipe(req, res);

            expect(ratingFindOrCreate).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                score: 4,
                averageRating: expect.any(Number)
            }));
        });

        it('should update existing rating', async () => {
            const existingRating = { ...mockRating, update: jest.fn().mockResolvedValue(true) };
            recipeFindByPk.mockResolvedValue(mockRecipe);
            ratingFindOrCreate.mockResolvedValue([existingRating, false]);
            ratingFindAll.mockResolvedValue([{ stars: 5 }]);

            const req = { params: { id: 1 }, user: { id: 1 }, body: { score: 5 } };
            const res = buildRes();

            await interactionController.rateRecipe(req, res);

            expect(existingRating.update).toHaveBeenCalledWith({ stars: 5 });
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 when recipe not found', async () => {
            recipeFindByPk.mockResolvedValue(null);

            const req = { params: { id: 999 }, user: { id: 1 }, body: { score: 4 } };
            const res = buildRes();

            await interactionController.rateRecipe(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('createReview', () => {
        it('should create a review', async () => {
            recipeFindByPk.mockResolvedValue(mockRecipe);
            reviewCreate.mockResolvedValue({ id: 1 });
            reviewFindByPk.mockResolvedValue(mockReview);

            const req = { params: { id: 1 }, user: { id: 1 }, body: { content: 'Great recipe!' } };
            const res = buildRes();

            await interactionController.createReview(req, res);

            expect(reviewCreate).toHaveBeenCalledWith({
                user_id: 1,
                recipe_id: 1,
                content: 'Great recipe!'
            });
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should return 404 when recipe not found', async () => {
            recipeFindByPk.mockResolvedValue(null);

            const req = { params: { id: 999 }, user: { id: 1 }, body: { content: 'Test' } };
            const res = buildRes();

            await interactionController.createReview(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getRecipeReviews', () => {
        it('should return reviews for a recipe', async () => {
            const reviews = [mockReview];
            reviewFindAll.mockResolvedValue(reviews);

            const req = { params: { id: 1 } };
            const res = buildRes();

            await interactionController.getRecipeReviews(req, res);

            expect(reviewFindAll).toHaveBeenCalledWith(expect.objectContaining({
                where: { recipe_id: 1 }
            }));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(reviews);
        });

        it('should return 500 on error', async () => {
            reviewFindAll.mockRejectedValue(new Error('DB error'));

            const req = { params: { id: 1 } };
            const res = buildRes();

            await interactionController.getRecipeReviews(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
