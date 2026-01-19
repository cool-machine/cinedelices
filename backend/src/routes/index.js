import { Router } from 'express';
import recipeRoutes from './recipeRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import adminRoutes from './adminRoutes.js';
import tmdbRoutes from './tmdbRoutes.js';
import * as metadataController from '../controllers/metadataController.js';
import * as interactionController from '../controllers/interactionController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = Router();

router.use('/recipes', recipeRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/tmdb', tmdbRoutes);

// Metadata routes
router.get('/categories', metadataController.getAllCategories);
router.get('/media', metadataController.getAllMedia);
router.post('/media', isAuthenticated, metadataController.createMedia);

// Favorites
router.get('/favorites', isAuthenticated, interactionController.getFavorites);

export default router;
