import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', isAuthenticated, isAdmin, userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', isAuthenticated, userController.updateUser);
router.delete('/:id', isAuthenticated, userController.deleteUser);

export default router;
