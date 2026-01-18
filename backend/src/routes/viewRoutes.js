import { Router } from 'express';
import * as viewController from '../controllers/viewController.js';
import { isAuthenticated, isRecipeAuthor } from '../middlewares/auth.js';

const router = Router();

router.get('/', viewController.getHomePage);
router.get('/recipes', viewController.getRecipesPage);
router.get('/recipes/new', isAuthenticated, viewController.getNewRecipePage);
router.post('/recipes', isAuthenticated, viewController.createRecipe);
router.get('/recipes/:id', viewController.getRecipeDetailPage);
router.get('/recipes/:id/edit', isAuthenticated, isRecipeAuthor, viewController.getEditRecipePage);
router.put('/recipes/:id', isAuthenticated, isRecipeAuthor, viewController.updateRecipe);
router.delete('/recipes/:id', isAuthenticated, isRecipeAuthor, viewController.deleteRecipe);

// Auth routes
router.get('/login', viewController.getLoginPage);
router.get('/register', viewController.getRegisterPage);
router.post('/login', viewController.handleLogin);
router.post('/register', viewController.handleRegister);

export default router;
