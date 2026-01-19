<script>
    import { onMount } from 'svelte';
    import { push } from 'svelte-spa-router';
    import { api } from '../lib/api.js';
    import { auth } from '../lib/stores/auth.js';

    export let params = {};

    let categories = [];
    let media = [];
    let loading = true;
    let saving = false;
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
            const [recipe, cats, med] = await Promise.all([
                api.getRecipe(params.id),
                api.getCategories(),
                api.getMedia()
            ]);

            if (recipe.user_id !== $auth.user.id && $auth.user.role !== 'admin') {
                push(`/recipes/${params.id}`);
                return;
            }

            categories = cats;
            media = med;
            form = {
                title: recipe.title || '',
                description: recipe.description || '',
                ingredients: recipe.ingredients || '',
                instructions: recipe.instructions || '',
                image_url: recipe.image_url || '',
                category_id: recipe.category_id || '',
                media_id: recipe.media_id || ''
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
            await api.updateRecipe(params.id, {
                ...form,
                category_id: form.category_id || null,
                media_id: form.media_id || null
            });
            push(`/recipes/${params.id}`);
        } catch (e) {
            error = e.message;
        } finally {
            saving = false;
        }
    }
</script>

<div class="recipe-form-page">
    <h1>Modifier la recette</h1>

    {#if loading}
        <p class="loading">Chargement...</p>
    {:else}
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
                    disabled={saving}
                />
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="category">Catégorie</label>
                    <select id="category" bind:value={form.category_id} disabled={saving}>
                        <option value="">Sélectionner...</option>
                        {#each categories as cat}
                            <option value={cat.id}>{cat.name}</option>
                        {/each}
                    </select>
                </div>

                <div class="form-group">
                    <label for="media">Film/Série</label>
                    <select id="media" bind:value={form.media_id} disabled={saving}>
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
                    disabled={saving}
                />
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <textarea 
                    id="description" 
                    bind:value={form.description} 
                    rows="3"
                    disabled={saving}
                ></textarea>
            </div>

            <div class="form-group">
                <label for="ingredients">Ingrédients *</label>
                <textarea 
                    id="ingredients" 
                    bind:value={form.ingredients} 
                    rows="6"
                    required
                    disabled={saving}
                ></textarea>
            </div>

            <div class="form-group">
                <label for="instructions">Instructions *</label>
                <textarea 
                    id="instructions" 
                    bind:value={form.instructions} 
                    rows="8"
                    required
                    disabled={saving}
                ></textarea>
            </div>

            <div class="form-actions">
                <button type="button" class="cancel" on:click={() => push(`/recipes/${params.id}`)}>
                    Annuler
                </button>
                <button type="submit" disabled={saving}>
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    {/if}
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
