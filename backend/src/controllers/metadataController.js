import db from '../models/index.js';

const { Category, Media } = db;

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllMedia = async (req, res) => {
    try {
        const media = await Media.findAll();
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
