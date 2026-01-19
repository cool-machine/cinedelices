<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    let visible = false;

    onMount(() => {
        const consent = localStorage.getItem("cinedelices_cookie_consent");
        if (!consent) {
            visible = true;
        }
    });

    function acceptCookies() {
        localStorage.setItem("cinedelices_cookie_consent", "accepted");
        visible = false;
    }

    function refuseCookies() {
        localStorage.setItem("cinedelices_cookie_consent", "refused");
        visible = false;
        // Note: Functional cookies (session auth) still work - they're required for the site
    }
</script>

{#if visible}
    <div class="cookie-banner" transition:fly={{ y: 100, duration: 500 }}>
        <div class="cookie-content">
            <p>
                🍪 <strong>Respect de votre vie privée</strong> <br />
                Nous utilisons uniquement des
                <strong>cookies fonctionnels</strong>
                nécessaires au bon fonctionnement du site (authentification, session).
                Aucun cookie publicitaire ni de suivi n'est utilisé. Aucune donnée
                n'est revendue à des tiers.
                <a href="/#/privacy" class="link">En savoir plus</a>.
            </p>
            <div class="button-group">
                <button class="refuse-btn" on:click={refuseCookies}>
                    Refuser
                </button>
                <button class="accept-btn" on:click={acceptCookies}>
                    Accepter
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .cookie-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgba(
            15,
            15,
            35,
            0.95
        ); /* Sombre légèrement transparent */
        border-top: 2px solid var(--or-cinema);
        padding: 1.5rem;
        z-index: 9999;
        box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
    }

    .cookie-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
        flex-wrap: wrap;
    }

    p {
        margin: 0;
        color: var(--blanc-casse);
        font-size: 0.95rem;
        flex: 1;
        min-width: 300px;
    }

    .link {
        color: var(--or-cinema);
        text-decoration: underline;
    }

    .button-group {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .refuse-btn {
        background-color: transparent;
        color: #ccc;
        border: 1px solid #666;
        padding: 0.8rem 1.5rem;
        font-size: 1rem;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.3s ease;
        white-space: nowrap;
    }

    .refuse-btn:hover {
        background-color: rgba(255, 255, 255, 0.1);
        border-color: #999;
    }

    .accept-btn {
        background-color: var(--or-cinema);
        color: var(--noir-pellicule);
        border: none;
        padding: 0.8rem 1.5rem;
        font-size: 1rem;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.3s ease;
        white-space: nowrap;
    }

    .accept-btn:hover {
        background-color: #f0c33a;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(212, 175, 55, 0.3);
    }
</style>
