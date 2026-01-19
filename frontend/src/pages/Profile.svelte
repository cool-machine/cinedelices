<script>
    import { onMount } from 'svelte';
    import { link } from 'svelte-spa-router';
    import { api } from '../lib/api.js';
    import { auth } from '../lib/stores/auth.js';

    export let params = {};

    let user = null;
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            user = await api.getUser(params.id);
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });

    $: isOwnProfile = $auth.user && user && $auth.user.id === user.id;
</script>

<div class="profile-page">
    {#if loading}
        <p class="loading">Chargement...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else if user}
        <div class="profile-header">
            <div class="avatar">
                {#if user.avatar_url}
                    <img src={user.avatar_url} alt={user.username} />
                {:else}
                    <div class="avatar-placeholder">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                {/if}
            </div>
            
            <div class="profile-info">
                <h1>{user.username}</h1>
                {#if user.role === 'admin'}
                    <span class="admin-badge">Admin</span>
                {/if}
                {#if user.bio}
                    <p class="bio">{user.bio}</p>
                {/if}
                <p class="member-since">
                    Membre depuis {new Date(user.created_at).toLocaleDateString()}
                </p>
                
                {#if isOwnProfile}
                    <a href="/profile/edit" use:link class="edit-btn">✏️ Modifier le profil</a>
                {/if}
            </div>
        </div>

        <section class="user-recipes">
            <h2>Recettes de {user.username}</h2>
            
            {#if user.recipes && user.recipes.length > 0}
                <div class="recipe-grid">
                    {#each user.recipes as recipe}
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
                            </div>
                        </a>
                    {/each}
                </div>
            {:else}
                <p class="no-recipes">Aucune recette publiée</p>
            {/if}
        </section>
    {/if}
</div>

<style>
    .profile-page {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
    }

    .profile-header {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
        background: #1a1a2e;
        padding: 2rem;
        border-radius: 12px;
        margin-bottom: 2rem;
    }

    .avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        overflow: hidden;
        flex-shrink: 0;
    }

    .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .avatar-placeholder {
        width: 100%;
        height: 100%;
        background: #e94560;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        color: white;
        font-weight: bold;
    }

    .profile-info h1 {
        color: #eee;
        margin-bottom: 0.5rem;
    }

    .admin-badge {
        display: inline-block;
        background: #e94560;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        margin-bottom: 1rem;
    }

    .bio {
        color: #ccc;
        margin-bottom: 1rem;
        line-height: 1.6;
    }

    .member-since {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    .edit-btn {
        display: inline-block;
        background: #0f3460;
        color: #eee;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        text-decoration: none;
    }

    .edit-btn:hover {
        background: #1a4a7a;
    }

    .user-recipes h2 {
        color: #eee;
        margin-bottom: 1.5rem;
    }

    .recipe-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .recipe-card {
        background: #1a1a2e;
        border-radius: 12px;
        overflow: hidden;
        text-decoration: none;
        transition: transform 0.2s;
    }

    .recipe-card:hover {
        transform: translateY(-4px);
    }

    .recipe-image {
        height: 150px;
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
        font-size: 1rem;
    }

    .no-recipes {
        color: #666;
        text-align: center;
        padding: 3rem;
        background: #1a1a2e;
        border-radius: 12px;
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
