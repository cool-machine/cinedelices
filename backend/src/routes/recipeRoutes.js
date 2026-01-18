import { Router } from 'express';
import * as recipeController from '../controllers/recipeController.js';
import { createRecipeSchema, updateRecipeSchema } from '../validations/recipeSchema.js';
import { validate } from '../middlewares/validator.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = Router();

router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);
router.post('/', isAuthenticated, createRecipeSchema, validate, recipeController.createRecipe);
router.put('/:id', isAuthenticated, updateRecipeSchema, validate, recipeController.updateRecipe);
router.delete('/:id', isAuthenticated, recipeController.deleteRecipe);

export default router;
