<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/nav/Nav.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	let scrollContainer: HTMLElement | null = $state(null);
	const { children } = $props();
	let open = $state(false);

	// Only show Nav on these routes
	const showNavRoutes = ['/', '/about', '/dashboard']; // Adjust as needed
	const showNav = derived(page, ($page) => showNavRoutes.includes($page.url.pathname));
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
		rel="stylesheet"
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

{#if $showNav}
	<Nav {scrollContainer} />
{/if}

<main
	bind:this={scrollContainer}
	class="bg-primary overflow-y h-[calc(100vh-55px)] snap-y snap-mandatory overflow-auto sm:h-[calc(100vh-80px)]"
>
	{@render children()}
	<Footer />
</main>
