<script>
    import { onMount } from 'svelte';
    import { link, push } from 'svelte-spa-router';
    import { api } from '../../lib/api.js';
    import { auth } from '../../lib/stores/auth.js';

    let users = [];
    let loading = true;
    let error = null;

    onMount(async () => {
        if (!$auth.user || $auth.user.role !== 'admin') {
            push('/');
            return;
        }
        await loadUsers();
    });

    async function loadUsers() {
        try {
            users = await api.admin.getUsers();
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    }

    async function toggleRole(user) {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        if (!confirm(`Changer le rôle de ${user.username} en ${newRole} ?`)) return;
        
        try {
            await api.admin.updateUser(user.id, { role: newRole });
            user.role = newRole;
            users = users;
        } catch (e) {
            alert(e.message);
        }
    }

    async function deleteUser(id) {
        if (id === $auth.user.id) {
            alert('Vous ne pouvez pas supprimer votre propre compte');
            return;
        }
        if (!confirm('Supprimer cet utilisateur ?')) return;
        
        try {
            await api.admin.deleteUser(id);
            users = users.filter(u => u.id !== id);
        } catch (e) {
            alert(e.message);
        }
    }
</script>

<div class="admin-page">
    <div class="page-header">
        <h1>👥 Gestion des utilisateurs</h1>
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
                        <th>Utilisateur</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Inscrit le</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each users as user}
                        <tr>
                            <td>{user.id}</td>
                            <td>
                                <a href="/profile/{user.id}" use:link>{user.username}</a>
                            </td>
                            <td>{user.email}</td>
                            <td>
                                <span class="role-badge {user.role}">{user.role}</span>
                            </td>
                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                            <td class="actions">
                                <button 
                                    class="role-btn" 
                                    on:click={() => toggleRole(user)}
                                    title="Changer le rôle"
                                >
                                    {user.role === 'admin' ? '👤' : '🛡️'}
                                </button>
                                <button 
                                    class="delete-btn" 
                                    on:click={() => deleteUser(user.id)}
                                    disabled={user.id === $auth.user.id}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="6" class="empty">Aucun utilisateur</td>
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

    .role-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
    }

    .role-badge.admin {
        background: #e94560;
        color: white;
    }

    .role-badge.user {
        background: #0f3460;
        color: #ccc;
    }

    .actions {
        display: flex;
        gap: 0.5rem;
    }

    .role-btn, .delete-btn {
        padding: 0.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background: transparent;
        font-size: 1rem;
    }

    .role-btn {
        color: #4dabf7;
    }

    .delete-btn {
        color: #e94560;
    }

    .delete-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
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
