import { Router } from 'express';
import recipeRoutes from './recipeRoutes.js';
import authRoutes from './authRoutes.js';
import * as metadataController from '../controllers/metadataController.js';

const router = Router();

router.use('/recipes', recipeRoutes);
router.use('/auth', authRoutes);

// Metadata routes
router.get('/categories', metadataController.getAllCategories);
router.get('/media', metadataController.getAllMedia);

export default router;
