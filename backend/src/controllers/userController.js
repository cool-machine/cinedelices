import argon2 from 'argon2';
import db from '../models/index.js';

const { User, Recipe } = db;

/**
 * Get user profile by ID
 */
export const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
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
 * Update user profile
 */
export const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only allow user to update their own profile (or admin)
        if (req.user.id !== user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { username, email, bio, avatar_url, password } = req.body;

        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (bio !== undefined) updateData.bio = bio;
        if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
        if (password) {
            updateData.password_hash = await argon2.hash(password);
        }

        await user.update(updateData);

        const userResponse = user.toJSON();
        delete userResponse.password_hash;

        res.status(200).json(userResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password_hash'] }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only allow user to delete their own account (or admin)
        if (req.user.id !== user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await user.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
