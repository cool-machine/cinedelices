<script>
    import { onMount } from 'svelte';
    import { link, push } from 'svelte-spa-router';
    import { api } from '../../lib/api.js';
    import { auth } from '../../lib/stores/auth.js';

    let recipes = [];
    let loading = true;
    let error = null;

    onMount(async () => {
        if (!$auth.user || $auth.user.role !== 'admin') {
            push('/');
            return;
        }
        await loadRecipes();
    });

    async function loadRecipes() {
        try {
            recipes = await api.admin.getRecipes();
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    }

    async function deleteRecipe(id) {
        if (!confirm('Supprimer cette recette ?')) return;
        try {
            await api.admin.deleteRecipe(id);
            recipes = recipes.filter(r => r.id !== id);
        } catch (e) {
            alert(e.message);
        }
    }
</script>

<div class="admin-page">
    <div class="page-header">
        <h1>🍽️ Gestion des recettes</h1>
        <a href="/admin" use:link class="back-btn">← Retour</a>
    </div>

    {#if loading}
        <p class="loading">Chargement...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else}
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Titre</th>
                        <th>Auteur</th>
                        <th>Catégorie</th>
                        <th>Média</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each recipes as recipe}
                        <tr>
                            <td>{recipe.id}</td>
                            <td>
                                <a href="/recipes/{recipe.id}" use:link>{recipe.title}</a>
                            </td>
                            <td>{recipe.author?.username || '-'}</td>
                            <td>{recipe.category?.name || '-'}</td>
                            <td>{recipe.media?.title || '-'}</td>
                            <td class="actions">
                                <a href="/recipes/{recipe.id}/edit" use:link class="edit-btn">✏️</a>
                                <button class="delete-btn" on:click={() => deleteRecipe(recipe.id)}>🗑️</button>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="6" class="empty">Aucune recette</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<style>
    .admin-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    h1 {
        color: #eee;
    }

    .back-btn {
        color: #888;
        text-decoration: none;
    }

    .back-btn:hover {
        color: #e94560;
    }

    .table-container {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        background: #1a1a2e;
        border-radius: 12px;
        overflow: hidden;
    }

    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #333;
    }

    th {
        background: #16213e;
        color: #ccc;
        font-weight: 600;
    }

    td {
        color: #eee;
    }

    td a {
        color: #e94560;
    }

    .actions {
        display: flex;
        gap: 0.5rem;
    }

    .edit-btn, .delete-btn {
        padding: 0.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background: transparent;
        font-size: 1rem;
    }

    .edit-btn {
        color: #4dabf7;
    }

    .delete-btn {
        color: #e94560;
    }

    .empty {
        text-align: center;
        color: #666;
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
