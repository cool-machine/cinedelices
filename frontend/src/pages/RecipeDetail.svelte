<script>
    import { onMount } from 'svelte';
    import { link, push } from 'svelte-spa-router';
    import { api } from '../lib/api.js';
    import { auth } from '../lib/stores/auth.js';

    export let params = {};

    let recipe = null;
    let reviews = [];
    let loading = true;
    let error = null;
    let userRating = 0;
    let newReview = '';
    let isFavorited = false;

    onMount(async () => {
        try {
            [recipe, reviews] = await Promise.all([
                api.getRecipe(params.id),
                api.getReviews(params.id)
            ]);
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });

    async function handleRate(score) {
        if (!$auth.user) return push('/login');
        try {
            await api.rateRecipe(params.id, score);
            userRating = score;
        } catch (e) {
            alert(e.message);
        }
    }

    async function handleFavorite() {
        if (!$auth.user) return push('/login');
        try {
            const result = await api.toggleFavorite(params.id);
            isFavorited = result.favorited;
        } catch (e) {
            alert(e.message);
        }
    }

    async function handleReview() {
        if (!$auth.user) return push('/login');
        if (!newReview.trim()) return;
        try {
            const review = await api.createReview(params.id, newReview);
            reviews = [review, ...reviews];
            newReview = '';
        } catch (e) {
            alert(e.message);
        }
    }

    async function handleDelete() {
        if (!confirm('Supprimer cette recette ?')) return;
        try {
            await api.deleteRecipe(params.id);
            push('/recipes');
        } catch (e) {
            alert(e.message);
        }
    }

    $: canEdit = $auth.user && recipe && 
        ($auth.user.id === recipe.user_id || $auth.user.role === 'admin');
</script>

<div class="recipe-detail">
    {#if loading}
        <p class="loading">Chargement...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else if recipe}
        <div class="recipe-header">
            <div class="recipe-image">
                {#if recipe.image_url}
                    <img src={recipe.image_url} alt={recipe.title} />
                {:else}
                    <div class="placeholder">🍽️</div>
                {/if}
            </div>
            
            <div class="recipe-meta">
                <h1>{recipe.title}</h1>
                
                <div class="tags">
                    {#if recipe.media}
                        <span class="media-tag">🎬 {recipe.media.title}</span>
                    {/if}
                    {#if recipe.category}
                        <span class="category-tag">{recipe.category.name}</span>
                    {/if}
                </div>

                {#if recipe.author}
                    <p class="author">
                        Par <a href="/profile/{recipe.author.id}" use:link>{recipe.author.username}</a>
                    </p>
                {/if}

                <div class="actions">
                    <button class="favorite-btn" class:active={isFavorited} on:click={handleFavorite}>
                        {isFavorited ? '❤️' : '🤍'} Favoris
                    </button>
                    
                    <div class="rating">
                        {#each [1,2,3,4,5] as star}
                            <button 
                                class="star" 
                                class:active={star <= userRating}
                                on:click={() => handleRate(star)}
                            >★</button>
                        {/each}
                    </div>

                    {#if canEdit}
                        <a href="/recipes/{recipe.id}/edit" use:link class="edit-btn">✏️ Modifier</a>
                        <button class="delete-btn" on:click={handleDelete}>🗑️ Supprimer</button>
                    {/if}
                </div>
            </div>
        </div>

        <div class="recipe-content">
            <section class="description">
                <h2>Description</h2>
                <p>{recipe.description || 'Aucune description'}</p>
            </section>

            <section class="ingredients">
                <h2>Ingrédients</h2>
                <p class="content">{recipe.ingredients || 'Aucun ingrédient listé'}</p>
            </section>

            <section class="instructions">
                <h2>Instructions</h2>
                <p class="content">{recipe.instructions || 'Aucune instruction'}</p>
            </section>
        </div>

        <section class="reviews">
            <h2>Avis ({reviews.length})</h2>
            
            {#if $auth.user}
                <form on:submit|preventDefault={handleReview} class="review-form">
                    <textarea 
                        bind:value={newReview} 
                        placeholder="Partagez votre avis..."
                        rows="3"
                    ></textarea>
                    <button type="submit">Publier</button>
                </form>
            {:else}
                <p class="login-prompt">
                    <a href="/login" use:link>Connectez-vous</a> pour laisser un avis
                </p>
            {/if}

            <div class="reviews-list">
                {#each reviews as review}
                    <div class="review">
                        <div class="review-header">
                            <strong>{review.author?.username || 'Anonyme'}</strong>
                            <span class="date">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        <p>{review.content}</p>
                    </div>
                {:else}
                    <p class="no-reviews">Aucun avis pour le moment</p>
                {/each}
            </div>
        </section>
    {/if}
</div>

<style>
    .recipe-detail {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
    }

    .recipe-header {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
        .recipe-header {
            grid-template-columns: 1fr;
        }
    }

    .recipe-image {
        border-radius: 12px;
        overflow: hidden;
        height: 300px;
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
        font-size: 5rem;
        background: #1a1a2e;
    }

    .recipe-meta h1 {
        font-size: 2rem;
        color: #eee;
        margin-bottom: 1rem;
    }

    .tags {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .media-tag, .category-tag {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
    }

    .media-tag {
        background: #e94560;
        color: white;
    }

    .category-tag {
        background: #0f3460;
        color: #ccc;
    }

    .author {
        color: #888;
        margin-bottom: 1rem;
    }

    .author a {
        color: #e94560;
    }

    .actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        align-items: center;
    }

    .favorite-btn, .edit-btn, .delete-btn {
        padding: 0.5rem 1rem;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        text-decoration: none;
    }

    .favorite-btn {
        background: #1a1a2e;
        color: #eee;
        border: 1px solid #333;
    }

    .favorite-btn.active {
        background: #e94560;
        border-color: #e94560;
    }

    .edit-btn {
        background: #0f3460;
        color: #eee;
    }

    .delete-btn {
        background: #dc3545;
        color: white;
    }

    .rating {
        display: flex;
        gap: 0.25rem;
    }

    .star {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #444;
        cursor: pointer;
        padding: 0;
    }

    .star.active {
        color: #ffc107;
    }

    .recipe-content section {
        background: #1a1a2e;
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
    }

    .recipe-content h2 {
        color: #e94560;
        margin-bottom: 1rem;
        font-size: 1.3rem;
    }

    .recipe-content p, .content {
        color: #ccc;
        line-height: 1.6;
        white-space: pre-wrap;
    }

    .reviews {
        background: #1a1a2e;
        padding: 1.5rem;
        border-radius: 12px;
    }

    .reviews h2 {
        color: #eee;
        margin-bottom: 1.5rem;
    }

    .review-form {
        margin-bottom: 1.5rem;
    }

    .review-form textarea {
        width: 100%;
        padding: 1rem;
        border: 1px solid #333;
        border-radius: 8px;
        background: #16213e;
        color: #eee;
        resize: vertical;
        margin-bottom: 0.5rem;
    }

    .review-form button {
        background: #e94560;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
    }

    .login-prompt {
        color: #888;
        margin-bottom: 1.5rem;
    }

    .login-prompt a {
        color: #e94560;
    }

    .review {
        padding: 1rem;
        border-bottom: 1px solid #333;
    }

    .review:last-child {
        border-bottom: none;
    }

    .review-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }

    .review-header strong {
        color: #eee;
    }

    .date {
        color: #666;
        font-size: 0.85rem;
    }

    .review p {
        color: #ccc;
    }

    .no-reviews {
        color: #666;
        text-align: center;
        padding: 2rem;
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
