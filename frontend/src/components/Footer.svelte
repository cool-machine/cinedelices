<script>
    import { link } from "svelte-spa-router";

    const currentYear = new Date().getFullYear();
</script>

<footer class="site-footer">
    <div class="footer-content">
        <div class="footer-brand">
            <span class="logo-text">Ciné Délices</span>
            <p class="tagline">Quand la gastronomie rencontre le 7ème art</p>
        </div>

        <div class="footer-links">
            <a href="/legal" use:link>Mentions Légales</a>
            <span class="separator">•</span>
            <a href="/privacy" use:link>Confidentialité (RGPD)</a>
            <span class="separator">•</span>
            <a
                href="https://github.com/cinedelices"
                target="_blank"
                rel="noopener noreferrer">GitHub</a
            >
        </div>

        <div class="copyright">
            &copy; {currentYear} Ciné Délices. Tous droits réservés. Projet étudiant.
        </div>
    </div>
</footer>

<style>
    .site-footer {
        background-color: #000; /* Noir pur pour le footer */
        border-top: 1px solid var(--or-cinema);
        padding: 3rem 1rem;
        margin-top: 4rem;
        text-align: center;
        position: relative;
    }

    .site-footer::before {
        content: "";
        position: absolute;
        top: -4px;
        left: 0;
        width: 100%;
        height: 3px;
        background: repeating-linear-gradient(
            90deg,
            var(--or-cinema) 0,
            var(--or-cinema) 10px,
            transparent 10px,
            transparent 20px
        );
        opacity: 0.5;
    }

    .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }

    .logo-text {
        font-family: var(--font-title);
        font-size: 2rem;
        color: var(--or-cinema);
        letter-spacing: 2px;
    }

    .tagline {
        font-family: var(--font-accent);
        font-style: italic;
        color: #aaa;
        font-size: 0.9rem;
        margin-top: 0.5rem;
    }

    .footer-links {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
    }

    .footer-links a {
        color: var(--blanc-casse);
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.3s;
    }

    .footer-links a:hover {
        color: var(--or-cinema);
    }

    .separator {
        color: var(--or-cinema);
        opacity: 0.5;
    }

    .copyright {
        font-size: 0.8rem;
        color: #666;
        margin-top: 1rem;
    }
</style>
