import { Router } from 'express';
import * as viewController from '../controllers/viewController.js';

const router = Router();

router.get('/', viewController.getHomePage);
router.get('/recipes', viewController.getRecipesPage);
router.get('/recipes/:id', viewController.getRecipeDetailPage);

export default router;
