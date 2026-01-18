import db from '../models/index.js';
import argon2 from 'argon2';
import { generateToken } from '../utils/jwt.js';

const { Recipe, User, Category, Media } = db;

export const getHomePage = async (req, res) => {
    try {
        // Get featured recipe (first one or random)
        const featuredRecipe = await Recipe.findOne({
            include: [
                { model: Media, as: 'media' },
                { model: Category, as: 'category' }
            ],
            order: [['created_at', 'DESC']]
        });

        // Get latest recipes for the grid
        const latestRecipes = await Recipe.findAll({
            include: [
                { model: Media, as: 'media' },
                { model: Category, as: 'category' }
            ],
            order: [['created_at', 'DESC']],
            limit: 4
        });

        res.render('home', {
            title: 'CinéDélices - Accueil',
            featuredRecipe,
            recipes: latestRecipes
        });
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

export const getRecipesPage = async (req, res) => {
    try {
        const { search, category, media } = req.query;

        // Build where clause for filters
        const where = {};

        // Search by title (case-insensitive)
        if (search && search.trim()) {
            where.title = {
                [db.Sequelize.Op.iLike]: `%${search.trim()}%`
            };
        }

        // Filter by category
        if (category) {
            where.category_id = category;
        }

        // Filter by media
        if (media) {
            where.media_id = media;
        }

        const recipes = await Recipe.findAll({
            where,
            include: [
                { model: User, as: 'author' },
                { model: Category, as: 'category' },
                { model: Media, as: 'media' }
            ]
        });

        // Get all categories and media for filter dropdowns
        const categories = await Category.findAll();
        const mediaList = await Media.findAll();

        res.render('recipes/index', {
            title: 'Nos Recettes - CinéDélices',
            recipes,
            categories,
            mediaList,
            search: search || '',
            selectedCategory: category || '',
            selectedMedia: media || ''
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

// Auth Pages
export const getLoginPage = (req, res) => {
    res.render('auth/login', { title: 'Connexion - CinéDélices' });
};

export const getRegisterPage = (req, res) => {
    res.render('auth/register', { title: 'Inscription - CinéDélices' });
};

export const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.render('auth/login', {
                title: 'Connexion - CinéDélices',
                error: 'Email ou mot de passe incorrect'
            });
        }

        const isValidPassword = await argon2.verify(user.password_hash, password);

        if (!isValidPassword) {
            return res.render('auth/login', {
                title: 'Connexion - CinéDélices',
                error: 'Email ou mot de passe incorrect'
            });
        }

        // Create JWT token and set as cookie
        const token = generateToken({ id: user.id, email: user.email, role: user.role });
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 24h

        res.redirect('/');
    } catch (error) {
        res.render('auth/login', {
            title: 'Connexion - CinéDélices',
            error: 'Une erreur est survenue'
        });
    }
};

export const handleRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.render('auth/register', {
                title: 'Inscription - CinéDélices',
                error: 'Cet email est déjà utilisé'
            });
        }

        // Hash password and create user
        const password_hash = await argon2.hash(password);
        await User.create({ username, email, password_hash });

        // Redirect to login
        res.redirect('/login');
    } catch (error) {
        res.render('auth/register', {
            title: 'Inscription - CinéDélices',
            error: 'Une erreur est survenue'
        });
    }
};

// Recipe CRUD
export const getNewRecipePage = async (req, res) => {
    try {
        const categories = await Category.findAll();
        const mediaList = await Media.findAll();

        res.render('recipes/new', {
            title: 'Créer une Recette - CinéDélices',
            categories,
            mediaList
        });
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

export const createRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, instructions, category_id, media_id, difficulty, prep_time, cook_time, image_url } = req.body;

        await Recipe.create({
            title,
            description,
            ingredients,
            instructions,
            category_id: category_id || null,
            media_id: media_id || null,
            difficulty: difficulty || 'moyen',
            prep_time: prep_time || 0,
            cook_time: cook_time || 0,
            image_url,
            user_id: req.user.id
        });

        res.redirect('/recipes');
    } catch (error) {
        const categories = await Category.findAll();
        const mediaList = await Media.findAll();
        res.render('recipes/new', {
            title: 'Créer une Recette - CinéDélices',
            categories,
            mediaList,
            error: 'Erreur lors de la création'
        });
    }
};

export const getEditRecipePage = async (req, res) => {
    try {
        const recipe = req.recipe; // Set by isRecipeAuthor middleware
        const categories = await Category.findAll();
        const mediaList = await Media.findAll();

        res.render('recipes/edit', {
            title: `Modifier ${recipe.title} - CinéDélices`,
            recipe,
            categories,
            mediaList
        });
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

export const updateRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, instructions, category_id, media_id, difficulty, prep_time, cook_time, image_url } = req.body;

        await req.recipe.update({
            title,
            description,
            ingredients,
            instructions,
            category_id: category_id || null,
            media_id: media_id || null,
            difficulty: difficulty || 'moyen',
            prep_time: prep_time || 0,
            cook_time: cook_time || 0,
            image_url
        });

        res.redirect(`/recipes/${req.recipe.id}`);
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

export const deleteRecipe = async (req, res) => {
    try {
        await req.recipe.destroy();
        res.redirect('/recipes');
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};
