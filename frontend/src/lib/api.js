const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        credentials: 'include',
        ...options
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    if (response.status === 204) return null;
    return response.json();
}

export const api = {
    // Auth
    login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    getMe: () => request('/auth/me'),

    // Recipes
    getRecipes: () => request('/recipes'),
    getRecipe: (id) => request(`/recipes/${id}`),
    createRecipe: (data) => request('/recipes', { method: 'POST', body: JSON.stringify(data) }),
    updateRecipe: (id, data) => request(`/recipes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteRecipe: (id) => request(`/recipes/${id}`, { method: 'DELETE' }),

    // Recipe interactions
    toggleFavorite: (id) => request(`/recipes/${id}/favorite`, { method: 'POST' }),
    rateRecipe: (id, score) => request(`/recipes/${id}/rate`, { method: 'POST', body: JSON.stringify({ score }) }),
    getReviews: (id) => request(`/recipes/${id}/reviews`),
    createReview: (id, content) => request(`/recipes/${id}/reviews`, { method: 'POST', body: JSON.stringify({ content }) }),

    // Users
    getUser: (id) => request(`/users/${id}`),
    updateUser: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

    // Favorites
    getFavorites: () => request('/favorites'),

    // Metadata
    getCategories: () => request('/categories'),
    getMedia: () => request('/media'),
    createMedia: (data) => request('/media', { method: 'POST', body: JSON.stringify(data) }),

    // Admin
    admin: {
        getStats: () => request('/admin/stats'),
        getRecipes: () => request('/admin/recipes'),
        updateRecipe: (id, data) => request(`/admin/recipes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteRecipe: (id) => request(`/admin/recipes/${id}`, { method: 'DELETE' }),
        getCategories: () => request('/admin/categories'),
        createCategory: (data) => request('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
        updateCategory: (id, data) => request(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteCategory: (id) => request(`/admin/categories/${id}`, { method: 'DELETE' }),
        getMedia: () => request('/admin/media'),
        createMedia: (data) => request('/admin/media', { method: 'POST', body: JSON.stringify(data) }),
        updateMedia: (id, data) => request(`/admin/media/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteMedia: (id) => request(`/admin/media/${id}`, { method: 'DELETE' }),
        getUsers: () => request('/admin/users'),
        updateUser: (id, data) => request(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' })
    }
};
