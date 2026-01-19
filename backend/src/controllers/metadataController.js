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

export const createMedia = async (req, res) => {
    try {
        const { title, type, release_year, tmdb_id, poster_url } = req.body;

        // Simple validation or duplicate check could go here

        const newMedia = await Media.create({
            title,
            type,
            release_year,
            tmdb_id,
            poster_url
        });

        res.status(201).json(newMedia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
