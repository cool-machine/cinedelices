<script>
    import { onMount } from "svelte";
    import { link, push, querystring } from "svelte-spa-router";
    import { auth } from "../lib/stores/auth.js";

    let movie = {
        tmdb_id: "",
        title: "",
        poster_url: "",
        year: "",
        type: "film",
        imdb_id: "",
    };

    let loading = true;
    let error = null;

    onMount(async () => {
        if (!$auth.user) {
            push("/login");
            return;
        }

        // Parse URL params
        const params = new URLSearchParams($querystring);
        movie.tmdb_id = params.get("tmdb_id") || "";
        movie.title = params.get("title") || "";
        movie.poster_url = params.get("poster_url") || "";
        movie.year = params.get("year") || "";
        movie.type = params.get("type") || "film";

        if (!movie.tmdb_id || !movie.title) {
            push("/movie-search");
            return;
        }

        // Fetch additional details including IMDB ID
        try {
            const typeParam = movie.type === "serie" ? "tv" : "movie";
            const response = await fetch(
                `http://localhost:3000/api/v1/tmdb/${movie.tmdb_id}?type=${typeParam}`,
            );
            if (response.ok) {
                const data = await response.json();
                movie.imdb_id = data.imdb_id || "";
            }
        } catch (e) {
            console.warn("Could not fetch IMDB ID:", e);
        } finally {
            loading = false;
        }
    });

    function handleWriteManually() {
        // Navigate to RecipeNew with movie pre-selected
        const params = new URLSearchParams({
            prefill_movie: "true",
            movie_title: movie.title,
            movie_poster: movie.poster_url,
            movie_year: movie.year,
            movie_type: movie.type,
        });
        push(`/recipes/new?${params.toString()}`);
    }

    function handleAIGenerate() {
        // Placeholder - shows coming soon message
        alert(
            "🚧 Fonctionnalité en développement\n\nLa génération de recettes par IA sera bientôt disponible !",
        );
    }
</script>

<div class="create-recipe-page">
    {#if loading}
        <p class="loading">Chargement...</p>
    {:else}
        <a href="/movie-search" use:link class="back-link">← Changer de film</a>

        <div class="movie-header">
            <div class="poster">
                {#if movie.poster_url}
                    <img src={movie.poster_url} alt={movie.title} />
                {:else}
                    <div class="no-poster">🎬</div>
                {/if}
            </div>
            <div class="movie-details">
                <h1>{movie.title}</h1>
                {#if movie.year}
                    <span class="year">{movie.year}</span>
                {/if}
                <span class="type-badge"
                    >{movie.type === "serie" ? "📺 Série" : "🎬 Film"}</span
                >

                {#if movie.imdb_id}
                    <a
                        href="https://www.imdb.com/title/{movie.imdb_id}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="imdb-link"
                    >
                        Voir sur IMDB →
                    </a>
                {/if}
            </div>
        </div>

        <div class="action-section">
            <h2>Comment voulez-vous créer votre recette ?</h2>

            <div class="action-buttons">
                <button class="action-btn ai-btn" on:click={handleAIGenerate}>
                    <span class="icon">✨</span>
                    <span class="label">Générer avec l'IA</span>
                    <span class="badge">Bientôt</span>
                </button>

                <button
                    class="action-btn manual-btn"
                    on:click={handleWriteManually}
                >
                    <span class="icon">✍️</span>
                    <span class="label">Écrire moi-même</span>
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    .create-recipe-page {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }

    .loading {
        text-align: center;
        padding: 3rem;
        color: #888;
    }

    .back-link {
        display: inline-block;
        color: #d4af37;
        text-decoration: none;
        margin-bottom: 2rem;
        font-size: 0.95rem;
    }

    .back-link:hover {
        text-decoration: underline;
    }

    .movie-header {
        display: flex;
        gap: 2rem;
        background: #1a1a2e;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
    }

    .poster {
        flex-shrink: 0;
        width: 150px;
        height: 225px;
        border-radius: 8px;
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
        font-size: 3rem;
        background: #16213e;
    }

    .movie-details {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .movie-details h1 {
        font-size: 1.8rem;
        color: #eee;
        margin: 0;
    }

    .year {
        color: #d4af37;
        font-size: 1.2rem;
        font-weight: bold;
    }

    .type-badge {
        display: inline-block;
        background: #16213e;
        color: #888;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.85rem;
        width: fit-content;
    }

    .imdb-link {
        display: inline-block;
        color: #f5c518;
        text-decoration: none;
        font-weight: bold;
        margin-top: 0.5rem;
    }

    .imdb-link:hover {
        text-decoration: underline;
    }

    .action-section {
        text-align: center;
    }

    .action-section h2 {
        color: #ccc;
        font-size: 1.3rem;
        margin-bottom: 1.5rem;
    }

    .action-buttons {
        display: flex;
        gap: 1.5rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 2rem 3rem;
        border-radius: 12px;
        border: 2px solid transparent;
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
        min-width: 180px;
    }

    .action-btn .icon {
        font-size: 2.5rem;
    }

    .action-btn .label {
        font-size: 1.1rem;
        font-weight: bold;
    }

    .ai-btn {
        background: #1a1a2e;
        border-color: #444;
        color: #888;
    }

    .ai-btn:hover {
        border-color: #666;
        background: #222;
    }

    .ai-btn .badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #e94560;
        color: white;
        font-size: 0.7rem;
        padding: 0.2rem 0.5rem;
        border-radius: 10px;
    }

    .manual-btn {
        background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%);
        color: #1a1a2e;
    }

    .manual-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
    }

    @media (max-width: 600px) {
        .movie-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .action-buttons {
            flex-direction: column;
        }
    }
</style>
