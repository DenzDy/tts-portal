<script lang="ts">
	let open = $state(false);
	import { X, Menu } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import NavItem from '$lib/components/nav/NavItem.svelte';
	import desktopLogo from '$lib/static/images/desktop-logo.png';
	import { onMount } from 'svelte';
	let showImage = $state(false);
	const { container } = $props<{ container: HTMLElement | null }>();
	onMount(() => {
		if (!container) return;

		const onScroll = () => {
			showImage = container.scrollTop > container.clientHeight / 4;
		};

		container.addEventListener('scroll', onScroll);
		return () => container.removeEventListener('scroll', onScroll);
	});
	const closeMenu = () => (open = false);
</script>

<nav
	class="bg-primary sticky top-0 box-border h-[56px] w-screen p-3 sm:flex sm:h-[80px] sm:flex-row sm:items-center sm:justify-between sm:px-5"
>
	<button class="align-bottom sm:hidden" onclick={() => (open = !open)}>
		{#if !open}
			<Menu size={32} strokeWidth={3} class="" />
		{:else}
			<X size={32} strokeWidth={3} class="" />
		{/if}
	</button>
	{#if open}
		<div
			class="bg-primary absolute left-0 z-[999] mt-2 flex w-full flex-col sm:hidden"
			transition:slide
		>
			<NavItem link="/#hero" name="Home" onClick={closeMenu} />
			<NavItem link="/#about-us" name="About Us" onClick={closeMenu} />
			<NavItem link="/#zones" name="Zones" onClick={closeMenu} />
			<NavItem link="/#recent-events" name="Recent Events" onClick={closeMenu} />
			<NavItem link="/#contact-us" name="Contact Us" onClick={closeMenu} />
			<NavItem link="/reserve" name="Reserve" itemClass={['text-orange']} onClick={closeMenu} />
		</div>
	{/if}
	<img
		src={desktopLogo}
		alt=""
		srcset=""
		class="hidden h-full opacity-0 transition-opacity duration-300 sm:block"
		class:opacity-100={showImage}
	/>

	<div class="hidden sm:block">
		<NavItem link="/" name="Home" onClick={closeMenu} />
		<NavItem link="/#about-us" name="About Us" onClick={closeMenu} />
		<NavItem link="/#zones" name="Zones" onClick={closeMenu} />
		<NavItem link="/#recent-events" name="Recent Events" onClick={closeMenu} />
		<NavItem link="/#contact-us" name="Contact Us" onClick={closeMenu} />
		<NavItem link="/reserve" name="Reserve" itemClass={['text-orange']} onClick={closeMenu} />
	</div>
</nav>
