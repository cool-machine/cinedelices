<script>
    import { onMount } from 'svelte';
    import { link, push } from 'svelte-spa-router';
    import { api } from '../../lib/api.js';
    import { auth } from '../../lib/stores/auth.js';

    let media = [];
    let loading = true;
    let error = null;
    let showForm = false;
    let editingId = null;
    let formData = { title: '', type: 'film', release_year: '', poster_url: '' };

    onMount(async () => {
        if (!$auth.user || $auth.user.role !== 'admin') {
            push('/');
            return;
        }
        await loadMedia();
    });

    async function loadMedia() {
        try {
            media = await api.admin.getMedia();
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    }

    function startEdit(m) {
        editingId = m.id;
        formData = { 
            title: m.title, 
            type: m.type, 
            release_year: m.release_year || '',
            poster_url: m.poster_url || ''
        };
        showForm = true;
    }

    function startCreate() {
        editingId = null;
        formData = { title: '', type: 'film', release_year: '', poster_url: '' };
        showForm = true;
    }

    function cancelForm() {
        showForm = false;
        editingId = null;
    }

    async function handleSubmit() {
        if (!formData.title.trim()) return;
        
        try {
            const data = {
                ...formData,
                release_year: formData.release_year ? parseInt(formData.release_year) : null
            };
            
            if (editingId) {
                await api.admin.updateMedia(editingId, data);
            } else {
                await api.admin.createMedia(data);
            }
            await loadMedia();
            cancelForm();
        } catch (e) {
            alert(e.message);
        }
    }

    async function deleteMedia(id) {
        if (!confirm('Supprimer ce média ?')) return;
        try {
            await api.admin.deleteMedia(id);
            media = media.filter(m => m.id !== id);
        } catch (e) {
            alert(e.message);
        }
    }
</script>

<div class="admin-page">
    <div class="page-header">
        <h1>🎬 Gestion des médias</h1>
        <div class="header-actions">
            <button class="add-btn" on:click={startCreate}>+ Nouveau média</button>
            <a href="/admin" use:link class="back-btn">← Retour</a>
        </div>
    </div>

    {#if showForm}
        <div class="form-card">
            <h3>{editingId ? 'Modifier' : 'Nouveau'} média</h3>
            <form on:submit|preventDefault={handleSubmit}>
                <div class="form-row">
                    <div class="form-group">
                        <label>Titre</label>
                        <input type="text" bind:value={formData.title} required />
                    </div>
                    <div class="form-group">
                        <label>Type</label>
                        <select bind:value={formData.type}>
                            <option value="film">Film</option>
                            <option value="serie">Série</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Année de sortie</label>
                        <input type="number" bind:value={formData.release_year} min="1900" max="2100" />
                    </div>
                    <div class="form-group">
                        <label>URL du poster</label>
                        <input type="url" bind:value={formData.poster_url} placeholder="https://..." />
                    </div>
                </div>
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
                        <th>Titre</th>
                        <th>Type</th>
                        <th>Année</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each media as m}
                        <tr>
                            <td>{m.id}</td>
                            <td>{m.title}</td>
                            <td><span class="type-badge {m.type}">{m.type}</span></td>
                            <td>{m.release_year || '-'}</td>
                            <td class="actions">
                                <button class="edit-btn" on:click={() => startEdit(m)}>✏️</button>
                                <button class="delete-btn" on:click={() => deleteMedia(m.id)}>🗑️</button>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="5" class="empty">Aucun média</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<style>
    .admin-page {
        max-width: 1000px;
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

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .form-group label {
        display: block;
        color: #ccc;
        margin-bottom: 0.5rem;
    }

    .form-group input, .form-group select {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #333;
        border-radius: 8px;
        background: #16213e;
        color: #eee;
        font-size: 1rem;
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

    .type-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
    }

    .type-badge.film {
        background: #e94560;
        color: white;
    }

    .type-badge.serie {
        background: #0f3460;
        color: #ccc;
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
