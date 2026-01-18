import { Router } from 'express';
import * as viewController from '../controllers/viewController.js';

const router = Router();

router.get('/', viewController.getHomePage);
router.get('/recipes', viewController.getRecipesPage);
router.get('/recipes/:id', viewController.getRecipeDetailPage);

// Auth routes
router.get('/login', viewController.getLoginPage);
router.get('/register', viewController.getRegisterPage);
router.post('/login', viewController.handleLogin);
router.post('/register', viewController.handleRegister);

export default router;
