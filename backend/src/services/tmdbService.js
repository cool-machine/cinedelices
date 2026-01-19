/**
 * TMDB Service - Handles communication with The Movie Database API
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

/**
 * Search for movies/series on TMDB
 * @param {string} query - Search term
 * @param {string} type - 'movie' or 'tv' (default: 'movie')
 * @returns {Promise<Array>} - Array of search results
 */
export async function searchMedia(query, type = 'movie') {
    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
        throw new Error('TMDB_API_KEY is not configured');
    }

    const endpoint = type === 'tv' ? 'search/tv' : 'search/movie';
    const url = `${TMDB_BASE_URL}/${endpoint}?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=fr-FR`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform results to our format
    return data.results.slice(0, 12).map(item => ({
        tmdb_id: item.id,
        title: type === 'tv' ? item.name : item.title,
        poster_url: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : null,
        year: extractYear(type === 'tv' ? item.first_air_date : item.release_date),
        type: type === 'tv' ? 'serie' : 'film',
        overview: item.overview
    }));
}

/**
 * Get movie/series details including IMDB ID
 * @param {number} tmdbId - TMDB ID
 * @param {string} type - 'movie' or 'tv'
 * @returns {Promise<Object>} - Media details with IMDB ID
 */
export async function getMediaDetails(tmdbId, type = 'movie') {
    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
        throw new Error('TMDB_API_KEY is not configured');
    }

    const endpoint = type === 'tv' ? `tv/${tmdbId}` : `movie/${tmdbId}`;
    const url = `${TMDB_BASE_URL}/${endpoint}?api_key=${apiKey}&language=fr-FR&append_to_response=external_ids`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
    }

    const item = await response.json();

    return {
        tmdb_id: item.id,
        title: type === 'tv' ? item.name : item.title,
        poster_url: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : null,
        year: extractYear(type === 'tv' ? item.first_air_date : item.release_date),
        type: type === 'tv' ? 'serie' : 'film',
        overview: item.overview,
        imdb_id: item.imdb_id || item.external_ids?.imdb_id || null
    };
}

/**
 * Extract year from date string
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @returns {number|null} - Year or null
 */
function extractYear(dateStr) {
    if (!dateStr) return null;
    const year = parseInt(dateStr.substring(0, 4), 10);
    return isNaN(year) ? null : year;
}

export default {
    searchMedia,
    getMediaDetails
};
