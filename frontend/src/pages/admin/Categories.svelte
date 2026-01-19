<script>
    import { onMount } from 'svelte';
    import { link, push } from 'svelte-spa-router';
    import { api } from '../../lib/api.js';
    import { auth } from '../../lib/stores/auth.js';

    let categories = [];
    let loading = true;
    let error = null;
    let showForm = false;
    let editingId = null;
    let formName = '';

    onMount(async () => {
        if (!$auth.user || $auth.user.role !== 'admin') {
            push('/');
            return;
        }
        await loadCategories();
    });

    async function loadCategories() {
        try {
            categories = await api.admin.getCategories();
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    }

    function startEdit(cat) {
        editingId = cat.id;
        formName = cat.name;
        showForm = true;
    }

    function startCreate() {
        editingId = null;
        formName = '';
        showForm = true;
    }

    function cancelForm() {
        showForm = false;
        editingId = null;
        formName = '';
    }

    async function handleSubmit() {
        if (!formName.trim()) return;
        
        try {
            if (editingId) {
                await api.admin.updateCategory(editingId, { name: formName });
            } else {
                await api.admin.createCategory({ name: formName });
            }
            await loadCategories();
            cancelForm();
        } catch (e) {
            alert(e.message);
        }
    }

    async function deleteCategory(id) {
        if (!confirm('Supprimer cette catégorie ?')) return;
        try {
            await api.admin.deleteCategory(id);
            categories = categories.filter(c => c.id !== id);
        } catch (e) {
            alert(e.message);
        }
    }
</script>

<div class="admin-page">
    <div class="page-header">
        <h1>📂 Gestion des catégories</h1>
        <div class="header-actions">
            <button class="add-btn" on:click={startCreate}>+ Nouvelle catégorie</button>
            <a href="/admin" use:link class="back-btn">← Retour</a>
        </div>
    </div>

    {#if showForm}
        <div class="form-card">
            <h3>{editingId ? 'Modifier' : 'Nouvelle'} catégorie</h3>
            <form on:submit|preventDefault={handleSubmit}>
                <input 
                    type="text" 
                    bind:value={formName} 
                    placeholder="Nom de la catégorie"
                    required
                />
                <div class="form-actions">
                    <button type="button" class="cancel" on:click={cancelForm}>Annuler</button>
                    <button type="submit">{editingId ? 'Modifier' : 'Créer'}</button>
                </div>
            </form>
        </div>
    {/if}

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
                        <th>Nom</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each categories as cat}
                        <tr>
                            <td>{cat.id}</td>
                            <td>{cat.name}</td>
                            <td class="actions">
                                <button class="edit-btn" on:click={() => startEdit(cat)}>✏️</button>
                                <button class="delete-btn" on:click={() => deleteCategory(cat.id)}>🗑️</button>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="3" class="empty">Aucune catégorie</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<style>
    .admin-page {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
    }

    h1 {
        color: #eee;
    }

    .header-actions {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .add-btn {
        background: #e94560;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
    }

    .back-btn {
        color: #888;
        text-decoration: none;
    }

    .form-card {
        background: #1a1a2e;
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 2rem;
    }

    .form-card h3 {
        color: #eee;
        margin-bottom: 1rem;
    }

    .form-card input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #333;
        border-radius: 8px;
        background: #16213e;
        color: #eee;
        font-size: 1rem;
        margin-bottom: 1rem;
    }

    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }

    .form-actions button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
    }

    .form-actions button[type="submit"] {
        background: #e94560;
        color: white;
    }

    .form-actions button.cancel {
        background: #333;
        color: #ccc;
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
    }

    td {
        color: #eee;
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
