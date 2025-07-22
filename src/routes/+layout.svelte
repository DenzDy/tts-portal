<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/nav/Nav.svelte';
	let scrollContainer: HTMLElement | null = null;
	const { children } = $props();
	let open = $state(false);
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
		rel="stylesheet"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
		rel="stylesheet"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=League+Spartan:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
		rel="stylesheet"
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="icon" href="src/lib/static/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="src/lib/static/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="src/lib/static/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="src/lib/static/favicon-16x16.png" />
	<link rel="manifest" href="src/lib/static/site.webmanifest" />
	<title>The Third Space</title>
</svelte:head>
<Nav container={scrollContainer} />
<main
	bind:this={scrollContainer}
	class="bg-primary overflow-y h-[calc(100vh-56px)] snap-y snap-mandatory overflow-auto sm:h-[calc(100vh-80px)]"
>
	{@render children()}
</main>
