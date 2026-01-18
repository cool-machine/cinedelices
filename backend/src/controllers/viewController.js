import db from '../models/index.js';
import argon2 from 'argon2';
import { generateToken } from '../utils/jwt.js';

const { Recipe, User, Category, Media, Rating, Review, Favorite } = db;

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
                { model: Media, as: 'media' },
                { model: Rating, as: 'ratings' },
                {
                    model: Review,
                    as: 'reviews',
                    include: [{ model: User, as: 'author' }]
                }
            ]
        });

        if (!recipe) {
            return res.status(404).render('404', { title: 'Recette introuvable' });
        }

        // Calculate average rating
        let averageRating = 0;
        if (recipe.ratings && recipe.ratings.length > 0) {
            const total = recipe.ratings.reduce((sum, r) => sum + r.stars, 0);
            averageRating = (total / recipe.ratings.length).toFixed(1);
        }

        // Get user's rating if logged in
        let userRating = null;
        let isFavorited = false;
        if (req.user) {
            userRating = recipe.ratings.find(r => r.user_id === req.user.id);
            const favorite = await Favorite.findOne({
                where: { user_id: req.user.id, recipe_id: req.params.id }
            });
            isFavorited = !!favorite;
        }

        res.render('recipes/show', {
            title: `${recipe.title} - CinéDélices`,
            recipe,
            averageRating,
            userRating,
            ratingCount: recipe.ratings ? recipe.ratings.length : 0,
            isFavorited
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

        if (!user.avatar_url && !user.bio) {
            return res.redirect('/profile/edit');
        }

        res.redirect('/');
    } catch {
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
    } catch {
        res.render('auth/register', {
            title: 'Inscription - CinéDélices',
            error: 'Une erreur est survenue'
        });
    }
};

export const handleLogout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
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
    } catch {
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

// User Profile
export const getProfilePage = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: [
                {
                    model: Recipe,
                    as: 'recipes',
                    include: [
                        { model: Category, as: 'category' },
                        { model: Media, as: 'media' }
                    ]
                }
            ],
            order: [[{ model: Recipe, as: 'recipes' }, 'created_at', 'DESC']]
        });

        if (!user) {
            return res.status(404).render('404', { title: 'Utilisateur introuvable' });
        }

        res.render('profile/show', {
            title: `Profil de ${user.username} - CinéDélices`,
            profileUser: user,
            isOwnProfile: req.user && req.user.id === user.id
        });
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

export const getEditProfilePage = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.render('profile/edit', {
            title: 'Modifier mon profil - CinéDélices',
            user
        });
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { username, bio, avatar_url } = req.body;
        const user = await User.findByPk(req.user.id);

        await user.update({
            username,
            bio,
            avatar_url
        });

        res.redirect(`/profile/${user.id}`);
    } catch {
        const user = await User.findByPk(req.user.id);
        res.render('profile/edit', {
            title: 'Modifier mon profil - CinéDélices',
            user,
            error: 'Erreur lors de la mise à jour'
        });
    }
};

// Rating
export const rateRecipe = async (req, res) => {
    try {
        const { stars } = req.body;
        const recipeId = req.params.id;

        // Upsert: create or update rating
        const [rating, created] = await Rating.findOrCreate({
            where: { user_id: req.user.id, recipe_id: recipeId },
            defaults: { stars: parseInt(stars) }
        });

        if (!created) {
            await rating.update({ stars: parseInt(stars) });
        }

        res.redirect(`/recipes/${recipeId}`);
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

// Review
export const createReview = async (req, res) => {
    try {
        const { content } = req.body;
        const recipeId = req.params.id;

        await Review.create({
            user_id: req.user.id,
            recipe_id: recipeId,
            content
        });

        res.redirect(`/recipes/${recipeId}`);
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

// Favorites
export const toggleFavorite = async (req, res) => {
    try {
        const recipeId = req.params.id;

        const recipe = await Recipe.findByPk(recipeId);
        if (!recipe) {
            return res.status(404).render('404', { title: 'Recette introuvable' });
        }

        const existingFavorite = await Favorite.findOne({
            where: { user_id: req.user.id, recipe_id: recipeId }
        });

        if (existingFavorite) {
            await existingFavorite.destroy();
        } else {
            await Favorite.create({
                user_id: req.user.id,
                recipe_id: recipeId
            });
        }

        const referer = req.get('Referer') || `/recipes/${recipeId}`;
        res.redirect(referer);
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};

export const getFavoritesPage = async (req, res) => {
    try {
        const favorites = await Favorite.findAll({
            where: { user_id: req.user.id },
            include: [{
                model: Recipe,
                as: 'recipe',
                include: [
                    { model: Media, as: 'media' },
                    { model: Category, as: 'category' }
                ]
            }],
            order: [['created_at', 'DESC']]
        });

        const recipes = favorites.map(f => f.recipe);

        res.render('favorites/index', {
            title: 'Mes Favoris - CinéDélices',
            recipes
        });
    } catch (error) {
        res.status(500).render('500', { title: 'Erreur Serveur', error: error.message });
    }
};
