<script>
    import { onMount, tick } from "svelte";
    import { link } from "svelte-spa-router";
    import { api } from "../lib/api.js";

    let featuredRecipes = [];
    let comingSoonRecipes = [];
    let loading = true;
    let error = null;

    // Infinite carousel state
    let carouselOffset = 0;
    let isTransitioning = false;
    const CARD_WIDTH = 170; // 160px card + 10px gap
    const VISIBLE_CARDS = 8;

    // Create extended array for infinite loop (original + clone of first cards at end)
    $: extendedRecipes =
        comingSoonRecipes.length > 0
            ? [
                  ...comingSoonRecipes,
                  ...comingSoonRecipes.slice(0, VISIBLE_CARDS),
              ]
            : [];

    onMount(async () => {
        try {
            const recipes = await api.getRecipes();
            featuredRecipes = recipes.slice(0, 4);
            // All remaining recipes go to Coming Soon carousel
            comingSoonRecipes = recipes.slice(4);
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });

    async function scrollCarousel(direction) {
        if (isTransitioning || comingSoonRecipes.length === 0) return;

        const totalOriginal = comingSoonRecipes.length;

        if (direction === "right") {
            carouselOffset++;
            isTransitioning = true;

            // When we reach the cloned section, snap back to start after animation
            if (carouselOffset >= totalOriginal) {
                setTimeout(async () => {
                    // Disable transition temporarily for instant snap
                    const track = document.querySelector(".carousel-track");
                    if (track) {
                        track.style.transition = "none";
                        carouselOffset = 0;
                        await tick(); // Wait for Svelte to apply transform change

                        // Force reflow
                        void track.offsetWidth;
                        track.style.transition = "transform 0.4s ease";
                    }
                    isTransitioning = false;
                }, 400);
            } else {
                setTimeout(() => (isTransitioning = false), 400);
            }
        } else {
            if (carouselOffset <= 0) {
                // Snap to end of clones instantly, then animate back
                const track = document.querySelector(".carousel-track");
                if (track) {
                    track.style.transition = "none";
                    carouselOffset = totalOriginal;
                    await tick(); // Wait for DOM update
                    void track.offsetWidth;
                    track.style.transition = "transform 0.4s ease";
                    // Need small delay to ensure transition is active before decrement
                    await new Promise((r) => requestAnimationFrame(r));
                }
            }
            carouselOffset--;
            isTransitioning = true;
            setTimeout(() => (isTransitioning = false), 400);
        }
    }
</script>

<div class="home">
    <!-- Hero Section - Full Width with Intertwined Text -->
    <section class="hero-cinema">
        <div class="film-strip-top"></div>

        <div class="hero-banner">
            <!-- Full width background image -->
            <div class="hero-bg-wrapper">
                {#if featuredRecipes[0]}
                    <img
                        src={featuredRecipes[0].image_url ||
                            "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=1200"}
                        alt={featuredRecipes[0].title}
                        class="hero-bg-image"
                    />
                {:else}
                    <img
                        src="https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=1200"
                        alt="Featured dish"
                        class="hero-bg-image"
                    />
                {/if}

                <!-- Gold frame decoration -->
                <div class="hero-frame-left"></div>
                <div class="hero-frame-right"></div>

                <!-- Film projector decoration in top right -->
                <div class="film-projector">🎥</div>
            </div>

            <!-- Text directly overlaid on image, positioned right -->
            <div class="hero-text-overlay">
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
                    An offer you can't refuse. Recreate the iconic dish from the
                    cinematic masterpiece.
                </p>
                <a
                    href={featuredRecipes[0]
                        ? `/recipes/${featuredRecipes[0].id}`
                        : "/recipes"}
                    use:link
                    class="btn btn-cinema"
                >
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
                        <a
                            href="/recipes/{recipe.id}"
                            use:link
                            class="recipe-film-card"
                        >
                            <div class="card-frame">
                                <div class="card-image">
                                    {#if recipe.image_url}
                                        <img
                                            src={recipe.image_url}
                                            alt={recipe.title}
                                        />
                                    {:else}
                                        <div class="placeholder">🍽️</div>
                                    {/if}
                                </div>
                            </div>
                            <div class="card-content">
                                <span class="media-title"
                                    >{recipe.media?.title ||
                                        "Classic Film"}:</span
                                >
                                <h3>{recipe.title}</h3>
                                <p class="card-meta">
                                    {#if recipe.author}
                                        {recipe.author.username} | Chef: {recipe
                                            .author.username}
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

    <!-- Coming Soon Section with Carousel -->
    <section class="coming-soon">
        <div class="film-strip-top gold"></div>
        <div class="coming-soon-content">
            <div class="section-header dark">
                <h2>Coming Soon: Film Festival Favorites</h2>
            </div>

            <div class="carousel-container">
                <button
                    class="carousel-arrow left"
                    on:click={() => scrollCarousel("left")}
                    aria-label="Previous"
                >
                    ‹
                </button>

                <div class="carousel-viewport">
                    <div
                        class="carousel-track"
                        style="transform: translateX(-{carouselOffset * 170}px)"
                    >
                        {#if extendedRecipes.length > 0}
                            {#each extendedRecipes as recipe, i (i)}
                                <a
                                    href="/recipes/{recipe.id}"
                                    use:link
                                    class="coming-soon-card"
                                >
                                    <div class="card-thumbnail">
                                        {#if recipe.image_url}
                                            <img
                                                src={recipe.image_url}
                                                alt={recipe.title}
                                            />
                                        {:else}
                                            <div class="placeholder-small">
                                                🎬
                                            </div>
                                        {/if}
                                    </div>
                                    <div class="card-info">
                                        <h4>
                                            {recipe.media?.title ||
                                                recipe.title}
                                        </h4>
                                        <p class="recipe-name">
                                            {recipe.title}
                                        </p>
                                        <span class="preview-btn">Preview</span>
                                    </div>
                                </a>
                            {/each}
                        {:else}
                            {#each [1, 2, 3, 4] as i}
                                <div class="coming-soon-card placeholder-card">
                                    <div class="card-thumbnail">
                                        <div class="placeholder-small">🎬</div>
                                    </div>
                                    <div class="card-info">
                                        <h4>Coming Soon</h4>
                                        <span class="preview-btn">Preview</span>
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>

                <button
                    class="carousel-arrow right"
                    on:click={() => scrollCarousel("right")}
                    aria-label="Next"
                >
                    ›
                </button>
            </div>
        </div>
        <div class="film-strip-bottom gold"></div>
    </section>
</div>

<style>
    .home {
        background: linear-gradient(
            180deg,
            #0a0808 0%,
            #1a1412 30%,
            #251a14 60%,
            #1a1412 100%
        );
        min-height: 100vh;
        position: relative;
    }

    /* Film grain texture overlay */
    .home::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        opacity: 0.03;
        pointer-events: none;
        z-index: 0;
    }

    /* ========== HERO SECTION - INTERTWINED LAYOUT ========== */
    .hero-cinema {
        position: relative;
        z-index: 1;
    }

    .film-strip-top,
    .film-strip-bottom {
        height: 22px;
        background: var(--or-cinema);
        position: relative;
    }

    .film-strip-top.gold,
    .film-strip-bottom.gold {
        background: var(--or-cinema);
    }

    .film-strip-top::before,
    .film-strip-bottom::before {
        content: "";
        position: absolute;
        top: 4px;
        left: 0;
        right: 0;
        height: 14px;
        background: repeating-linear-gradient(
            to right,
            transparent,
            transparent 18px,
            #0d0d0d 18px,
            #0d0d0d 32px
        );
    }

    .hero-banner {
        position: relative;
        width: 100%;
        height: 380px;
        overflow: hidden;
    }

    .hero-bg-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .hero-bg-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }

    /* Gold frame decorations on left and partial right */
    .hero-frame-left {
        position: absolute;
        top: 15px;
        left: 15px;
        bottom: 15px;
        width: 55%;
        border: 5px solid var(--or-cinema);
        border-right: none;
        pointer-events: none;
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
    }

    .hero-frame-right {
        position: absolute;
        top: 15px;
        right: 35%;
        bottom: 15px;
        width: 10%;
        border-top: 5px solid var(--or-cinema);
        border-bottom: 5px solid var(--or-cinema);
        pointer-events: none;
    }

    .film-projector {
        position: absolute;
        top: 25px;
        right: 25px;
        font-size: 3.5rem;
        opacity: 0.7;
        z-index: 5;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
    }

    /* Text overlay that fades into the image from right side */
    .hero-text-overlay {
        position: absolute;
        top: 0;
        right: 0;
        width: 45%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 2rem 3rem 2rem 4rem;
        /* Gradient that fades from transparent (left) to dark (right) */
        background: linear-gradient(
            90deg,
            rgba(10, 8, 8, 0) 0%,
            rgba(10, 8, 8, 0.4) 15%,
            rgba(10, 8, 8, 0.75) 35%,
            rgba(10, 8, 8, 0.9) 55%,
            rgba(10, 8, 8, 0.98) 75%,
            rgba(10, 8, 8, 1) 100%
        );
        z-index: 3;
    }

    .hero-title {
        font-family: var(--font-title);
        font-size: 3.5rem;
        color: var(--or-cinema);
        text-transform: uppercase;
        line-height: 0.95;
        margin-bottom: 0.15rem;
        text-shadow: 3px 3px 8px rgba(0, 0, 0, 1);
    }

    .hero-subtitle {
        font-family: var(--font-title);
        font-size: 1.8rem;
        color: var(--or-cinema);
        text-transform: uppercase;
        margin-bottom: 1rem;
        text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.9);
    }

    .hero-description {
        font-family: var(--font-accent);
        font-style: italic;
        color: #c5b8a8;
        font-size: 0.9rem;
        margin-bottom: 1.5rem;
        line-height: 1.5;
        max-width: 320px;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
    }

    .btn-cinema {
        display: inline-block;
        background: var(--rouge-rideau);
        color: var(--or-cinema);
        padding: 0.7rem 1.3rem;
        font-family: var(--font-title);
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        border: 2px solid var(--or-cinema);
        text-decoration: none;
        transition: all 0.3s ease;
        width: fit-content;
    }

    .btn-cinema:hover {
        background: var(--or-cinema);
        color: var(--noir-pur);
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
    }

    /* ========== NOW PLAYING SECTION ========== */
    .now-playing {
        position: relative;
        z-index: 1;
        padding: 3rem 5%;
        background: linear-gradient(180deg, #1a1210 0%, #0d0908 100%);
    }

    .section-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .section-header h2 {
        font-family: var(--font-title);
        font-size: 1.5rem;
        color: var(--or-cinema);
        text-transform: uppercase;
        letter-spacing: 3px;
        white-space: nowrap;
    }

    .section-header.dark h2 {
        color: var(--noir-pur);
    }

    .header-decoration {
        flex: 1;
        height: 2px;
        background: linear-gradient(to right, transparent, var(--or-cinema));
        max-width: 100px;
    }

    .header-decoration.right {
        background: linear-gradient(to left, transparent, var(--or-cinema));
    }

    .film-strip-container {
        display: flex;
        position: relative;
        background: var(--or-cinema);
        padding: 4px 0;
        border-radius: 2px;
    }

    .film-perforations {
        width: 20px;
        background: repeating-linear-gradient(
            to bottom,
            var(--or-cinema),
            var(--or-cinema) 5px,
            #0d0d0d 5px,
            #0d0d0d 14px
        );
    }

    .recipe-film-grid {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.8rem;
        padding: 0.8rem;
        background: linear-gradient(180deg, #1a1412 0%, #0d0908 100%);
    }

    .recipe-film-card {
        background: linear-gradient(145deg, #2a1e18, #120c0a);
        border-radius: 4px;
        overflow: visible;
        text-decoration: none;
        transition: all 0.3s ease;
        position: relative;
    }

    .recipe-film-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
    }

    .card-frame {
        position: relative;
        border: 3px solid var(--or-cinema);
        border-radius: 3px;
        overflow: hidden;
        margin: 5px 5px 0 5px;
    }

    .card-image {
        height: 110px;
        overflow: hidden;
    }

    .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    .recipe-film-card:hover .card-image img {
        transform: scale(1.08);
    }

    .card-content {
        padding: 0.6rem;
    }

    .media-title {
        font-family: var(--font-accent);
        font-style: italic;
        color: #c9a;
        font-size: 0.65rem;
        display: block;
        margin-bottom: 0.15rem;
    }

    .card-content h3 {
        font-family: var(--font-title);
        font-size: 0.9rem;
        color: var(--or-cinema);
        margin-bottom: 0.15rem;
        line-height: 1.2;
    }

    .card-meta {
        color: #666;
        font-size: 0.55rem;
        margin-bottom: 0.5rem;
    }

    .view-recipe-btn {
        display: inline-block;
        background: var(--or-cinema);
        color: var(--noir-pur);
        padding: 0.3rem 0.6rem;
        font-family: var(--font-title);
        font-size: 0.6rem;
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
        background: #1a1412;
        font-size: 2rem;
    }

    /* ========== COMING SOON SECTION ========== */
    .coming-soon {
        position: relative;
        z-index: 1;
        background: var(--or-cinema);
    }

    .coming-soon-content {
        padding: 1.2rem 5%;
    }

    .carousel-container {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        max-width: 1000px;
        margin: 0 auto;
    }

    .carousel-arrow {
        background: rgba(0, 0, 0, 0.2);
        border: 2px solid var(--noir-pur);
        color: var(--noir-pur);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        font-size: 1.4rem;
        cursor: pointer;
        transition: all 0.3s;
        flex-shrink: 0;
        z-index: 2;
    }

    .carousel-arrow:hover {
        background: var(--noir-pur);
        color: var(--or-cinema);
    }

    .carousel-viewport {
        flex: 1;
        overflow: hidden;
    }

    .carousel-track {
        display: flex;
        gap: 10px;
        transition: transform 0.4s ease;
    }

    .coming-soon-card {
        flex-shrink: 0;
        width: 160px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        overflow: hidden;
        text-decoration: none;
        transition: all 0.3s;
        border: 2px solid transparent;
    }

    .coming-soon-card:hover {
        background: rgba(0, 0, 0, 0.18);
        border-color: var(--noir-pur);
    }

    .card-thumbnail {
        height: 80px;
        overflow: hidden;
    }

    .card-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .card-info {
        padding: 0.5rem;
    }

    .card-info h4 {
        font-family: var(--font-title);
        font-size: 0.75rem;
        color: var(--noir-pur);
        margin-bottom: 0.1rem;
    }

    .recipe-name {
        font-size: 0.6rem;
        color: var(--rouge-rideau);
        margin-bottom: 0.15rem;
    }

    .preview-btn {
        font-size: 0.55rem;
        color: var(--noir-pur);
        text-decoration: underline;
        text-transform: uppercase;
    }

    .placeholder-small {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.12);
        font-size: 1.5rem;
    }

    .placeholder-card {
        opacity: 0.6;
    }

    /* Loading/Error States */
    .loading,
    .error,
    .empty {
        text-align: center;
        padding: 2rem;
        color: #888;
    }

    .error {
        color: var(--rouge-rideau);
    }

    /* ========== RESPONSIVE ========== */
    @media (max-width: 1024px) {
        .hero-text-overlay {
            width: 55%;
        }

        .hero-title {
            font-size: 2.8rem;
        }

        .film-projector {
            display: none;
        }

        .recipe-film-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 768px) {
        .hero-banner {
            height: auto;
            min-height: 400px;
        }

        .hero-text-overlay {
            position: relative;
            width: 100%;
            padding: 2rem;
            background: linear-gradient(
                180deg,
                rgba(10, 8, 8, 0.8) 0%,
                rgba(10, 8, 8, 1) 100%
            );
        }

        .hero-bg-wrapper {
            position: relative;
            height: 200px;
        }

        .hero-frame-left,
        .hero-frame-right {
            display: none;
        }

        .hero-title {
            font-size: 2rem;
        }

        .hero-subtitle {
            font-size: 1.2rem;
        }

        .recipe-film-grid {
            grid-template-columns: 1fr;
        }

        .section-header h2 {
            font-size: 1rem;
        }

        .film-perforations {
            display: none;
        }

        .carousel-track {
            overflow-x: auto;
        }
    }
</style>
