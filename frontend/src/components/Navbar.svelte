<script>
    import { link } from "svelte-spa-router";
    import { auth } from "../lib/stores/auth.js";

    async function handleLogout() {
        await auth.logout();
    }
</script>

<header>
    <nav>
        <div class="logo">
            <a href="/" use:link>🎬 Ciné Délices</a>
        </div>
        <ul>
            <li><a href="/" use:link>Accueil</a></li>
            <li><a href="/recipes" use:link>Recettes</a></li>
            {#if $auth.user}
                <li><a href="/favorites" use:link>Favoris</a></li>
                <li>
                    <a href="/movie-search" use:link class="create-link"
                        >+ Créer</a
                    >
                </li>
                <li><a href="/profile/{$auth.user.id}" use:link>Profil</a></li>
                {#if $auth.user.role === "admin"}
                    <li><a href="/admin" use:link>Admin</a></li>
                {/if}
                <li>
                    <button
                        class="btn btn-small btn-secondary"
                        on:click={handleLogout}>Déconnexion</button
                    >
                </li>
            {:else}
                <li>
                    <a href="/login" use:link class="btn btn-small btn-gold"
                        >Connexion</a
                    >
                </li>
                <li>
                    <a
                        href="/register"
                        use:link
                        class="btn btn-small btn-secondary">Inscription</a
                    >
                </li>
            {/if}
        </ul>
    </nav>
</header>

<style>
    header {
        background-color: var(--noir-pur);
        padding: 1rem 5%;
        border-bottom: 2px solid var(--or-cinema);
        position: sticky;
        top: 0;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    }

    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1400px;
        margin: 0 auto;
    }

    .logo a {
        font-family: var(--font-title);
        font-size: 2rem;
        color: var(--or-cinema);
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    nav ul {
        display: flex;
        list-style: none;
        align-items: center;
        gap: 1.5rem;
        margin: 0;
        padding: 0;
    }

    nav a {
        color: var(--blanc-casse);
        text-decoration: none;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.9rem;
        transition: var(--transition);
    }

    nav a:hover {
        color: var(--or-cinema);
    }

    button {
        cursor: pointer;
    }

    @media (max-width: 768px) {
        nav {
            flex-direction: column;
            gap: 1rem;
        }

        nav ul {
            flex-wrap: wrap;
            justify-content: center;
        }
    }
</style>
