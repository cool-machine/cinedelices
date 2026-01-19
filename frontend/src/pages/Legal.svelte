<script>
    import { link } from "svelte-spa-router";
</script>

<div class="legal-page movie-container">
    <h1>Mentions Légales</h1>

    <section>
        <h2>1. Édition du site</h2>
        <p>
            Le présent site, accessible à l’URL www.cinedelices.fr (le « Site
            »), est édité par :
        </p>
        <p>
            <strong>L'équipe Ciné Délices</strong>, étudiants de l'école
            O'clock, résidant au 10 Rue du Cinéma, 75000 Paris, de nationalité
            Française (France).
        </p>
    </section>

    <section>
        <h2>2. Hébergement</h2>
        <p>
            Le Site est hébergé par la société <strong>Microsoft Azure</strong>,
            situé au 1 Microsoft Way, Redmond, WA 98052, États-Unis.
        </p>
    </section>

    <section>
        <h2>3. Directeur de publication</h2>
        <p>Le Directeur de la publication du Site est l'équipe Ciné Délices.</p>
    </section>

    <section>
        <h2>4. Nous contacter</h2>
        <p>
            Par email : <a
                href="mailto:contact@cinedelices.fr"
                class="gold-link">contact@cinedelices.fr</a
            >
        </p>
    </section>

    <section>
        <h2>5. Données personnelles</h2>
        <p>
            Le traitement de vos données à caractère personnel est régi par
            notre <a href="/privacy" use:link class="gold-link"
                >Charte du respect de la vie privée</a
            >, disponible depuis la section "Politique de Confidentialité".
        </p>
    </section>
</div>

<style>
    .legal-page {
        max-width: 800px;
        margin: 2rem auto;
        padding: 2rem;
        color: var(--blanc-casse);
    }

    h1 {
        font-family: var(--font-title);
        color: var(--or-cinema);
        font-size: 3rem;
        margin-bottom: 2rem;
        text-align: center;
        text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
    }

    h2 {
        font-family: var(--font-title);
        color: var(--or-cinema);
        font-size: 1.8rem;
        margin-top: 2rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid rgba(212, 175, 55, 0.3);
        padding-bottom: 0.5rem;
    }

    p {
        margin-bottom: 1rem;
        line-height: 1.6;
    }

    .gold-link {
        color: var(--or-cinema);
        text-decoration: none;
        transition: text-shadow 0.3s ease;
    }

    .gold-link:hover {
        text-decoration: underline;
        text-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
    }
</style>
