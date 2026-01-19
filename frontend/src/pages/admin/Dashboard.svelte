<script>
    import { onMount } from 'svelte';
    import { link, push } from 'svelte-spa-router';
    import { api } from '../../lib/api.js';
    import { auth } from '../../lib/stores/auth.js';

    let stats = null;
    let loading = true;
    let error = null;

    onMount(async () => {
        if (!$auth.user || $auth.user.role !== 'admin') {
            push('/');
            return;
        }

        try {
            stats = await api.admin.getStats();
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });
</script>

<div class="admin-dashboard">
    <h1>🛠️ Administration</h1>

    {#if loading}
        <p class="loading">Chargement...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else}
        <div class="stats-grid">
            <div class="stat-card">
                <span class="stat-icon">🍽️</span>
                <span class="stat-value">{stats.recipes}</span>
                <span class="stat-label">Recettes</span>
            </div>
            <div class="stat-card">
                <span class="stat-icon">👥</span>
                <span class="stat-value">{stats.users}</span>
                <span class="stat-label">Utilisateurs</span>
            </div>
            <div class="stat-card">
                <span class="stat-icon">📂</span>
                <span class="stat-value">{stats.categories}</span>
                <span class="stat-label">Catégories</span>
            </div>
            <div class="stat-card">
                <span class="stat-icon">🎬</span>
                <span class="stat-value">{stats.media}</span>
                <span class="stat-label">Médias</span>
            </div>
        </div>

        <div class="admin-menu">
            <h2>Gestion</h2>
            <div class="menu-grid">
                <a href="/admin/recipes" use:link class="menu-card">
                    <span class="menu-icon">🍽️</span>
                    <span class="menu-title">Recettes</span>
                    <span class="menu-desc">Gérer les recettes</span>
                </a>
                <a href="/admin/categories" use:link class="menu-card">
                    <span class="menu-icon">📂</span>
                    <span class="menu-title">Catégories</span>
                    <span class="menu-desc">Gérer les catégories</span>
                </a>
                <a href="/admin/media" use:link class="menu-card">
                    <span class="menu-icon">🎬</span>
                    <span class="menu-title">Médias</span>
                    <span class="menu-desc">Films et séries</span>
                </a>
                <a href="/admin/users" use:link class="menu-card">
                    <span class="menu-icon">👥</span>
                    <span class="menu-title">Utilisateurs</span>
                    <span class="menu-desc">Gérer les comptes</span>
                </a>
            </div>
        </div>
    {/if}
</div>

<style>
    .admin-dashboard {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        color: #eee;
        margin-bottom: 2rem;
    }

    h2 {
        color: #ccc;
        margin-bottom: 1.5rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
    }

    .stat-card {
        background: #1a1a2e;
        padding: 1.5rem;
        border-radius: 12px;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .stat-icon {
        font-size: 2rem;
    }

    .stat-value {
        font-size: 2.5rem;
        font-weight: bold;
        color: #e94560;
    }

    .stat-label {
        color: #888;
    }

    .menu-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.5rem;
    }

    .menu-card {
        background: #1a1a2e;
        padding: 1.5rem;
        border-radius: 12px;
        text-decoration: none;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .menu-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    }

    .menu-icon {
        font-size: 2rem;
    }

    .menu-title {
        font-size: 1.2rem;
        font-weight: bold;
        color: #eee;
    }

    .menu-desc {
        color: #888;
        font-size: 0.9rem;
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
