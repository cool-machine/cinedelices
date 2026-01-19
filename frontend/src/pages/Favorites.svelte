<script>
    import { onMount } from 'svelte';
    import { link, push } from 'svelte-spa-router';
    import { api } from '../lib/api.js';
    import { auth } from '../lib/stores/auth.js';

    let favorites = [];
    let loading = true;
    let error = null;

    onMount(async () => {
        if (!$auth.user) {
            push('/login');
            return;
        }

        try {
            favorites = await api.getFavorites();
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });

    async function removeFavorite(recipeId) {
        try {
            await api.toggleFavorite(recipeId);
            favorites = favorites.filter(f => f.recipe_id !== recipeId);
        } catch (e) {
            alert(e.message);
        }
    }
</script>

<div class="favorites-page">
    <h1>❤️ Mes favoris</h1>

    {#if loading}
        <p class="loading">Chargement...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else if favorites.length === 0}
        <div class="empty">
            <p>Vous n'avez pas encore de favoris</p>
            <a href="/recipes" use:link class="browse-btn">Découvrir des recettes</a>
        </div>
    {:else}
        <div class="recipe-grid">
            {#each favorites as fav}
                {#if fav.recipe}
                    <div class="recipe-card">
                        <a href="/recipes/{fav.recipe.id}" use:link class="recipe-link">
                            <div class="recipe-image">
                                {#if fav.recipe.image_url}
                                    <img src={fav.recipe.image_url} alt={fav.recipe.title} />
                                {:else}
                                    <div class="placeholder">🍽️</div>
                                {/if}
                            </div>
                            <div class="recipe-info">
                                <h3>{fav.recipe.title}</h3>
                                {#if fav.recipe.author}
                                    <p class="author">Par {fav.recipe.author.username}</p>
                                {/if}
                            </div>
                        </a>
                        <button class="remove-btn" on:click={() => removeFavorite(fav.recipe_id)}>
                            🗑️ Retirer
                        </button>
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</div>

<style>
    .favorites-page {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        color: #eee;
        margin-bottom: 2rem;
    }

    .recipe-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
    }

    .recipe-card {
        background: #1a1a2e;
        border-radius: 12px;
        overflow: hidden;
    }

    .recipe-link {
        text-decoration: none;
        display: block;
    }

    .recipe-image {
        height: 180px;
        overflow: hidden;
    }

    .recipe-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.2s;
    }

    .recipe-link:hover .recipe-image img {
        transform: scale(1.05);
    }

    .placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        background: #16213e;
    }

    .recipe-info {
        padding: 1rem;
    }

    .recipe-info h3 {
        color: #eee;
        margin-bottom: 0.25rem;
    }

    .author {
        color: #888;
        font-size: 0.9rem;
    }

    .remove-btn {
        width: 100%;
        padding: 0.75rem;
        background: transparent;
        border: none;
        border-top: 1px solid #333;
        color: #e94560;
        cursor: pointer;
        transition: background 0.2s;
    }

    .remove-btn:hover {
        background: rgba(233, 69, 96, 0.1);
    }

    .empty {
        text-align: center;
        padding: 4rem 2rem;
        background: #1a1a2e;
        border-radius: 12px;
    }

    .empty p {
        color: #888;
        margin-bottom: 1.5rem;
        font-size: 1.1rem;
    }

    .browse-btn {
        display: inline-block;
        background: #e94560;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        text-decoration: none;
    }

    .loading, .error {
        text-align: center;
        padding: 3rem;
        color: #888;
    }

    .error {
        color: #e94560;
    }
</style>
