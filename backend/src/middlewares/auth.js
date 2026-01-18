import { verifyToken } from '../utils/jwt.js';

/**
 * Middleware to check if user is authenticated via JWT
 */
export const isAuthenticated = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        // Attach user info to request
        req.user = decoded;

        next();
    } catch (error) {
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
