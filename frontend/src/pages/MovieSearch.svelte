<script>
    import { link, push } from "svelte-spa-router";
    import { auth } from "../lib/stores/auth.js";

    let query = "";
    let results = [];
    let loading = false;
    let error = null;
    let searchTimeout = null;
    let mediaType = "movie";

    // Debounced search
    function handleInput() {
        clearTimeout(searchTimeout);
        if (query.trim().length < 2) {
            results = [];
            return;
        }
        searchTimeout = setTimeout(() => {
            searchMovies();
        }, 400);
    }

    async function searchMovies() {
        if (query.trim().length < 2) return;

        loading = true;
        error = null;

        try {
            const response = await fetch(
                `http://localhost:3000/api/v1/tmdb/search?query=${encodeURIComponent(query)}&type=${mediaType}`,
            );

            if (!response.ok) {
                throw new Error("Erreur lors de la recherche");
            }

            const data = await response.json();
            results = data.results || [];
        } catch (e) {
            error = e.message;
            results = [];
        } finally {
            loading = false;
        }
    }

    function selectMovie(movie) {
        // Navigate to recipe creation with movie data
        const params = new URLSearchParams({
            tmdb_id: movie.tmdb_id,
            title: movie.title,
            poster_url: movie.poster_url || "",
            year: movie.year || "",
            type: movie.type,
        });
        push(`/create-recipe?${params.toString()}`);
    }
</script>

<div class="movie-search-page">
    <h1>🎬 Créer une recette</h1>
    <p class="subtitle">
        Recherchez un film ou une série pour créer une recette inspirée
    </p>

    {#if !$auth.user}
        <div class="login-prompt">
            <p>Vous devez être connecté pour créer une recette.</p>
            <a href="/login" use:link class="login-btn">Se connecter</a>
        </div>
    {:else}
        <div class="search-controls">
            <div class="type-toggle">
                <button
                    class:active={mediaType === "movie"}
                    on:click={() => {
                        mediaType = "movie";
                        if (query.length >= 2) searchMovies();
                    }}
                >
                    🎬 Films
                </button>
                <button
                    class:active={mediaType === "tv"}
                    on:click={() => {
                        mediaType = "tv";
                        if (query.length >= 2) searchMovies();
                    }}
                >
                    📺 Séries
                </button>
            </div>

            <div class="search-box">
                <input
                    type="text"
                    placeholder="Rechercher un film ou une série..."
                    bind:value={query}
                    on:input={handleInput}
                />
                {#if loading}
                    <span class="loading-indicator">⏳</span>
                {/if}
            </div>
        </div>

        {#if error}
            <p class="error">{error}</p>
        {/if}

        {#if results.length > 0}
            <div class="results-grid">
                {#each results as movie}
                    <button
                        class="movie-card"
                        on:click={() => selectMovie(movie)}
                    >
                        <div class="poster">
                            {#if movie.poster_url}
                                <img src={movie.poster_url} alt={movie.title} />
                            {:else}
                                <div class="no-poster">🎬</div>
                            {/if}
                        </div>
                        <div class="movie-info">
                            <h3>{movie.title}</h3>
                            {#if movie.year}
                                <span class="year">{movie.year}</span>
                            {/if}
                        </div>
                    </button>
                {/each}
            </div>
        {:else if query.length >= 2 && !loading}
            <p class="no-results">Aucun résultat pour "{query}"</p>
        {:else}
            <div class="search-hint">
                <p>🔍 Commencez à taper le nom d'un film ou d'une série</p>
            </div>
        {/if}
    {/if}
</div>

<style>
    .movie-search-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        font-size: 2.5rem;
        background: linear-gradient(
            135deg,
            #d4af37 0%,
            #f4d03f 50%,
            #d4af37 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 0.5rem;
    }

    .subtitle {
        color: #888;
        font-size: 1.1rem;
        margin-bottom: 2rem;
    }

    .login-prompt {
        text-align: center;
        padding: 3rem;
        background: #1a1a2e;
        border-radius: 12px;
    }

    .login-prompt p {
        color: #ccc;
        margin-bottom: 1rem;
    }

    .login-btn {
        display: inline-block;
        background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%);
        color: #1a1a2e;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
    }

    .search-controls {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .type-toggle {
        display: flex;
        gap: 0.5rem;
    }

    .type-toggle button {
        padding: 0.5rem 1rem;
        background: #1a1a2e;
        border: 1px solid #333;
        color: #888;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .type-toggle button.active {
        background: #d4af37;
        color: #1a1a2e;
        border-color: #d4af37;
    }

    .search-box {
        position: relative;
    }

    .search-box input {
        width: 100%;
        padding: 1rem 1.5rem;
        font-size: 1.1rem;
        background: #1a1a2e;
        border: 2px solid #333;
        border-radius: 12px;
        color: #eee;
        transition: border-color 0.2s;
    }

    .search-box input:focus {
        outline: none;
        border-color: #d4af37;
    }

    .loading-indicator {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.5rem;
    }

    .results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 1.5rem;
    }

    .movie-card {
        background: #1a1a2e;
        border: none;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        text-align: left;
        transition:
            transform 0.2s,
            box-shadow 0.2s;
    }

    .movie-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(212, 175, 55, 0.2);
    }

    .poster {
        height: 240px;
        overflow: hidden;
    }

    .poster img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .no-poster {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        background: #16213e;
    }

    .movie-info {
        padding: 0.75rem;
    }

    .movie-info h3 {
        color: #eee;
        font-size: 0.95rem;
        margin-bottom: 0.25rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .year {
        color: #d4af37;
        font-size: 0.85rem;
    }

    .error {
        color: #e94560;
        text-align: center;
        padding: 1rem;
    }

    .no-results,
    .search-hint {
        text-align: center;
        padding: 3rem;
        color: #888;
    }

    .search-hint p {
        font-size: 1.2rem;
    }
</style>
