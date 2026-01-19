<script>
    import { link } from 'svelte-spa-router';
    import { auth } from '../lib/stores/auth.js';

    async function handleLogout() {
        await auth.logout();
    }
</script>

<nav class="navbar">
    <div class="navbar-brand">
        <a href="/" use:link class="logo">🎬 CinéDélices</a>
    </div>
    
    <div class="navbar-menu">
        <a href="/" use:link>Accueil</a>
        <a href="/recipes" use:link>Recettes</a>
        
        {#if $auth.user}
            <a href="/recipes/new" use:link>Nouvelle recette</a>
            <a href="/favorites" use:link>Favoris</a>
            {#if $auth.user.role === 'admin'}
                <a href="/admin" use:link class="admin-link">Admin</a>
            {/if}
            <div class="user-menu">
                <a href="/profile/{$auth.user.id}" use:link>{$auth.user.username}</a>
                <button on:click={handleLogout}>Déconnexion</button>
            </div>
        {:else}
            <a href="/login" use:link>Connexion</a>
            <a href="/register" use:link>Inscription</a>
        {/if}
    </div>
</nav>

<style>
    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }

    .logo {
        font-size: 1.5rem;
        font-weight: bold;
        color: #e94560;
        text-decoration: none;
    }

    .navbar-menu {
        display: flex;
        gap: 1.5rem;
        align-items: center;
    }

    .navbar-menu a {
        color: #eee;
        text-decoration: none;
        transition: color 0.2s;
    }

    .navbar-menu a:hover {
        color: #e94560;
    }

    .admin-link {
        background: #e94560;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        color: white !important;
    }

    .user-menu {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    button {
        background: transparent;
        border: 1px solid #e94560;
        color: #e94560;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }

    button:hover {
        background: #e94560;
        color: white;
    }
</style>
