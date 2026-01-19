<script>
    import { link, push } from 'svelte-spa-router';
    import { auth } from '../lib/stores/auth.js';

    let email = '';
    let password = '';
    let loading = false;

    async function handleSubmit() {
        loading = true;
        const result = await auth.login(email, password);
        loading = false;
        if (result.success) {
            push('/');
        }
    }
</script>

<div class="auth-page">
    <div class="auth-card">
        <h1>Connexion</h1>
        
        {#if $auth.error}
            <div class="error">{$auth.error}</div>
        {/if}

        <form on:submit|preventDefault={handleSubmit}>
            <div class="form-group">
                <label for="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    bind:value={email} 
                    required
                    disabled={loading}
                />
            </div>

            <div class="form-group">
                <label for="password">Mot de passe</label>
                <input 
                    type="password" 
                    id="password" 
                    bind:value={password} 
                    required
                    disabled={loading}
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
            </button>
        </form>

        <p class="switch">
            Pas encore de compte ? <a href="/register" use:link>S'inscrire</a>
        </p>
    </div>
</div>

<style>
    .auth-page {
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .auth-card {
        background: #1a1a2e;
        padding: 2.5rem;
        border-radius: 12px;
        width: 100%;
        max-width: 400px;
    }

    h1 {
        color: #eee;
        text-align: center;
        margin-bottom: 2rem;
    }

    .error {
        background: rgba(233, 69, 96, 0.2);
        border: 1px solid #e94560;
        color: #e94560;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        color: #ccc;
        margin-bottom: 0.5rem;
    }

    input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #333;
        border-radius: 8px;
        background: #16213e;
        color: #eee;
        font-size: 1rem;
    }

    input:focus {
        outline: none;
        border-color: #e94560;
    }

    button {
        width: 100%;
        padding: 1rem;
        background: #e94560;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.2s;
    }

    button:hover:not(:disabled) {
        background: #d13354;
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .switch {
        text-align: center;
        margin-top: 1.5rem;
        color: #888;
    }

    .switch a {
        color: #e94560;
    }
</style>
