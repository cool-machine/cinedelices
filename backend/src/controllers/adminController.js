import db from '../models/index.js';

const { User, Recipe, Category, Media } = db;

export const getDashboard = async (req, res) => {
    try {
        const [userCount, recipeCount, categoryCount, mediaCount] = await Promise.all([
            User.count(),
            Recipe.count(),
            Category.count(),
            Media.count()
        ]);

        res.render('admin/dashboard', {
            title: 'Admin - Dashboard',
            layout: 'layouts/admin',
            stats: {
                users: userCount,
                recipes: recipeCount,
                categories: categoryCount,
                media: mediaCount
            }
        });
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};
