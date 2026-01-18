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

export const getAdminRecipesPage = async (req, res) => {
    try {
        const recipes = await Recipe.findAll({
            include: [
                { model: User, as: 'author', attributes: ['id', 'username'] },
                { model: Category, as: 'category' },
                { model: Media, as: 'media' }
            ],
            order: [['created_at', 'DESC']]
        });

        res.render('admin/recipes/index', {
            title: 'Admin - Recettes',
            layout: 'layouts/admin',
            recipes
        });
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

export const getAdminEditRecipePage = async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id);

        if (!recipe) {
            return res.status(404).render('404', { title: 'Recette introuvable' });
        }

        const categories = await Category.findAll();
        const mediaList = await Media.findAll();

        res.render('admin/recipes/edit', {
            title: `Admin - Modifier ${recipe.title}`,
            layout: 'layouts/admin',
            recipe,
            categories,
            mediaList
        });
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

export const updateAdminRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id);

        if (!recipe) {
            return res.status(404).render('404', { title: 'Recette introuvable' });
        }

        const updateData = {
            title: req.body.title ?? recipe.title,
            description: req.body.description ?? recipe.description,
            ingredients: req.body.ingredients ?? recipe.ingredients,
            instructions: req.body.instructions ?? recipe.instructions,
            category_id: Object.prototype.hasOwnProperty.call(req.body, 'category_id')
                ? req.body.category_id || null
                : recipe.category_id,
            media_id: Object.prototype.hasOwnProperty.call(req.body, 'media_id')
                ? req.body.media_id || null
                : recipe.media_id,
            difficulty: req.body.difficulty || recipe.difficulty,
            prep_time: req.body.prep_time ?? recipe.prep_time,
            cook_time: req.body.cook_time ?? recipe.cook_time,
            image_url: req.body.image_url ?? recipe.image_url
        };

        await recipe.update(updateData);

        res.redirect('/admin/recipes');
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

export const deleteAdminRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id);

        if (!recipe) {
            return res.status(404).render('404', { title: 'Recette introuvable' });
        }

        await recipe.destroy();
        res.redirect('/admin/recipes');
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

export const getAdminCategoriesPage = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['created_at', 'DESC']]
        });

        res.render('admin/categories/index', {
            title: 'Admin - Catégories',
            layout: 'layouts/admin',
            categories
        });
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

export const createAdminCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        await Category.create({
            name,
            description: description || null
        });

        res.redirect('/admin/categories');
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

export const getAdminEditCategoryPage = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).render('404', { title: 'Catégorie introuvable' });
        }

        res.render('admin/categories/edit', {
            title: `Admin - Modifier ${category.name}`,
            layout: 'layouts/admin',
            category
        });
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

export const updateAdminCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).render('404', { title: 'Catégorie introuvable' });
        }

        await category.update({
            name: req.body.name ?? category.name,
            description: req.body.description ?? category.description
        });

        res.redirect('/admin/categories');
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

export const deleteAdminCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).render('404', { title: 'Catégorie introuvable' });
        }

        await category.destroy();
        res.redirect('/admin/categories');
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};
