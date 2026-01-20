<script>
    import { onMount } from "svelte";
    import { link, push } from "svelte-spa-router";
    import { api } from "../lib/api.js";
    import { auth } from "../lib/stores/auth.js";

    export let params = {};

    let recipe = null;
    let reviews = [];
    let loading = true;
    let error = null;
    let userRating = 0;
    let newReview = "";
    let isFavorited = false;

    onMount(async () => {
        try {
            [recipe, reviews] = await Promise.all([
                api.getRecipe(params.id),
                api.getReviews(params.id),
            ]);
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });

    async function handleRate(score) {
        if (!$auth.user) return push("/login");
        try {
            await api.rateRecipe(params.id, score);
            userRating = score;
        } catch (e) {
            alert(e.message);
        }
    }

    async function handleFavorite() {
        if (!$auth.user) return push("/login");
        try {
            const result = await api.toggleFavorite(params.id);
            isFavorited = result.favorited;
        } catch (e) {
            alert(e.message);
        }
    }

    async function handleReview() {
        if (!$auth.user) return push("/login");
        if (!newReview.trim()) return;
        try {
            const review = await api.createReview(params.id, newReview);
            reviews = [review, ...reviews];
            newReview = "";
        } catch (e) {
            alert(e.message);
        }
    }

    async function handleDelete() {
        if (!confirm("Supprimer cette recette ?")) return;
        try {
            await api.deleteRecipe(params.id);
            push("/recipes");
        } catch (e) {
            alert(e.message);
        }
    }

    // Parse instructions into steps
    function parseInstructions(text) {
        if (!text) return [];
        return text.split("\n").filter((line) => line.trim());
    }

    $: canEdit =
        $auth.user &&
        recipe &&
        ($auth.user.id === recipe.user_id || $auth.user.role === "admin");
    $: instructionSteps = recipe ? parseInstructions(recipe.instructions) : [];
</script>

<div class="recipe-detail-page">
    {#if loading}
        <p class="loading">Chargement...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else if recipe}
        <!-- Film Strip Top -->
        <div class="film-strip-border"></div>

        <!-- Main Content Grid -->
        <div class="recipe-layout">
            <!-- Left: Recipe Content -->
            <div class="recipe-main">
                <!-- Header Info -->
                <div class="recipe-header-info">
                    <div class="header-left">
                        <p class="recipe-label">
                            Titre: <span class="recipe-title-text"
                                >{recipe.title}</span
                            >
                        </p>
                        <p class="recipe-description">
                            {recipe.description ||
                                "Un plat traditionnel de légumes mijotés du film"}
                        </p>
                    </div>
                    <div class="header-right">
                        <p class="author-info">
                            Auteur: <span
                                >{recipe.author?.username || "Chef"}</span
                            >
                        </p>
                        <p class="date-info">
                            Date: <span
                                >{new Date(
                                    recipe.created_at,
                                ).toLocaleDateString("fr-FR", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}</span
                            >
                        </p>
                    </div>
                </div>

                <!-- Recipe Image -->
                <div class="recipe-hero-image">
                    {#if recipe.image_url}
                        <img src={recipe.image_url} alt={recipe.title} />
                    {:else}
                        <div class="placeholder">🍽️</div>
                    {/if}
                </div>

                <!-- Meta Icons Row -->
                <div class="meta-icons-row">
                    <div class="meta-item">
                        <div class="meta-icon">⏱️</div>
                        <span class="meta-label">Temps Préparation</span>
                        <span class="meta-value"
                            >{recipe.prep_time || 45} min</span
                        >
                    </div>
                    <div class="meta-item">
                        <div class="meta-icon">🍳</div>
                        <span class="meta-label">Temps Cuisson</span>
                        <span class="meta-value"
                            >{recipe.cook_time || 30} min</span
                        >
                    </div>
                    <div class="meta-item">
                        <div class="meta-icon">👥</div>
                        <span class="meta-label">Portions</span>
                        <span class="meta-value"
                            >{recipe.servings || 4} pers</span
                        >
                    </div>
                    <div class="meta-item">
                        <div class="meta-icon">📊</div>
                        <span class="meta-label">Difficulté</span>
                        <span class="meta-value"
                            >{recipe.difficulty || "Moyen"}</span
                        >
                    </div>
                    <div class="meta-item">
                        <div class="meta-icon">📁</div>
                        <span class="meta-label">Catégorie</span>
                        <span class="meta-value"
                            >{recipe.category?.name || "Plat Principal"}</span
                        >
                    </div>
                </div>

                <!-- Ingredients, Icons, Chef Hat Row -->
                <div class="ingredients-row">
                    <div class="ingredient-col">
                        <div class="col-icon">🥗</div>
                        <h3>Ingredients</h3>
                        <p>{recipe.ingredients || "Ingrédients à venir"}</p>
                    </div>
                    <div class="ingredient-col">
                        <div class="col-icon">🫒</div>
                        <h3>Icons</h3>
                        <p>Olive Oil, Herbs de Provence, Salt, Pepper</p>
                    </div>
                    <div class="ingredient-col">
                        <div class="col-icon">👨‍🍳</div>
                        <h3>Chef Hat</h3>
                        <p>Eggplant, brosssonnibes</p>
                    </div>
                </div>
            </div>

            <!-- Right: TMDB Sidebar -->
            <aside class="tmdb-sidebar">
                {#if recipe.media}
                    <div class="movie-poster">
                        <img
                            src={recipe.media.image_url ||
                                "https://via.placeholder.com/200x300?text=Movie"}
                            alt={recipe.media.title}
                        />
                    </div>
                {:else}
                    <div class="movie-poster placeholder-poster">
                        <span>TMDB</span>
                    </div>
                {/if}

                <h3 class="sidebar-title">Info</h3>
                <div class="movie-info">
                    <p>
                        <strong>Released:</strong>
                        {recipe.media?.release_year || "2007"}
                    </p>
                    <p>
                        <strong>Director:</strong>
                        {recipe.media?.director || "Brad Bird"}
                    </p>
                    <p>
                        <strong>Studio:</strong>
                        {recipe.media?.studio || "Pixar"}
                    </p>
                    <p>
                        <strong>Rating:</strong>
                        {recipe.media?.rating || "8.1"}/10
                    </p>
                </div>

                <!-- Actions -->
                <div class="sidebar-actions">
                    <button
                        class="favorite-btn"
                        class:active={isFavorited}
                        on:click={handleFavorite}
                    >
                        {isFavorited ? "❤️" : "🤍"} Favoris
                    </button>

                    <div class="rating">
                        {#each [1, 2, 3, 4, 5] as star}
                            <button
                                class="star"
                                class:active={star <= userRating}
                                on:click={() => handleRate(star)}>★</button
                            >
                        {/each}
                    </div>

                    {#if canEdit}
                        <a
                            href="/recipes/{recipe.id}/edit"
                            use:link
                            class="edit-btn">✏️ Modifier</a
                        >
                        <button class="delete-btn" on:click={handleDelete}
                            >🗑️ Supprimer</button
                        >
                    {/if}
                </div>
            </aside>
        </div>

        <!-- Instructions Section -->
        <section class="instructions-section">
            <h2>Instructions</h2>
            <div class="instructions-grid">
                {#each instructionSteps as step, i}
                    <div class="instruction-step">
                        <span class="step-number">{i + 1}</span>
                        <p>{step}</p>
                    </div>
                {:else}
                    <div class="instruction-step">
                        <span class="step-number">1</span>
                        <p>
                            {recipe.instructions ||
                                "Suivez les étapes de la recette..."}
                        </p>
                    </div>
                {/each}
            </div>
        </section>

        <!-- User Comments Section -->
        <section class="comments-section">
            <h2>User Comments</h2>

            <div class="comment-avatars">
                {#each reviews.slice(0, 6) as review, i}
                    <div
                        class="comment-avatar"
                        title={review.author?.username || "User"}
                    >
                        <span class="avatar-initial"
                            >{(review.author?.username ||
                                "U")[0].toUpperCase()}</span
                        >
                        <div class="avatar-rating">
                            {"★".repeat(Math.min(5, i + 3))}
                        </div>
                    </div>
                {:else}
                    {#each [1, 2, 3, 4, 5, 6] as _}
                        <div class="comment-avatar placeholder">
                            <span class="avatar-initial">?</span>
                            <div class="avatar-rating">★★★★</div>
                        </div>
                    {/each}
                {/each}
            </div>

            {#if $auth.user}
                <form
                    on:submit|preventDefault={handleReview}
                    class="review-form"
                >
                    <textarea
                        bind:value={newReview}
                        placeholder="Partagez votre avis..."
                        rows="3"
                    ></textarea>
                    <button type="submit" class="btn-submit">Publier</button>
                </form>
            {:else}
                <p class="login-prompt">
                    <a href="/login" use:link>Connectez-vous</a> pour laisser un
                    avis
                </p>
            {/if}

            <div class="reviews-list">
                {#each reviews as review}
                    <div class="review">
                        <div class="review-header">
                            <strong
                                >{review.author?.username || "Anonyme"}</strong
                            >
                            <span class="date"
                                >{new Date(
                                    review.created_at,
                                ).toLocaleDateString()}</span
                            >
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
    .recipe-detail-page {
        background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
        min-height: 100vh;
    }

    .film-strip-border {
        height: 20px;
        background: var(--or-cinema);
        position: relative;
    }

    .film-strip-border::before {
        content: "";
        position: absolute;
        top: 3px;
        left: 0;
        right: 0;
        height: 14px;
        background: repeating-linear-gradient(
            to right,
            transparent,
            transparent 15px,
            #0a0a0a 15px,
            #0a0a0a 25px
        );
    }

    /* Layout */
    .recipe-layout {
        display: grid;
        grid-template-columns: 1fr 280px;
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    /* Recipe Main */
    .recipe-main {
        background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
        border-radius: 12px;
        border: 1px solid rgba(212, 175, 55, 0.3);
        overflow: hidden;
    }

    /* Header Info */
    .recipe-header-info {
        display: flex;
        justify-content: space-between;
        padding: 1.5rem;
        background: rgba(139, 0, 0, 0.3);
        border-bottom: 2px solid var(--or-cinema);
    }

    .recipe-label {
        color: var(--or-cinema);
        font-weight: 600;
    }

    .recipe-title-text {
        color: var(--blanc-casse);
    }

    .recipe-description {
        color: var(--or-cinema);
        font-family: var(--font-accent);
        font-style: italic;
        margin-top: 0.5rem;
    }

    .author-info,
    .date-info {
        color: var(--or-cinema);
        text-align: right;
        font-size: 0.9rem;
    }

    .author-info span,
    .date-info span {
        color: var(--blanc-casse);
    }

    /* Hero Image */
    .recipe-hero-image {
        height: 300px;
        overflow: hidden;
    }

    .recipe-hero-image img {
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
        background: #1a1a1a;
    }

    /* Meta Icons Row */
    .meta-icons-row {
        display: flex;
        justify-content: space-around;
        padding: 1.5rem;
        background: var(--or-cinema);
        gap: 1rem;
    }

    .meta-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.3rem;
    }

    .meta-icon {
        font-size: 1.8rem;
        background: rgba(0, 0, 0, 0.3);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .meta-label {
        font-size: 0.75rem;
        color: var(--noir-pur);
        text-transform: uppercase;
    }

    .meta-value {
        font-family: var(--font-title);
        font-size: 1rem;
        color: var(--noir-pur);
    }

    /* Ingredients Row */
    .ingredients-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        padding: 1.5rem;
        background: rgba(139, 0, 0, 0.2);
        border-top: 2px solid var(--or-cinema);
    }

    .ingredient-col {
        text-align: center;
    }

    .col-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .ingredient-col h3 {
        font-family: var(--font-title);
        color: var(--or-cinema);
        margin-bottom: 0.5rem;
    }

    .ingredient-col p {
        color: #ccc;
        font-size: 0.85rem;
    }

    /* TMDB Sidebar */
    .tmdb-sidebar {
        background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
        border-radius: 12px;
        border: 1px solid rgba(212, 175, 55, 0.3);
        padding: 1.5rem;
        height: fit-content;
        position: sticky;
        top: 100px;
    }

    .movie-poster {
        width: 100%;
        aspect-ratio: 2/3;
        border-radius: 8px;
        overflow: hidden;
        border: 3px solid var(--or-cinema);
        margin-bottom: 1rem;
    }

    .movie-poster img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .placeholder-poster {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #2a2a2a;
        font-family: var(--font-title);
        font-size: 2rem;
        color: var(--or-cinema);
    }

    .sidebar-title {
        font-family: var(--font-title);
        color: var(--or-cinema);
        font-size: 1.3rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid var(--or-cinema);
        padding-bottom: 0.5rem;
    }

    .movie-info p {
        color: #ccc;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }

    .movie-info strong {
        color: var(--or-cinema);
    }

    /* Sidebar Actions */
    .sidebar-actions {
        margin-top: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .favorite-btn,
    .edit-btn,
    .delete-btn {
        padding: 0.6rem 1rem;
        border-radius: 4px;
        border: 1px solid var(--or-cinema);
        cursor: pointer;
        font-size: 0.85rem;
        text-decoration: none;
        text-align: center;
        transition: all 0.3s;
    }

    .favorite-btn {
        background: transparent;
        color: var(--or-cinema);
    }

    .favorite-btn.active {
        background: var(--rouge-rideau);
        border-color: var(--rouge-rideau);
        color: white;
    }

    .edit-btn {
        background: var(--or-cinema);
        color: var(--noir-pur);
    }

    .delete-btn {
        background: var(--rouge-rideau);
        color: white;
        border-color: var(--rouge-rideau);
    }

    .rating {
        display: flex;
        justify-content: center;
        gap: 0.25rem;
    }

    .star {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #444;
        cursor: pointer;
        padding: 0;
        transition: color 0.2s;
    }

    .star.active,
    .star:hover {
        color: var(--or-cinema);
    }

    /* Instructions Section */
    .instructions-section {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 2rem;
    }

    .instructions-section h2 {
        font-family: var(--font-title);
        color: var(--or-cinema);
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
    }

    .instructions-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
    }

    .instruction-step {
        background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
        border-radius: 8px;
        padding: 1.5rem;
        border: 1px solid rgba(212, 175, 55, 0.2);
    }

    .step-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: var(--or-cinema);
        color: var(--noir-pur);
        border-radius: 50%;
        font-family: var(--font-title);
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }

    .instruction-step p {
        color: #ccc;
        font-size: 0.9rem;
        line-height: 1.6;
    }

    /* Comments Section */
    .comments-section {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 2rem 2rem;
    }

    .comments-section h2 {
        font-family: var(--font-title);
        color: var(--or-cinema);
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
    }

    .comment-avatars {
        display: flex;
        gap: 1.5rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }

    .comment-avatar {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .avatar-initial {
        width: 50px;
        height: 50px;
        background: var(--rouge-rideau);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        border: 2px solid var(--or-cinema);
    }

    .avatar-rating {
        color: var(--or-cinema);
        font-size: 0.75rem;
    }

    .review-form {
        margin-bottom: 1.5rem;
    }

    .review-form textarea {
        width: 100%;
        padding: 1rem;
        border: 1px solid rgba(212, 175, 55, 0.3);
        border-radius: 8px;
        background: rgba(26, 26, 26, 0.8);
        color: var(--blanc-casse);
        resize: vertical;
        margin-bottom: 0.5rem;
    }

    .btn-submit {
        background: var(--or-cinema);
        color: var(--noir-pur);
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-family: var(--font-title);
        text-transform: uppercase;
    }

    .login-prompt {
        color: #888;
        margin-bottom: 1.5rem;
    }

    .login-prompt a {
        color: var(--or-cinema);
    }

    .review {
        padding: 1rem;
        background: rgba(26, 26, 26, 0.5);
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    .review-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }

    .review-header strong {
        color: var(--or-cinema);
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

    .loading,
    .error {
        text-align: center;
        padding: 3rem;
        color: #888;
    }

    .error {
        color: var(--rouge-rideau);
    }

    /* Responsive */
    @media (max-width: 900px) {
        .recipe-layout {
            grid-template-columns: 1fr;
        }

        .tmdb-sidebar {
            position: static;
        }

        .instructions-grid {
            grid-template-columns: 1fr;
        }

        .meta-icons-row {
            flex-wrap: wrap;
        }

        .ingredients-row {
            grid-template-columns: 1fr;
        }
    }
</style>
