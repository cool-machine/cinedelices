import { body } from 'express-validator';

export const createViewRecipeSchema = [
    body('title').trim().notEmpty().isLength({ max: 255 }),
    body('description').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
    body('ingredients').trim().notEmpty(),
    body('instructions').trim().notEmpty(),
    body('category_id').optional({ checkFalsy: true }).isInt(),
    body('media_id').optional({ checkFalsy: true }).isInt(),
    body('difficulty').optional({ checkFalsy: true }).isIn(['facile', 'moyen', 'difficile']),
    body('prep_time').optional({ checkFalsy: true }).isInt({ min: 0 }),
    body('cook_time').optional({ checkFalsy: true }).isInt({ min: 0 }),
    body('image_url').optional({ checkFalsy: true }).isURL()
];

export const updateViewRecipeSchema = [
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

export const updateProfileSchema = [
    body('username').trim().notEmpty().isLength({ min: 3, max: 100 }),
    body('avatar_url').optional({ checkFalsy: true }).isURL(),
    body('bio').optional({ checkFalsy: true }).isLength({ max: 500 })
];

export const rateRecipeSchema = [
    body('stars').notEmpty().isInt({ min: 1, max: 5 })
];

export const createReviewSchema = [
    body('content').trim().notEmpty().isLength({ min: 3, max: 1000 })
];
