import { verifyToken } from '../utils/jwt.js';
import db from '../models/index.js';

const { Recipe } = db;

/**
 * Middleware to check if user is authenticated via JWT (header or cookie)
 */
export const isAuthenticated = (req, res, next) => {
    try {
        let token;

        // Check Authorization header first
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        // Fall back to cookie for browser requests
        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

/**
 * Middleware to check if user has admin role
 */
export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

/**
 * Middleware to check if user is the author of the recipe
 */
export const isRecipeAuthor = async (req, res, next) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (recipe.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        req.recipe = recipe;
        next();
    } catch {
        return res.status(500).json({ message: 'Server error' });
    }
};
