import { body } from 'express-validator';

export const updateAdminRecipeSchema = [
    body('title').optional().trim().notEmpty().isLength({ max: 255 }),
    body('description').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
    body('ingredients').optional().trim().notEmpty(),
    body('instructions').optional().trim().notEmpty(),
    body('category_id').optional({ checkFalsy: true }).isInt(),
    body('media_id').optional({ checkFalsy: true }).isInt(),
    body('difficulty').optional({ checkFalsy: true }).isIn(['facile', 'moyen', 'difficile']),
    body('prep_time').optional({ checkFalsy: true }).isInt({ min: 0 }),
    body('cook_time').optional({ checkFalsy: true }).isInt({ min: 0 }),
    body('image_url').optional({ checkFalsy: true }).isURL()
];

export const createAdminCategorySchema = [
    body('name').trim().notEmpty().isLength({ max: 255 }),
    body('description').optional({ checkFalsy: true }).trim().isLength({ max: 1000 })
];

export const updateAdminCategorySchema = [
    body('name').optional().trim().notEmpty().isLength({ max: 255 }),
    body('description').optional({ checkFalsy: true }).trim().isLength({ max: 1000 })
];

export const updateAdminUserSchema = [
    body('username').optional().trim().notEmpty().isLength({ min: 3, max: 100 }),
    body('email').optional().isEmail(),
    body('role').optional().isIn(['user', 'admin']),
    body('bio').optional({ checkFalsy: true }).isLength({ max: 500 }),
    body('avatar_url').optional({ checkFalsy: true }).isURL()
];

export const createAdminMediaSchema = [
    body('title').trim().notEmpty().isLength({ max: 255 }),
    body('type').trim().notEmpty().isIn(['film', 'serie']),
    body('image_url').optional({ checkFalsy: true }).isURL(),
    body('release_year').optional({ checkFalsy: true }).isInt({ min: 1880, max: 2100 })
];

export const updateAdminMediaSchema = [
    body('title').optional().trim().notEmpty().isLength({ max: 255 }),
    body('type').optional().isIn(['film', 'serie']),
    body('image_url').optional({ checkFalsy: true }).isURL(),
    body('release_year').optional({ checkFalsy: true }).isInt({ min: 1880, max: 2100 })
];
