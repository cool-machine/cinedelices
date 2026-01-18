import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', isAuthenticated, isAdmin, adminController.getDashboard);

export default router;
