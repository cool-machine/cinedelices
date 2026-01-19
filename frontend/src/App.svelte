<script>
  import Router from "svelte-spa-router";
  import { onMount } from "svelte";
  import { routes } from "./routes.js";
  import { auth } from "./lib/stores/auth.js";
  import Navbar from "./components/Navbar.svelte";
  import Footer from "./components/Footer.svelte";
  import CookieBanner from "./components/CookieBanner.svelte";

  onMount(() => {
    auth.init();
  });
</script>

<div class="app">
  {#if !$auth.loading}
    <Navbar />
    <main>
      <Router {routes} />
    </main>
    <Footer />
    <CookieBanner />
  {:else}
    <div class="loading">Chargement...</div>
  {/if}
</div>

<style>
  .app {
    min-height: 100vh;
  }

  main {
    padding-bottom: 2rem;
  }

  .loading {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    font-size: 1.2rem;
  }
</style>
