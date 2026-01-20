<script>
    import { onMount } from "svelte";
    import { link } from "svelte-spa-router";
    import { api } from "../lib/api.js";

    let featuredRecipes = [];
    let comingSoonRecipes = [];
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            const recipes = await api.getRecipes();
            featuredRecipes = recipes.slice(0, 4); // "Now Playing" section
            comingSoonRecipes = recipes.slice(4, 7); // "Coming Soon" section
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });
</script>

<div class="home">
    <!-- Hero Section with Film Strip Frame -->
    <section class="hero-cinema">
        <div class="film-strip-top"></div>
        <div class="hero-content">
            <div class="hero-featured">
                {#if featuredRecipes[0]}
                    <div class="featured-image-frame">
                        <img 
                            src={featuredRecipes[0].image_url || "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600"} 
                            alt={featuredRecipes[0].title}
                        />
                        <div class="film-projector-overlay"></div>
                    </div>
                {:else}
                    <div class="featured-image-frame">
                        <img src="https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600" alt="Featured dish" />
                        <div class="film-projector-overlay"></div>
                    </div>
                {/if}
            </div>
            <div class="hero-text">
                <h1 class="hero-title">
                    {#if featuredRecipes[0]}
                        {featuredRecipes[0].media?.title || "The Godfather"}
                    {:else}
                        The Godfather
                    {/if}
                </h1>
                <h2 class="hero-subtitle">
                    {#if featuredRecipes[0]}
                        {featuredRecipes[0].title}
                    {:else}
                        Spaghetti
                    {/if}
                </h2>
                <p class="hero-description">
                    An offer you can't refuse. Recreate the iconic dish from the cinematic masterpiece.
                </p>
                <a href={featuredRecipes[0] ? `/recipes/${featuredRecipes[0].id}` : "/recipes"} use:link class="btn btn-cinema">
                    View Recipe & Film Pairing
                </a>
            </div>
        </div>
        <div class="film-strip-bottom"></div>
    </section>

    <!-- Now Playing Section -->
    <section class="now-playing">
        <div class="section-header">
            <div class="header-decoration left"></div>
            <h2>Now Playing: Culinary Features</h2>
            <div class="header-decoration right"></div>
        </div>

        {#if loading}
            <p class="loading">Chargement...</p>
        {:else if error}
            <p class="error">{error}</p>
        {:else if featuredRecipes.length === 0}
            <p class="empty">Aucune recette disponible</p>
        {:else}
            <div class="film-strip-container">
                <div class="film-perforations left"></div>
                <div class="recipe-film-grid">
                    {#each featuredRecipes as recipe}
                        <a href="/recipes/{recipe.id}" use:link class="recipe-film-card">
                            <div class="card-image">
                                {#if recipe.image_url}
                                    <img src={recipe.image_url} alt={recipe.title} />
                                {:else}
                                    <div class="placeholder">🍽️</div>
                                {/if}
                            </div>
                            <div class="card-content">
                                <span class="media-title">{recipe.media?.title || "Classic Film"}</span>
                                <h3>{recipe.title}</h3>
                                <p class="card-meta">
                                    {#if recipe.author}
                                        {recipe.author.username}
                                    {/if}
                                </p>
                                <span class="view-recipe-btn">View Recipe</span>
                            </div>
                        </a>
                    {/each}
                </div>
                <div class="film-perforations right"></div>
            </div>
        {/if}
    </section>

    <!-- Coming Soon Section -->
    {#if comingSoonRecipes.length > 0}
        <section class="coming-soon">
            <div class="section-header gold-border">
                <h2>Coming Soon: Film Festival Favorites</h2>
            </div>
            <div class="coming-soon-grid">
                {#each comingSoonRecipes as recipe}
                    <a href="/recipes/{recipe.id}" use:link class="coming-soon-card">
                        <div class="card-thumbnail">
                            {#if recipe.image_url}
                                <img src={recipe.image_url} alt={recipe.title} />
                            {:else}
                                <div class="placeholder-small">🎬</div>
                            {/if}
                        </div>
                        <div class="card-info">
                            <span class="label">Coming Soon</span>
                            <h4>{recipe.media?.title || recipe.title}</h4>
                            <span class="preview-btn">Preview</span>
                        </div>
                    </a>
                {/each}
            </div>
        </section>
    {/if}
</div>

<style>
    .home {
        background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
        min-height: 100vh;
    }

    /* ========== HERO SECTION ========== */
    .hero-cinema {
        position: relative;
        padding: 0;
        background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%);
    }

    .film-strip-top, .film-strip-bottom {
        height: 25px;
        background: var(--or-cinema);
        position: relative;
    }

    .film-strip-top::before, .film-strip-bottom::before {
        content: '';
        position: absolute;
        top: 5px;
        left: 0;
        right: 0;
        height: 15px;
        background: repeating-linear-gradient(
            to right,
            transparent,
            transparent 20px,
            #0d0d0d 20px,
            #0d0d0d 35px
        );
    }

    .hero-content {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: 3rem;
        padding: 3rem 5%;
        max-width: 1400px;
        margin: 0 auto;
        align-items: center;
    }

    .featured-image-frame {
        position: relative;
        border: 8px solid var(--or-cinema);
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.2);
    }

    .featured-image-frame img {
        width: 100%;
        height: 400px;
        object-fit: cover;
        display: block;
    }

    .hero-text {
        text-align: left;
    }

    .hero-title {
        font-family: var(--font-title);
        font-size: 4rem;
        color: var(--or-cinema);
        text-transform: uppercase;
        line-height: 1;
        margin-bottom: 0.5rem;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    }

    .hero-subtitle {
        font-family: var(--font-title);
        font-size: 2.5rem;
        color: var(--blanc-casse);
        text-transform: uppercase;
        margin-bottom: 1.5rem;
    }

    .hero-description {
        font-family: var(--font-accent);
        font-style: italic;
        color: #ccc;
        font-size: 1.1rem;
        margin-bottom: 2rem;
        line-height: 1.8;
    }

    .btn-cinema {
        display: inline-block;
        background: var(--rouge-rideau);
        color: var(--or-cinema);
        padding: 1rem 2rem;
        font-family: var(--font-title);
        font-size: 1.1rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        border: 2px solid var(--or-cinema);
        text-decoration: none;
        transition: var(--transition);
    }

    .btn-cinema:hover {
        background: var(--or-cinema);
        color: var(--noir-pur);
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
    }

    /* ========== NOW PLAYING SECTION ========== */
    .now-playing {
        padding: 4rem 5%;
        background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%);
    }

    .section-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 3rem;
    }

    .section-header h2 {
        font-family: var(--font-title);
        font-size: 2rem;
        color: var(--or-cinema);
        text-transform: uppercase;
        letter-spacing: 3px;
        white-space: nowrap;
    }

    .header-decoration {
        flex: 1;
        height: 2px;
        background: linear-gradient(to right, transparent, var(--or-cinema));
        max-width: 200px;
    }

    .header-decoration.right {
        background: linear-gradient(to left, transparent, var(--or-cinema));
    }

    .film-strip-container {
        display: flex;
        position: relative;
        background: var(--or-cinema);
        padding: 8px 0;
        border-radius: 4px;
    }

    .film-perforations {
        width: 30px;
        background: repeating-linear-gradient(
            to bottom,
            var(--or-cinema),
            var(--or-cinema) 10px,
            #0d0d0d 10px,
            #0d0d0d 25px
        );
    }

    .recipe-film-grid {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        padding: 1.5rem;
        background: #0d0d0d;
    }

    .recipe-film-card {
        background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
        border-radius: 8px;
        overflow: hidden;
        text-decoration: none;
        transition: var(--transition);
        border: 1px solid rgba(212, 175, 55, 0.2);
    }

    .recipe-film-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 40px rgba(212, 175, 55, 0.3);
        border-color: var(--or-cinema);
    }

    .card-image {
        height: 180px;
        overflow: hidden;
    }

    .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    .recipe-film-card:hover .card-image img {
        transform: scale(1.1);
    }

    .card-content {
        padding: 1.25rem;
    }

    .media-title {
        font-family: var(--font-accent);
        font-style: italic;
        color: var(--rouge-rideau);
        font-size: 0.85rem;
        display: block;
        margin-bottom: 0.5rem;
    }

    .card-content h3 {
        font-family: var(--font-title);
        font-size: 1.3rem;
        color: var(--or-cinema);
        margin-bottom: 0.5rem;
        line-height: 1.2;
    }

    .card-meta {
        color: #888;
        font-size: 0.8rem;
        margin-bottom: 1rem;
    }

    .view-recipe-btn {
        display: inline-block;
        background: var(--rouge-rideau);
        color: var(--or-cinema);
        padding: 0.5rem 1rem;
        font-family: var(--font-title);
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-radius: 2px;
    }

    .placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #1a1a1a;
        font-size: 4rem;
    }

    /* ========== COMING SOON SECTION ========== */
    .coming-soon {
        padding: 4rem 5%;
        background: var(--or-cinema);
    }

    .coming-soon .section-header h2 {
        color: var(--noir-pur);
    }

    .gold-border {
        border-bottom: 2px solid var(--noir-pur);
        padding-bottom: 1rem;
    }

    .coming-soon-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .coming-soon-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: rgba(0, 0, 0, 0.1);
        padding: 1rem;
        border-radius: 8px;
        text-decoration: none;
        transition: var(--transition);
        border: 1px solid transparent;
    }

    .coming-soon-card:hover {
        background: rgba(0, 0, 0, 0.2);
        border-color: var(--noir-pur);
    }

    .card-thumbnail {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid var(--noir-pur);
    }

    .card-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .card-info {
        flex: 1;
    }

    .card-info .label {
        font-size: 0.75rem;
        color: var(--rouge-rideau);
        text-transform: uppercase;
        font-weight: 600;
    }

    .card-info h4 {
        font-family: var(--font-title);
        font-size: 1.1rem;
        color: var(--noir-pur);
        margin: 0.25rem 0;
    }

    .preview-btn {
        font-size: 0.8rem;
        color: var(--noir-pur);
        text-decoration: underline;
    }

    .placeholder-small {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.3);
        font-size: 2rem;
    }

    /* Loading/Error States */
    .loading, .error, .empty {
        text-align: center;
        padding: 4rem;
        color: #888;
    }

    .error {
        color: var(--rouge-rideau);
    }

    /* ========== RESPONSIVE ========== */
    @media (max-width: 1024px) {
        .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
        }

        .hero-text {
            text-align: center;
        }

        .recipe-film-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .coming-soon-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .hero-title {
            font-size: 2.5rem;
        }

        .hero-subtitle {
            font-size: 1.5rem;
        }

        .recipe-film-grid {
            grid-template-columns: 1fr;
        }

        .section-header h2 {
            font-size: 1.3rem;
        }

        .film-perforations {
            display: none;
        }
    }
</style>
