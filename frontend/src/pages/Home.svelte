<script>
    import { onMount } from 'svelte';
    import { link } from 'svelte-spa-router';
    import { api } from '../lib/api.js';

    let recipes = [];
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            recipes = await api.getRecipes();
            recipes = recipes.slice(0, 6); // Show only 6 featured recipes
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });
</script>

<div class="home">
    <section class="hero">
        <h1>🎬 CinéDélices</h1>
        <p>Découvrez les recettes inspirées de vos films et séries préférés</p>
        <a href="/recipes" use:link class="cta-button">Explorer les recettes</a>
    </section>

    <section class="featured">
        <h2>Recettes à la une</h2>
        
        {#if loading}
            <p class="loading">Chargement...</p>
        {:else if error}
            <p class="error">{error}</p>
        {:else if recipes.length === 0}
            <p>Aucune recette disponible</p>
        {:else}
            <div class="recipe-grid">
                {#each recipes as recipe}
                    <a href="/recipes/{recipe.id}" use:link class="recipe-card">
                        <div class="recipe-image">
                            {#if recipe.image_url}
                                <img src={recipe.image_url} alt={recipe.title} />
                            {:else}
                                <div class="placeholder">🍽️</div>
                            {/if}
                        </div>
                        <div class="recipe-info">
                            <h3>{recipe.title}</h3>
                            {#if recipe.media}
                                <span class="media-tag">{recipe.media.title}</span>
                            {/if}
                            {#if recipe.category}
                                <span class="category-tag">{recipe.category.name}</span>
                            {/if}
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    </section>
</div>

<style>
    .home {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .hero {
        text-align: center;
        padding: 4rem 2rem;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 12px;
        margin-bottom: 3rem;
    }

    .hero h1 {
        font-size: 3rem;
        color: #e94560;
        margin-bottom: 1rem;
    }

    .hero p {
        font-size: 1.2rem;
        color: #ccc;
        margin-bottom: 2rem;
    }

    .cta-button {
        display: inline-block;
        background: #e94560;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(233, 69, 96, 0.4);
    }

    .featured h2 {
        font-size: 2rem;
        margin-bottom: 1.5rem;
        color: #eee;
    }

    .recipe-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .recipe-card {
        background: #1a1a2e;
        border-radius: 12px;
        overflow: hidden;
        text-decoration: none;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .recipe-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    }

    .recipe-image {
        height: 200px;
        overflow: hidden;
    }

    .recipe-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        background: #16213e;
    }

    .recipe-info {
        padding: 1rem;
    }

    .recipe-info h3 {
        color: #eee;
        margin-bottom: 0.5rem;
    }

    .media-tag, .category-tag {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        margin-right: 0.5rem;
    }

    .media-tag {
        background: #e94560;
        color: white;
    }

    .category-tag {
        background: #0f3460;
        color: #ccc;
    }

    .loading, .error {
        text-align: center;
        padding: 2rem;
        color: #ccc;
    }

    .error {
        color: #e94560;
    }
</style>
