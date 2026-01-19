import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { body } from 'express-validator';
import { validate } from '../middlewares/validator.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = Router();

const registerSchema = [
    body('username').notEmpty().withMessage('Username is required').isLength({ min: 3 }),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

const loginSchema = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

router.post('/register', registerSchema, validate, authController.register);
router.post('/login', loginSchema, validate, authController.login);
router.get('/me', isAuthenticated, authController.getMe);
router.post('/logout', authController.logout);

export default router;
