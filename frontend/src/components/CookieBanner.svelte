<script>
    import { onMount, createEventDispatcher } from "svelte";
    import { fade, fly } from "svelte/transition";

    let visible = false;

    onMount(() => {
        const consent = localStorage.getItem("cinedelices_cookie_consent");
        if (!consent) {
            visible = true;
        }
    });

    function acceptCookies() {
        localStorage.setItem("cinedelices_cookie_consent", "true");
        visible = false;
    }
</script>

{#if visible}
    <div class="cookie-banner" transition:fly={{ y: 100, duration: 500 }}>
        <div class="cookie-content">
            <p>
                🍪 <strong>Respect de votre vie privée</strong> <br />
                Nous utilisons des cookies essentiels pour assurer le bon fonctionnement
                de votre session sur Ciné Délices. Aucune donnée n'est revendue à
                des tiers.
                <a href="/#/privacy" class="link">En savoir plus</a>.
            </p>
            <button class="accept-btn" on:click={acceptCookies}>
                Accepter et Fermer
            </button>
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

    .accept-btn {
        background-color: var(--or-cinema);
        color: var(--noir-pellicule);
        border: none;
        padding: 0.8rem 1.5rem;
        font-family: var(--font-title);
        font-size: 1.1rem;
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
