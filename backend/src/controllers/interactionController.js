import db from '../models/index.js';

const { Favorite, Rating, Review, Recipe, User } = db;

/**
 * Get user's favorites
 */
export const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.findAll({
            where: { user_id: req.user.id },
            include: [{
                model: Recipe,
                as: 'recipe',
                include: [
                    { model: User, as: 'author', attributes: ['id', 'username'] }
                ]
            }]
        });
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Toggle favorite on a recipe
 */
export const toggleFavorite = async (req, res) => {
    try {
        const { id: recipe_id } = req.params;
        const user_id = req.user.id;

        const recipe = await Recipe.findByPk(recipe_id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const existing = await Favorite.findOne({
            where: { user_id, recipe_id }
        });

        if (existing) {
            await existing.destroy();
            res.status(200).json({ favorited: false, message: 'Removed from favorites' });
        } else {
            await Favorite.create({ user_id, recipe_id });
            res.status(201).json({ favorited: true, message: 'Added to favorites' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Rate a recipe
 */
export const rateRecipe = async (req, res) => {
    try {
        const { id: recipe_id } = req.params;
        const { score: stars } = req.body;
        const user_id = req.user.id;

        const recipe = await Recipe.findByPk(recipe_id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const [rating, created] = await Rating.findOrCreate({
            where: { user_id, recipe_id },
            defaults: { stars }
        });

        if (!created) {
            await rating.update({ stars });
        }

        // Calculate average rating
        const ratings = await Rating.findAll({ where: { recipe_id } });
        const avgRating = ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length;

        res.status(created ? 201 : 200).json({
            ...rating.toJSON(),
            score: rating.stars,
            averageRating: Math.round(avgRating * 10) / 10
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create a review for a recipe
 */
export const createReview = async (req, res) => {
    try {
        const { id: recipe_id } = req.params;
        const { content } = req.body;
        const user_id = req.user.id;

        const recipe = await Recipe.findByPk(recipe_id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const review = await Review.create({
            user_id,
            recipe_id,
            content
        });

        const reviewWithUser = await Review.findByPk(review.id, {
            include: [{ model: User, as: 'author', attributes: ['id', 'username'] }]
        });

        res.status(201).json(reviewWithUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get reviews for a recipe
 */
export const getRecipeReviews = async (req, res) => {
    try {
        const { id: recipe_id } = req.params;

        const reviews = await Review.findAll({
            where: { recipe_id },
            include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
