import db from '../models/index.js';

const { Recipe, User, Category, Media } = db;

export const getHomePage = (req, res) => {
    res.render('home', { title: 'CinéDélices - Accueil' });
};

export const getRecipesPage = async (req, res) => {
    try {
        const recipes = await Recipe.findAll({
            include: [
                { model: User, as: 'author' },
                { model: Category, as: 'category' },
                { model: Media, as: 'media' }
            ]
        });
        res.render('recipes/index', {
            title: 'Nos Recettes - CinéDélices',
            recipes
        });
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

export const getRecipeDetailPage = async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id, {
            include: [
                { model: User, as: 'author' },
                { model: Category, as: 'category' },
                { model: Media, as: 'media' }
            ]
        });

        if (!recipe) {
            return res.status(404).render('404', { title: 'Recette introuvable' });
        }

        res.render('recipes/show', {
            title: `${recipe.title} - CinéDélices`,
            recipe
        });
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};
