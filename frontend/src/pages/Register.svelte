<script>
    import { link, push } from 'svelte-spa-router';
    import { auth } from '../lib/stores/auth.js';

    let username = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let loading = false;
    let localError = '';

    async function handleSubmit() {
        localError = '';
        
        if (password !== confirmPassword) {
            localError = 'Les mots de passe ne correspondent pas';
            return;
        }

        if (password.length < 8) {
            localError = 'Le mot de passe doit contenir au moins 8 caractères';
            return;
        }

        loading = true;
        const result = await auth.register(username, email, password);
        loading = false;
        
        if (result.success) {
            push('/');
        }
    }
</script>

<div class="auth-page">
    <div class="auth-card">
        <h1>Inscription</h1>
        
        {#if $auth.error || localError}
            <div class="error">{$auth.error || localError}</div>
        {/if}

        <form on:submit|preventDefault={handleSubmit}>
            <div class="form-group">
                <label for="username">Nom d'utilisateur</label>
                <input 
                    type="text" 
                    id="username" 
                    bind:value={username} 
                    required
                    minlength="3"
                    disabled={loading}
                />
            </div>

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
                    minlength="8"
                    disabled={loading}
                />
            </div>

            <div class="form-group">
                <label for="confirmPassword">Confirmer le mot de passe</label>
                <input 
                    type="password" 
                    id="confirmPassword" 
                    bind:value={confirmPassword} 
                    required
                    disabled={loading}
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Inscription...' : "S'inscrire"}
            </button>
        </form>

        <p class="switch">
            Déjà un compte ? <a href="/login" use:link>Se connecter</a>
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
