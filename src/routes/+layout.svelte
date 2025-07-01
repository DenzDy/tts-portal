<script lang="ts">
	import '../app.css';

    import { Menu } from '@lucide/svelte';
    const { children } = $props();
</script>
<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=League+Spartan:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
</svelte:head>
<nav class="sticky top-0 bg-primary w-screen h-fit p-3 box-border">
    <button class="align-bottom">
        <Menu size={32} strokeWidth={3} class=""/>
    </button>
</nav>
<main class="bg-primary h-[calc(100vh-56px)] overflow-y overflow-auto snap-y snap-mandatory">
    {@render children()}
</main>
