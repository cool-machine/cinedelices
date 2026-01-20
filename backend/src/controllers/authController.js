import argon2 from 'argon2';
import db from '../models/index.js';
import { generateToken } from '../utils/jwt.js';

const { User, Recipe } = db;

/**
 * Register a new user
 */
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await argon2.hash(password);

        // Create user
        const user = await User.create({
            username,
            email,
            password_hash: hashedPassword
        });

        // Generate token
        const token = generateToken(user);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Remove password from response
        const userResponse = user.toJSON();
        delete userResponse.password_hash;

        res.status(201).json({ user: userResponse, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Login user
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await argon2.verify(user.password_hash, password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Remove password from response
        const userResponse = user.toJSON();
        delete userResponse.password_hash;

        res.status(200).json({ user: userResponse, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get current authenticated user
 */
export const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password_hash'] },
            include: [{ model: Recipe, as: 'recipes' }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Logout user (clear cookie)
 */
export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
