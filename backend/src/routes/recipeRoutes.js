import { Router } from 'express';
import * as recipeController from '../controllers/recipeController.js';
import * as interactionController from '../controllers/interactionController.js';
import { createRecipeSchema, updateRecipeSchema } from '../validations/recipeSchema.js';
import { validate } from '../middlewares/validator.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { body } from 'express-validator';

const router = Router();

// Recipe CRUD
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);
router.post('/', isAuthenticated, createRecipeSchema, validate, recipeController.createRecipe);
router.put('/:id', isAuthenticated, updateRecipeSchema, validate, recipeController.updateRecipe);
router.delete('/:id', isAuthenticated, recipeController.deleteRecipe);

// Recipe interactions
router.post('/:id/favorite', isAuthenticated, interactionController.toggleFavorite);
router.post('/:id/rate', isAuthenticated, [
    body('score').isInt({ min: 1, max: 5 }).withMessage('Score must be between 1 and 5')
], validate, interactionController.rateRecipe);
router.get('/:id/reviews', interactionController.getRecipeReviews);
router.post('/:id/reviews', isAuthenticated, [
    body('content').notEmpty().withMessage('Review content is required')
], validate, interactionController.createReview);

export default router;
