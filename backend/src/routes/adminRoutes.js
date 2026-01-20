import { Router } from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validator.js';
import { body } from 'express-validator';
import db from '../models/index.js';

const { Recipe, Category, Media, User, Rating, Review, Favorite } = db;

const router = Router();

// All admin routes require authentication and admin role
router.use(isAuthenticated, isAdmin);

// ============ RECIPES ============
router.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.findAll({
            include: [
                { model: User, as: 'author', attributes: ['id', 'username'] },
                { model: Category, as: 'category' },
                { model: Media, as: 'media' }
            ]
        });
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        await recipe.update(req.body);
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Delete related records first to avoid foreign key constraints
        await Rating.destroy({ where: { recipe_id: req.params.id } });
        await Review.destroy({ where: { recipe_id: req.params.id } });
        await Favorite.destroy({ where: { recipe_id: req.params.id } });

        await recipe.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ CATEGORIES ============
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/categories', [
    body('name').notEmpty().withMessage('Category name is required')
], validate, async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.update(req.body);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ MEDIA ============
router.get('/media', async (req, res) => {
    try {
        const media = await Media.findAll();
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/media', [
    body('title').notEmpty().withMessage('Media title is required'),
    body('type').isIn(['film', 'serie']).withMessage('Type must be film or serie')
], validate, async (req, res) => {
    try {
        const media = await Media.create(req.body);
        res.status(201).json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/media/:id', async (req, res) => {
    try {
        const media = await Media.findByPk(req.params.id);
        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }
        await media.update(req.body);
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/media/:id', async (req, res) => {
    try {
        const media = await Media.findByPk(req.params.id);
        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }
        await media.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ USERS ============
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password_hash'] }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { username, email, role, bio, avatar_url } = req.body;
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (role) updateData.role = role;
        if (bio !== undefined) updateData.bio = bio;
        if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

        await user.update(updateData);

        const userResponse = user.toJSON();
        delete userResponse.password_hash;

        res.status(200).json(userResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ DASHBOARD STATS ============
router.get('/stats', async (req, res) => {
    try {
        const [recipesCount, usersCount, categoriesCount, mediaCount] = await Promise.all([
            Recipe.count(),
            User.count(),
            Category.count(),
            Media.count()
        ]);

        res.status(200).json({
            recipes: recipesCount,
            users: usersCount,
            categories: categoriesCount,
            media: mediaCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
