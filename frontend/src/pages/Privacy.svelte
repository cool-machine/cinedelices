<script>
    import { link } from "svelte-spa-router";
</script>

<div class="legal-page movie-container">
    <h1>Politique de Confidentialité</h1>

    <section>
        <h2>1. Collecte des données</h2>
        <p>
            Dans le cadre de l'utilisation du site Ciné Délices, nous sommes
            amenés à collecter les données suivantes lorsque vous créez un
            compte :
        </p>
        <ul>
            <li>Nom d'utilisateur</li>
            <li>Adresse email</li>
            <li>Mot de passe (crypté)</li>
            <li>Préférences de recettes et favoris</li>
        </ul>
    </section>

    <section>
        <h2>2. Utilisation des données</h2>
        <p>Vos données sont utilisées uniquement pour :</p>
        <ul>
            <li>Vous permettre de vous connecter à votre compte.</li>
            <li>Sauvegarder vos recettes favorites.</li>
            <li>Publier et gérer vos propres recettes.</li>
            <li>Personnaliser votre expérience sur le site.</li>
        </ul>
    </section>

    <section>
        <h2>3. Cookies</h2>
        <p>
            Nous utilisons des cookies strictement nécessaires au fonctionnement
            du site (gestion de la session utilisateur). Ces cookies ne
            nécessitent pas de consentement préalable selon la réglementation en
            vigueur, mais nous vous en informons par transparence.
        </p>
    </section>

    <section>
        <h2>4. Vos droits (RGPD)</h2>
        <p>
            Conformément au Règlement Général sur la Protection des Données
            (RGPD), vous disposez des droits suivants :
        </p>
        <ul>
            <li>Droit d'accès (savoir quelles données nous avons sur vous).</li>
            <li>Droit de rectification (modifier vos données).</li>
            <li>
                Droit à l'effacement (supprimer votre compte et vos données).
            </li>
        </ul>
        <p>
            Pour exercer ces droits, vous pouvez nous contacter à <a
                href="mailto:privacy@cinedelices.fr"
                class="gold-link">privacy@cinedelices.fr</a
            > ou supprimer votre compte directement depuis votre page de profil.
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

    ul {
        list-style-type: disc;
        margin-left: 2rem;
        margin-bottom: 1.5rem;
    }

    li {
        margin-bottom: 0.5rem;
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
