<script>
    import { link } from 'svelte-spa-router';
</script>

<div class="not-found">
    <h1>404</h1>
    <p>Page non trouvée</p>
    <a href="/" use:link class="home-btn">Retour à l'accueil</a>
</div>

<style>
    .not-found {
        min-height: 60vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 2rem;
    }

    h1 {
        font-size: 6rem;
        color: #e94560;
        margin-bottom: 1rem;
    }

    p {
        font-size: 1.5rem;
        color: #888;
        margin-bottom: 2rem;
    }

    .home-btn {
        background: #e94560;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
    }

    .home-btn:hover {
        background: #d13354;
    }
</style>
