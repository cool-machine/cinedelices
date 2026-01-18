import { Router } from 'express';
import * as viewController from '../controllers/viewController.js';
import { isAuthenticated, isRecipeAuthor, isAdmin } from '../middlewares/auth.js';
import * as adminController from '../controllers/adminController.js';

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
router.get('/logout', viewController.handleLogout);

// Profile routes
router.get('/profile/edit', isAuthenticated, viewController.getEditProfilePage);
router.put('/profile/edit', isAuthenticated, viewController.updateProfile);
router.get('/profile/:id', viewController.getProfilePage);

// Admin routes
router.get('/admin', isAuthenticated, isAdmin, adminController.getDashboard);
router.get('/admin/recipes', isAuthenticated, isAdmin, adminController.getAdminRecipesPage);
router.get('/admin/recipes/:id/edit', isAuthenticated, isAdmin, adminController.getAdminEditRecipePage);
router.put('/admin/recipes/:id', isAuthenticated, isAdmin, adminController.updateAdminRecipe);
router.delete('/admin/recipes/:id', isAuthenticated, isAdmin, adminController.deleteAdminRecipe);
router.get('/admin/categories', isAuthenticated, isAdmin, adminController.getAdminCategoriesPage);
router.post('/admin/categories', isAuthenticated, isAdmin, adminController.createAdminCategory);
router.get('/admin/categories/:id/edit', isAuthenticated, isAdmin, adminController.getAdminEditCategoryPage);
router.put('/admin/categories/:id', isAuthenticated, isAdmin, adminController.updateAdminCategory);
router.delete('/admin/categories/:id', isAuthenticated, isAdmin, adminController.deleteAdminCategory);
router.get('/admin/users', isAuthenticated, isAdmin, adminController.getAdminUsersPage);
router.get('/admin/users/:id/edit', isAuthenticated, isAdmin, adminController.getAdminEditUserPage);
router.put('/admin/users/:id', isAuthenticated, isAdmin, adminController.updateAdminUser);
router.delete('/admin/users/:id', isAuthenticated, isAdmin, adminController.deleteAdminUser);
router.get('/admin/media', isAuthenticated, isAdmin, adminController.getAdminMediaPage);
router.post('/admin/media', isAuthenticated, isAdmin, adminController.createAdminMedia);
router.get('/admin/media/:id/edit', isAuthenticated, isAdmin, adminController.getAdminEditMediaPage);
router.put('/admin/media/:id', isAuthenticated, isAdmin, adminController.updateAdminMedia);
router.delete('/admin/media/:id', isAuthenticated, isAdmin, adminController.deleteAdminMedia);

// Rating & Review routes
router.post('/recipes/:id/rate', isAuthenticated, viewController.rateRecipe);
router.post('/recipes/:id/reviews', isAuthenticated, viewController.createReview);

// Favorites routes
router.post('/recipes/:id/favorite', isAuthenticated, viewController.toggleFavorite);
router.get('/favorites', isAuthenticated, viewController.getFavoritesPage);

export default router;
