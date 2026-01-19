<script>
    import { onMount } from 'svelte';
    import { push } from 'svelte-spa-router';
    import { api } from '../lib/api.js';
    import { auth } from '../lib/stores/auth.js';

    let categories = [];
    let media = [];
    let loading = false;
    let error = null;

    let form = {
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        image_url: '',
        category_id: '',
        media_id: ''
    };

    onMount(async () => {
        if (!$auth.user) {
            push('/login');
            return;
        }

        try {
            [categories, media] = await Promise.all([
                api.getCategories(),
                api.getMedia()
            ]);
        } catch (e) {
            error = e.message;
        }
    });

    async function handleSubmit() {
        loading = true;
        error = null;

        try {
            const data = {
                ...form,
                user_id: $auth.user.id,
                category_id: form.category_id || null,
                media_id: form.media_id || null
            };
            const recipe = await api.createRecipe(data);
            push(`/recipes/${recipe.id}`);
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    }
</script>

<div class="recipe-form-page">
    <h1>Nouvelle recette</h1>

    {#if error}
        <div class="error">{error}</div>
    {/if}

    <form on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
            <label for="title">Titre *</label>
            <input 
                type="text" 
                id="title" 
                bind:value={form.title} 
                required 
                disabled={loading}
            />
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="category">Catégorie</label>
                <select id="category" bind:value={form.category_id} disabled={loading}>
                    <option value="">Sélectionner...</option>
                    {#each categories as cat}
                        <option value={cat.id}>{cat.name}</option>
                    {/each}
                </select>
            </div>

            <div class="form-group">
                <label for="media">Film/Série</label>
                <select id="media" bind:value={form.media_id} disabled={loading}>
                    <option value="">Sélectionner...</option>
                    {#each media as m}
                        <option value={m.id}>{m.title}</option>
                    {/each}
                </select>
            </div>
        </div>

        <div class="form-group">
            <label for="image_url">URL de l'image</label>
            <input 
                type="url" 
                id="image_url" 
                bind:value={form.image_url} 
                placeholder="https://..."
                disabled={loading}
            />
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea 
                id="description" 
                bind:value={form.description} 
                rows="3"
                disabled={loading}
            ></textarea>
        </div>

        <div class="form-group">
            <label for="ingredients">Ingrédients *</label>
            <textarea 
                id="ingredients" 
                bind:value={form.ingredients} 
                rows="6"
                required
                placeholder="- 200g de farine&#10;- 3 oeufs&#10;..."
                disabled={loading}
            ></textarea>
        </div>

        <div class="form-group">
            <label for="instructions">Instructions *</label>
            <textarea 
                id="instructions" 
                bind:value={form.instructions} 
                rows="8"
                required
                placeholder="1. Préchauffer le four...&#10;2. Mélanger..."
                disabled={loading}
            ></textarea>
        </div>

        <div class="form-actions">
            <button type="button" class="cancel" on:click={() => push('/recipes')}>
                Annuler
            </button>
            <button type="submit" disabled={loading}>
                {loading ? 'Création...' : 'Créer la recette'}
            </button>
        </div>
    </form>
</div>

<style>
    .recipe-form-page {
        max-width: 700px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        color: #eee;
        margin-bottom: 2rem;
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

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    label {
        display: block;
        color: #ccc;
        margin-bottom: 0.5rem;
    }

    input, select, textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #333;
        border-radius: 8px;
        background: #1a1a2e;
        color: #eee;
        font-size: 1rem;
        font-family: inherit;
    }

    input:focus, select:focus, textarea:focus {
        outline: none;
        border-color: #e94560;
    }

    textarea {
        resize: vertical;
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
        transition: background 0.2s;
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
</style>
