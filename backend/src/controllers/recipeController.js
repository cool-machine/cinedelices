import db from '../models/index.js';

const { Recipe, User, Category, Media, Rating, Review, Favorite } = db;

export const createRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.create({
            ...req.body,
            user_id: req.user.id
        });
        res.status(201).json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllRecipes = async (req, res) => {
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
};

export const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id, {
            include: [
                { model: User, as: 'author', attributes: ['id', 'username'] },
                { model: Category, as: 'category' },
                { model: Media, as: 'media' }
            ]
        });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        // Only owner or admin can update
        if (recipe.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this recipe' });
        }
        await recipe.update(req.body);
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        // Only owner or admin can delete
        if (recipe.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this recipe' });
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
};
