import { body } from 'express-validator';

export const createRecipeSchema = [
    body('title').notEmpty().withMessage('Title is required').isString().isLength({ max: 255 }),
    body('ingredients').notEmpty().withMessage('Ingredients are required'),
    body('instructions').notEmpty().withMessage('Instructions are required'),
    body('user_id').optional().isInt(),
    body('difficulty').optional().isIn(['facile', 'moyen', 'difficile']),
    body('prep_time').optional().isInt({ min: 0 }),
    body('cook_time').optional().isInt({ min: 0 }),
    body('image_url').optional({ values: 'falsy' }).isURL().withMessage('Invalid URL format')
];

export const updateRecipeSchema = [
    body('title').optional().isString().isLength({ max: 255 }),
    body('ingredients').optional(),
    body('instructions').optional(),
    body('difficulty').optional().isIn(['facile', 'moyen', 'difficile']),
    body('prep_time').optional().isInt({ min: 0 }),
    body('cook_time').optional().isInt({ min: 0 }),
    body('image_url').optional({ values: 'falsy' }).isURL().withMessage('Invalid URL format')
];
