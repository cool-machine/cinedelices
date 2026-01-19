<script>
    import { onMount } from "svelte";
    import { link } from "svelte-spa-router";
    import { api } from "../lib/api.js";

    let recipes = [];
    let categories = [];
    let media = [];
    let loading = true;
    let error = null;

    let selectedCategory = "";
    let selectedMedia = "";
    let searchQuery = "";

    onMount(async () => {
        try {
            const [fetchedRecipes, fetchedCategories, fetchedMedia] =
                await Promise.all([
                    api.getRecipes(),
                    api.getCategories(),
                    api.getMedia(),
                ]);

            recipes = fetchedRecipes;
            categories = fetchedCategories;
            media = fetchedMedia;
        } catch (e) {
            error = e.message;
            // Fallback to mock data if API fails
            recipes = [
                {
                    id: "mock-1",
                    title: "Ratatouille de Rémy",
                    image_url:
                        "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=800",
                    author: { username: "Rémy" },
                    media: { title: "Ratatouille" },
                    category: { name: "Plat Principal" },
                },
                {
                    id: "mock-2",
                    title: "Los Pollos Hermanos Chicken",
                    image_url:
                        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800",
                    author: { username: "Gus Fring" },
                    media: { title: "Breaking Bad" },
                    category: { name: "Fast Food" },
                },
                {
                    id: "mock-3",
                    title: "Lembas Bread",
                    image_url:
                        "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800",
                    author: { username: "Legolas" },
                    media: { title: "Lord of the Rings" },
                    category: { name: "Dessert" },
                },
                {
                    id: "mock-4",
                    title: "Butterbeer",
                    image_url:
                        "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=800",
                    author: { username: "Harry" },
                    media: { title: "Harry Potter" },
                    category: { name: "Boissons" },
                },
            ];
        } finally {
            loading = false;
        }
    });

    $: filteredRecipes = recipes.filter((recipe) => {
        const matchesCategory =
            !selectedCategory || recipe.category_id == selectedCategory;
        const matchesMedia = !selectedMedia || recipe.media_id == selectedMedia;
        const matchesSearch =
            !searchQuery ||
            recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesMedia && matchesSearch;
    });
</script>

<div class="recipes-page">
    <h1>🍽️ Toutes les recettes</h1>

    <div class="filters">
        <input
            type="text"
            placeholder="Rechercher..."
            bind:value={searchQuery}
        />

        <select bind:value={selectedCategory}>
            <option value="">Toutes les catégories</option>
            {#each categories as cat}
                <option value={cat.id}>{cat.name}</option>
            {/each}
        </select>

        <select bind:value={selectedMedia}>
            <option value="">Tous les médias</option>
            {#each media as m}
                <option value={m.id}>{m.title}</option>
            {/each}
        </select>
    </div>

    {#if loading}
        <p class="loading">Chargement...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else if filteredRecipes.length === 0}
        <p class="empty">Aucune recette trouvée</p>
    {:else}
        <div class="recipe-grid">
            {#each filteredRecipes as recipe}
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
                        {#if recipe.author}
                            <p class="author">Par {recipe.author.username}</p>
                        {/if}
                        <div class="tags">
                            {#if recipe.media}
                                <span class="media-tag"
                                    >{recipe.media.title}</span
                                >
                            {/if}
                            {#if recipe.category}
                                <span class="category-tag"
                                    >{recipe.category.name}</span
                                >
                            {/if}
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</div>

<style>
    .recipes-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        font-size: 2rem;
        color: #eee;
        margin-bottom: 2rem;
    }

    .filters {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }

    .filters input,
    .filters select {
        padding: 0.75rem 1rem;
        border: 1px solid #333;
        border-radius: 8px;
        background: #1a1a2e;
        color: #eee;
        font-size: 1rem;
    }

    .filters input {
        flex: 1;
        min-width: 200px;
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
        text-decoration: none;
        transition:
            transform 0.2s,
            box-shadow 0.2s;
    }

    .recipe-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }

    .recipe-image {
        height: 180px;
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
        margin-bottom: 0.5rem;
    }

    .tags {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .media-tag,
    .category-tag {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
    }

    .media-tag {
        background: #e94560;
        color: white;
    }

    .category-tag {
        background: #0f3460;
        color: #ccc;
    }

    .loading,
    .error,
    .empty {
        text-align: center;
        padding: 3rem;
        color: #888;
    }

    .error {
        color: #e94560;
    }
</style>
