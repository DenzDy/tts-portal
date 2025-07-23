<script lang="ts">
	import { onMount } from 'svelte';
	import { X, Menu } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import NavItem from '$lib/components/nav/NavItem.svelte';
	// import desktopLogo from '$lib/static/images/desktop-logo.png';
	import mobileLogo from '$lib/static/images/mobile-logo.png';
	let open = $state(false);
	let showImage = $state(false);

	const { scrollContainer } = $props<{ scrollContainer: HTMLElement | null }>();

	$effect(() => {
		if (!scrollContainer) return;

		const onScroll = () => {
			showImage = scrollContainer.scrollTop > (scrollContainer.clientHeight / 4);
		};

		scrollContainer.addEventListener('scroll', onScroll);
		onScroll(); // Set initial value

		return () => scrollContainer.removeEventListener('scroll', onScroll);
	});

	const closeMenu = () => (open = false);
</script>

<nav class="sticky top-0 bg-primary w-screen h-[55px] sm:h-[80px] p-3 box-border sm:items-center sm:justify-between sm:px-5 sm:flex sm:flex-row">
	<button class="align-bottom sm:hidden" onclick={() => open = !open}>
		{#if !open}
			<Menu size={32} strokeWidth={3} />
		{:else}
			<X size={32} strokeWidth={3} />
		{/if}
	</button>

	{#if open}
		<div class="left-0 absolute z-[999] sm:hidden mt-2 flex flex-col bg-primary w-full" transition:slide>
			<NavItem link='/#hero' name='Home' onClick={closeMenu} />
			<NavItem link='/#about-us' name='About Us' onClick={closeMenu} />
			<NavItem link='/#zones' name='Zones' onClick={closeMenu} />
			<NavItem link='/#recent-events' name='Recent Events' onClick={closeMenu} />
			<NavItem link='/#contact-us' name='Contact Us' onClick={closeMenu} />
			<NavItem link='/reserve' name="Reserve" itemClass={['text-orange']} onClick={closeMenu} />
		</div>
	{/if}

	<!-- Show/hide logo based on scroll -->
	<img
		src={mobileLogo}
		alt=""
		class="hidden sm:block h-full transition-opacity duration-300 opacity-0"
		class:opacity-100={showImage}
	/>

	<div class="hidden sm:block">
		<NavItem link='/' name='Home' onClick={closeMenu} />
		<NavItem link='/#about-us' name='About Us' onClick={closeMenu} />
		<NavItem link='/#zones' name='Zones' onClick={closeMenu} />
		<NavItem link='/#recent-events' name='Recent Events' onClick={closeMenu} />
		<NavItem link='/#contact-us' name='Contact Us' onClick={closeMenu} />
		<NavItem link='/reserve' name="Reserve" itemClass={['text-orange']} onClick={closeMenu} />
	</div>
</nav>
