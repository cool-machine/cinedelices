import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.SESSION_SECRET || 'fallback-secret-for-dev';
const JWT_EXPIRES_IN = '24h';

/**
 * Generate a JWT token for a user
 * @param {Object} user 
 * @returns {string} token
 */
export const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

/**
 * Verify a JWT token
 * @param {string} token 
 * @returns {Object} decoded payload
 */
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
