<script lang="ts">
	import '../app.css';
    import Nav from '$lib/components/nav/Nav.svelte';
    let scrollContainer: HTMLElement | undefined = $state();
    const { children } = $props();
    let open = $state(false);
</script>
<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=League+Spartan:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>
<Nav scrollContainer={scrollContainer}/>
<main bind:this={scrollContainer} class="bg-primary h-[calc(90vh)] sm:h-[calc(100vh-80px)] overflow-y overflow-auto snap-y snap-mandatory">
    {@render children()}
</main>
