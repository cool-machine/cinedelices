<script>
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";
    import { api } from "../lib/api.js";
    import { auth } from "../lib/stores/auth.js";

    let loading = true;
    let saving = false;
    let error = null;

    let form = {
        username: "",
        email: "",
        bio: "",
        avatar_url: "",
    };

    onMount(async () => {
        if (!$auth.user) {
            push("/login");
            return;
        }

        try {
            const user = await api.getMe();
            form = {
                username: user.username || "",
                email: user.email || "",
                bio: user.bio || "",
                avatar_url: user.avatar_url || "",
            };
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });

    async function handleSubmit() {
        saving = true;
        error = null;

        try {
            await api.updateUser($auth.user.id, form);
            await auth.init();
            push(`/profile/${$auth.user.id}`);
        } catch (e) {
            error = e.message;
        } finally {
            saving = false;
        }
    }

    async function handleDeleteAccount() {
        if (
            !confirm(
                "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
            )
        ) {
            return;
        }

        const confirmName = prompt(
            `Pour confirmer, tapez "${$auth.user.username}" :`,
        );
        if (confirmName !== $auth.user.username) {
            alert("Nom d'utilisateur incorrect. Suppression annulée.");
            return;
        }

        try {
            loading = true;
            await api.deleteUser($auth.user.id);
            await auth.logout();
            push("/");
        } catch (e) {
            error = e.message;
            loading = false;
        }
    }
</script>

<div class="profile-edit-page">
    <h1>Modifier le profil</h1>

    {#if loading}
        <p class="loading">Chargement...</p>
    {:else}
        {#if error}
            <div class="error">{error}</div>
        {/if}

        <form on:submit|preventDefault={handleSubmit}>
            <div class="form-group">
                <label for="username">Nom d'utilisateur</label>
                <input
                    type="text"
                    id="username"
                    bind:value={form.username}
                    required
                    minlength="3"
                    disabled={saving}
                />
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input
                    type="email"
                    id="email"
                    bind:value={form.email}
                    required
                    disabled={saving}
                />
            </div>

            <div class="form-group">
                <label for="avatar_url">URL de l'avatar</label>
                <input
                    type="url"
                    id="avatar_url"
                    bind:value={form.avatar_url}
                    placeholder="https://..."
                    disabled={saving}
                />
                {#if form.avatar_url}
                    <div class="avatar-preview">
                        <img src={form.avatar_url} alt="Aperçu" />
                    </div>
                {/if}
            </div>

            <div class="form-group">
                <label for="bio">Bio</label>
                <textarea
                    id="bio"
                    bind:value={form.bio}
                    rows="4"
                    placeholder="Parlez-nous de vous..."
                    disabled={saving}
                ></textarea>
            </div>

            <div class="form-actions">
                <button
                    type="button"
                    class="cancel"
                    on:click={() => push(`/profile/${$auth.user.id}`)}
                >
                    Annuler
                </button>
                <button type="submit" disabled={saving}>
                    {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
            </div>
        </form>

        <div class="delete-account-section">
            <h3>Zone Danger</h3>
            <p>
                La suppression de votre compte est irréversible. Toutes vos
                données (recettes, favoris, commentaires) seront définitivement
                effacées.
            </p>
            <button
                type="button"
                class="delete-btn"
                on:click={handleDeleteAccount}
            >
                Supprimer mon compte
            </button>
        </div>
    {/if}
</div>

<style>
    .profile-edit-page {
        max-width: 500px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        color: #eee;
        margin-bottom: 2rem;
    }

    .loading {
        text-align: center;
        color: #888;
        padding: 3rem;
    }

    .error {
        background: rgba(233, 69, 96, 0.2);
        border: 1px solid #e94560;
        color: #e94560;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        color: #ccc;
        margin-bottom: 0.5rem;
    }

    input,
    textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #333;
        border-radius: 8px;
        background: #1a1a2e;
        color: #eee;
        font-size: 1rem;
        font-family: inherit;
    }

    input:focus,
    textarea:focus {
        outline: none;
        border-color: #e94560;
    }

    textarea {
        resize: vertical;
    }

    .avatar-preview {
        margin-top: 1rem;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
    }

    .avatar-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }

    button {
        padding: 1rem 2rem;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
    }

    button[type="submit"] {
        background: #e94560;
        color: white;
    }

    button[type="submit"]:hover:not(:disabled) {
        background: #d13354;
    }

    button.cancel {
        background: #333;
        color: #ccc;
    }

    button.cancel:hover {
        background: #444;
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .delete-account-section {
        margin-top: 4rem;
        padding-top: 2rem;
        border-top: 1px solid #333;
    }

    .delete-account-section h3 {
        color: #e94560;
        margin-bottom: 1rem;
    }

    .delete-account-section p {
        color: #ccc;
        margin-bottom: 1.5rem;
    }

    .delete-btn {
        background-color: transparent;
        border: 2px solid #e94560;
        color: #e94560;
    }

    .delete-btn:hover {
        background-color: #e94560;
        color: white;
    }
</style>
