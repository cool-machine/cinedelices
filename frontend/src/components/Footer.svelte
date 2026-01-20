<script>
    import { link } from "svelte-spa-router";

    const currentYear = new Date().getFullYear();
    let email = "";

    function handleNewsletter(e) {
        e.preventDefault();
        alert("Merci pour votre inscription à la newsletter!");
        email = "";
    }
</script>

<footer class="site-footer">
    <!-- Film Strip Border -->
    <div class="footer-film-strip"></div>

    <div class="footer-content">
        <!-- Navigation Links -->
        <nav class="footer-nav">
            <a href="/about" use:link>About</a>
            <a href="/contact" use:link>Contact</a>
            <a href="/privacy" use:link>Privacy Policy</a>
            <a href="/legal" use:link>Terms of Service</a>
        </nav>

        <!-- Social Icons -->
        <div class="social-icons">
            <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                class="social-icon"
            >
                <svg viewBox="0 0 24 24" fill="currentColor"
                    ><path
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    /></svg
                >
            </a>
            <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                class="social-icon"
            >
                <svg viewBox="0 0 24 24" fill="currentColor"
                    ><path
                        d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                    /></svg
                >
            </a>
            <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                class="social-icon"
            >
                <svg viewBox="0 0 24 24" fill="currentColor"
                    ><path
                        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    /></svg
                >
            </a>
            <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                class="social-icon"
            >
                <svg viewBox="0 0 24 24" fill="currentColor"
                    ><path
                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                    /></svg
                >
            </a>
        </div>

        <!-- Newsletter -->
        <div class="newsletter">
            <span class="newsletter-label">Newsletter</span>
            <form on:submit={handleNewsletter} class="newsletter-form">
                <input
                    type="email"
                    bind:value={email}
                    placeholder="votre@email.com"
                    required
                />
                <button type="submit" class="subscribe-btn">Subscribe</button>
            </form>
        </div>
    </div>

    <!-- Copyright -->
    <div class="footer-bottom">
        <p class="copyright">
            &copy; {currentYear} Ciné Délices. All Rights Reserved. Cinematic Culinary
            Experiences.
        </p>
    </div>
</footer>

<style>
    .site-footer {
        background: #0a0a0a;
        margin-top: 0;
    }

    .footer-film-strip {
        height: 20px;
        background: var(--or-cinema);
        position: relative;
    }

    .footer-film-strip::before {
        content: "";
        position: absolute;
        top: 3px;
        left: 0;
        right: 0;
        height: 14px;
        background: repeating-linear-gradient(
            to right,
            transparent,
            transparent 15px,
            #0a0a0a 15px,
            #0a0a0a 25px
        );
    }

    .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 5%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 2rem;
    }

    /* Navigation */
    .footer-nav {
        display: flex;
        gap: 2rem;
    }

    .footer-nav a {
        color: var(--blanc-casse);
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        transition: color 0.3s;
    }

    .footer-nav a:hover {
        color: var(--or-cinema);
    }

    /* Social Icons */
    .social-icons {
        display: flex;
        gap: 1rem;
    }

    .social-icon {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 1px solid var(--or-cinema);
        color: var(--or-cinema);
        transition: all 0.3s;
    }

    .social-icon svg {
        width: 18px;
        height: 18px;
    }

    .social-icon:hover {
        background: var(--or-cinema);
        color: var(--noir-pur);
    }

    /* Newsletter */
    .newsletter {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .newsletter-label {
        font-family: var(--font-body);
        color: var(--blanc-casse);
        font-weight: 500;
    }

    .newsletter-form {
        display: flex;
        gap: 0;
    }

    .newsletter-form input {
        padding: 0.6rem 1rem;
        border: 1px solid var(--or-cinema);
        border-right: none;
        background: transparent;
        color: var(--blanc-casse);
        font-size: 0.9rem;
        border-radius: 4px 0 0 4px;
        width: 200px;
    }

    .newsletter-form input::placeholder {
        color: #666;
    }

    .newsletter-form input:focus {
        outline: none;
        box-shadow: none;
    }

    .subscribe-btn {
        padding: 0.6rem 1.2rem;
        background: var(--or-cinema);
        color: var(--noir-pur);
        border: 1px solid var(--or-cinema);
        font-family: var(--font-title);
        font-size: 0.9rem;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 0 4px 4px 0;
        transition: all 0.3s;
    }

    .subscribe-btn:hover {
        background: #e8c547;
    }

    /* Bottom */
    .footer-bottom {
        border-top: 1px solid rgba(212, 175, 55, 0.2);
        padding: 1.5rem 5%;
        text-align: center;
    }

    .copyright {
        color: #666;
        font-size: 0.85rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .footer-content {
            flex-direction: column;
            text-align: center;
        }

        .footer-nav {
            flex-wrap: wrap;
            justify-content: center;
        }

        .newsletter {
            flex-direction: column;
        }

        .newsletter-form input {
            width: 100%;
            border-radius: 4px;
            border-right: 1px solid var(--or-cinema);
            margin-bottom: 0.5rem;
        }

        .subscribe-btn {
            border-radius: 4px;
            width: 100%;
        }
    }
</style>
