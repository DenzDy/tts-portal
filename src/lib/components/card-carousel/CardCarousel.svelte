<script lang="ts">
	import { onMount } from 'svelte';
	import EventCard from '$lib/components/event-card/EventCard.svelte';
    import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	export let events = [];

	let carousel: HTMLDivElement;
	let canScrollLeft = false;
	let canScrollRight = false;

	function updateScrollState() {
		if (!carousel) return;

		const scrollLeft = Math.ceil(carousel.scrollLeft);
		const scrollRightEdge = scrollLeft + carousel.clientWidth;
		const scrollWidth = Math.ceil(carousel.scrollWidth);

		const noScrollNeeded = scrollWidth <= carousel.clientWidth + 1;

		canScrollLeft = !noScrollNeeded && scrollLeft > 0;
		canScrollRight = !noScrollNeeded && scrollRightEdge < scrollWidth;
	}

	function scrollLeft() {
		carousel.scrollBy({ left: -carousel.clientWidth / 3, behavior: 'smooth' });
	}

	function scrollRight() {
		carousel.scrollBy({ left: carousel.clientWidth / 3, behavior: 'smooth' });
	}

	onMount(() => {
		updateScrollState();
		const observer = new ResizeObserver(updateScrollState);
		observer.observe(carousel);
		return () => observer.disconnect();
	});
</script>

<style>
	::-webkit-scrollbar {
		display: none;
	}
</style>

<!-- Carousel Wrapper -->
<div class="relative w-[90%] max-w-7xl mx-auto flex flex-row">
	<!-- Left Arrow -->
	<button
		class="z-20 disabled:opacity-30"
		on:click={scrollLeft}
		disabled={!canScrollLeft}
	>
		<ChevronLeft/>
	</button>

	<!-- Carousel -->
	<div
		bind:this={carousel}
		class="flex overflow-x-auto w-full gap-4 px-2 sm:px-6 scroll-smooth snap-x snap-mandatory"
		on:scroll={updateScrollState}
		style="scrollbar-width: none;"
	>
		{#each events as event, i}
			<div
				class="snap-center sm:snap-start shrink-0 box-border px-2 w-full sm:w-1/2 lg:w-1/3 min-w-[200px]"
				class:ml-6={i === 0}
				class:mr-6={i === events.length - 1}
			>
				<EventCard {...event} />
			</div>
		{/each}
	</div>

	<!-- Right Arrow -->
	<button
		class="z-20 disabled:opacity-30"
		on:click={scrollRight}
		disabled={!canScrollRight}
	>
		<ChevronRight/>
	</button>
</div>
