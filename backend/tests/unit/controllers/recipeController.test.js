/**
 * Recipe Controller - Unit Tests
 */

import { jest } from '@jest/globals';

const createRecipeMock = jest.fn();
const findAllMock = jest.fn();
const findByPkMock = jest.fn();

jest.unstable_mockModule('../../../src/models/index.js', () => ({
    default: {
        Recipe: {
            create: createRecipeMock,
            findAll: findAllMock,
            findByPk: findByPkMock
        },
        User: {},
        Category: {},
        Media: {}
    }
}));

let createRecipe;
let getAllRecipes;
let getRecipeById;
let updateRecipe;
let deleteRecipe;

describe('Recipe Controller', () => {
    beforeAll(async () => {
        const controller = await import('../../../src/controllers/recipeController.js');
        createRecipe = controller.createRecipe;
        getAllRecipes = controller.getAllRecipes;
        getRecipeById = controller.getRecipeById;
        updateRecipe = controller.updateRecipe;
        deleteRecipe = controller.deleteRecipe;
    });

    beforeEach(() => {
        createRecipeMock.mockReset();
        findAllMock.mockReset();
        findByPkMock.mockReset();
    });

    describe('createRecipe', () => {
        it('should create a recipe and return 201', async () => {
            const payload = { title: 'Recipe 1' };
            const created = { id: 1, ...payload, user_id: 1 };
            createRecipeMock.mockResolvedValue(created);

            const req = { body: payload, user: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await createRecipe(req, res);

            expect(createRecipeMock).toHaveBeenCalledWith({ ...payload, user_id: 1 });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(created);
        });

        it('should return 500 on error', async () => {
            const error = new Error('DB error');
            createRecipeMock.mockRejectedValue(error);

            const req = { body: { title: 'Recipe 1' }, user: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await createRecipe(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getAllRecipes', () => {
        it('should return recipes with 200', async () => {
            const recipes = [{ id: 1, title: 'Recipe 1' }];
            findAllMock.mockResolvedValue(recipes);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getAllRecipes(req, res);

            expect(findAllMock).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(recipes);
        });

        it('should return 500 on error', async () => {
            const error = new Error('DB error');
            findAllMock.mockRejectedValue(error);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getAllRecipes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getRecipeById', () => {
        it('should return recipe with 200', async () => {
            const recipe = { id: 1, title: 'Recipe 1' };
            findByPkMock.mockResolvedValue(recipe);

            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getRecipeById(req, res);

            expect(findByPkMock).toHaveBeenCalledWith(1, expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(recipe);
        });

        it('should return 404 when recipe is missing', async () => {
            findByPkMock.mockResolvedValue(null);

            const req = { params: { id: 999 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getRecipeById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Recipe not found' });
        });

        it('should return 500 on error', async () => {
            const error = new Error('DB error');
            findByPkMock.mockRejectedValue(error);

            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getRecipeById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('updateRecipe', () => {
        it('should update recipe and return 200', async () => {
            const recipe = { user_id: 1, update: jest.fn().mockResolvedValue(true) };
            findByPkMock.mockResolvedValue(recipe);

            const req = { params: { id: 1 }, body: { title: 'Updated' }, user: { id: 1, role: 'user' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await updateRecipe(req, res);

            expect(recipe.update).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(recipe);
        });

        it('should return 404 when recipe is missing', async () => {
            findByPkMock.mockResolvedValue(null);

            const req = { params: { id: 999 }, body: {}, user: { id: 1, role: 'user' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await updateRecipe(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Recipe not found' });
        });

        it('should return 500 on error', async () => {
            const error = new Error('DB error');
            findByPkMock.mockRejectedValue(error);

            const req = { params: { id: 1 }, body: {}, user: { id: 1, role: 'user' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await updateRecipe(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('deleteRecipe', () => {
        it('should delete recipe and return 204', async () => {
            const recipe = { user_id: 1, destroy: jest.fn().mockResolvedValue(true) };
            findByPkMock.mockResolvedValue(recipe);

            const req = { params: { id: 1 }, user: { id: 1, role: 'user' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };

            await deleteRecipe(req, res);

            expect(recipe.destroy).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalledWith();
        });

        it('should return 404 when recipe is missing', async () => {
            findByPkMock.mockResolvedValue(null);

            const req = { params: { id: 999 }, user: { id: 1, role: 'user' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };

            await deleteRecipe(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Recipe not found' });
        });

        it('should return 500 on error', async () => {
            const error = new Error('DB error');
            findByPkMock.mockRejectedValue(error);

            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                send: jest.fn()
            };

            await deleteRecipe(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});
