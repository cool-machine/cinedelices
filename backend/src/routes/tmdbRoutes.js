import express from 'express';
import { searchMedia, getMediaDetails } from '../services/tmdbService.js';

const router = express.Router();

/**
 * Search for movies/series on TMDB
 * GET /api/v1/tmdb/search?query=Ratatouille&type=movie
 */
router.get('/search', async (req, res) => {
    try {
        const { query, type = 'movie' } = req.query;

        if (!query || query.trim().length < 2) {
            return res.status(400).json({
                error: 'Query parameter is required and must be at least 2 characters'
            });
        }

        const results = await searchMedia(query.trim(), type);
        res.json({ results });
    } catch (error) {
        console.error('TMDB search error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get movie/series details including IMDB ID
 * GET /api/v1/tmdb/:id?type=movie
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { type = 'movie' } = req.query;

        const details = await getMediaDetails(parseInt(id, 10), type);
        res.json(details);
    } catch (error) {
        console.error('TMDB details error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
