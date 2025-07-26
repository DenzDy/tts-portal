<script lang="ts">
	import { ChevronDown, MapPin } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import ZoneCard from '$lib/components/zone-card/ZoneCard.svelte';
	import CardCarousel from '$lib/components/card-carousel/CardCarousel.svelte';
	import { browser } from '$app/environment';
	import EventCard from '$lib/components/event-card/EventCard.svelte';
	import hero from '$lib/static/images/hero.png';
	import anniv from '$lib/static/images/anniv.png';
	import mobileLogo from '$lib/static/images/mobile-logo.png';
	import desktopLogo from '$lib/static/images/desktop-logo.png';
	import desktopHero from '$lib/static/images/hero-unedited.png';
	import newspaperTTS from '$lib/static/images/newspaper-tts.png';

	const events = [
		{
			image: anniv,
			headerText: 'The Third Space Anniversary',
			date: 'April 11, 2024',
			description: 'Lorem ipsum.'
		},
		{
			image: anniv,
			headerText: 'The Third Space Anniversary',
			date: 'April 12, 2024',
			description: 'Lorem ipsum.'
		},
		{
			image: anniv,
			headerText: 'The Third Space Anniversary',
			date: 'April 13, 2024',
			description: 'Lorem ipsum.'
		},
		{
			image: anniv,
			headerText: 'The Third Space Anniversary',
			date: 'April 14, 2024',
			description: 'Lorem ipsum.'
		},
		{
			image: anniv,
			headerText: 'The Third Space Anniversary',
			date: 'April 15, 2024',
			description: 'Lorem ipsum.'
		}
	];
	let windowWidth = 0;
	onMount(() => {
		windowWidth = window.innerWidth;
		window.addEventListener('resize', () => {
			windowWidth = window.innerWidth;
		});
	});

	$: isDesktop = windowWidth > 640 ? 3 : 1;
</script>

<div
	id="hero"
	class="bg-hero flex h-full w-full snap-start flex-col items-center justify-between bg-[rgba(255,255,255,0.4)] bg-size-[auto_100%] bg-center pt-10 bg-blend-lighten sm:bg-none!"
>
	<div class="sm:flex sm:w-full sm:flex-row sm:items-center sm:gap-10 sm:px-10">
		<img
			id="hero-image-large"
			src={desktopLogo}
			alt="The Third Space Logo"
			srcset=""
			class="hidden max-w-[600px] sm:block sm:w-[45%]"
		/>
		<img
			id="hero-image-small"
			src={mobileLogo}
			alt="The Third Space Logo"
			class="h-[300px] w-[500px] object-cover sm:hidden"
		/>
		<p
			id="hero-text"
			class="w-full p-5 text-center font-[Montserrat] text-xl font-medium text-wrap text-black sm:text-start"
		>
			a place where people spend their time between their first place (home) and second place (work
			or school)
		</p>
	</div>
	<ChevronDown class="sm:hidden" />
	<div
		class="bg-hero-desktop my-4 hidden min-h-[400px] w-[95%] grow-3 rounded-xl bg-center sm:block"
	></div>
	<div id="stripes" class="w-full">
		<div class="bg-blue h-[20px] w-full"></div>
		<div class="bg-orange h-[20px] w-full"></div>
		<div class="bg-green h-[20px] w-full"></div>
	</div>
</div>
<div
	id="about-us"
	class="mt-8 mb-10 flex w-full snap-start flex-col items-center gap-7 px-3 pt-3 sm:flex sm:flex-row sm:gap-16"
>
	<h1 class="text-primary text-center font-[League_Spartan] text-[3rem]/10 font-semibold sm:hidden">
		about the third space.
	</h1>
	<img src={newspaperTTS} alt="" srcset="" class="w-[80%] sm:w-[40%]" />
	<p class="mb-3 text-center font-[Garet] text-xs/6 font-bold text-black sm:hidden">
		The Third Space is a holistic, air-conditioned co-working space where students of the University
		of the Philippines can study for examinations or research, mingle with friends, collaborate with
		peers, and participate in various wellness initiatives. It aims to improve the overall
		well-being of students through activities that will restore their appreciation for discovert,
		collaborative learning, and community-building.
	</p>
	<div class="hidden w-[50%] sm:flex sm:flex-col sm:gap-16">
		<h1 class="text-primary font-[League_Spartan] text-[3rem]/16 font-semibold sm:text-[4rem]">
			about the third space.
		</h1>
		<p
			class="mb-3 text-center font-[Garet] text-xs/6 font-bold text-black sm:text-start sm:text-xl/12"
		>
			The Third Space is a holistic, air-conditioned co-working space where students of the
			University of the Philippines can study for examinations or research, mingle with friends,
			collaborate with peers, and participate in various wellness initiatives. It aims to improve
			the overall well-being of students through activities that will restore their appreciation for
			discovert, collaborative learning, and community-building.
		</p>
	</div>
</div>
<div id="zones" class="snap-start w-full mt-8 pt-3 flex flex-col items-center gap-7 px-3 sm:px-8 sm:py-8">
    <h1 class="font-[League_Spartan] text-[3rem]/10 text-center text-primary sm:text-[4rem] font-semibold">the three zones.</h1>
    <div class="flex flex-col items-center gap-7 sm:flex sm:flex-row sm:w-full sm:justify-evenly sm:gap-2 sm:items-start">
        <ZoneCard zoneName="orange" zoneColor="orange" zoneDescription="reading, research, and study space."/>
        <ZoneCard zoneName="blue" zoneColor="blue" zoneDescription="interaction of peers and friends — mindful conversations and discussions"/>
        <ZoneCard zoneName="green" zoneColor="green" zoneDescription="different wellness activities and learning opportunities"/>    
    </div>
    
</div>
<div
	id="recent-events"
	class="mt-8 flex w-full snap-start flex-col items-center gap-7 px-3 pt-3  sm:px-8"
>
	<h1
		class="text-primary text-center font-[League_Spartan] text-[3rem]/10 font-semibold sm:text-[4rem]"
	>
		recent events.
	</h1>
	{#if browser}
		<CardCarousel {events} />
	{/if}
</div>
<div
	id="contact-us"
	class="mt-8 flex w-full snap-start flex-col items-center gap-7 px-3 pt-3 pb-10  sm:px-8"
>
	<h1
		class="text-primary text-center font-[League_Spartan] text-[3rem]/10 font-semibold sm:text-[4rem]"
	>
		contact us.
	</h1>
	<div class="flex w-full justify-center">
		<div class="flex flex-row justify-center gap-10">
			<iframe
				title="Third Space Map"
				class="hidden w-[30vw] rounded-xl sm:block"
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4568.753586221223!2d121.07024019999999!3d14.652022499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b70017b34541%3A0x3d9454e592f0a43f!2sThird%20Space%20UP%20Diliman!5e1!3m2!1sen!2sph!4v1752918055704!5m2!1sen!2sph"
				width="600"
				height="450"
				style="border:0;"
				allowfullscreen={null}
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			></iframe>
			<div class="mb-5 flex flex-col justify-center gap-7">
				<!-- Contact Info Items-->
				<a href="https://www.facebook.com/thirdspace.upd" class="flex flex-row gap-3">
					<svg role="img" viewBox="0 0 24 24" width="30px" xmlns="http://www.w3.org/2000/svg"
						><title>Facebook</title><path
							d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
						/></svg
					>
					<p class="font-[Garet]">The Third Space UP Diliman</p>
                </a>
				<a href="https://www.instagram.com/thirdspace.upd/" class="flex flex-row items-center gap-3">
                    <svg role="img" viewBox="0 0 24 24" width="30px" xmlns="http://www.w3.org/2000/svg"
						><title>Instagram</title><path
							d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"
						/></svg
					>
					<p class="font-[Garet]">thirdspace.upd</p>
                </a>
				<div class="flex flex-row items-center gap-3">
					<MapPin size={30} />
					<p class="font-[Garet]">Kamia Residence Hall, UP Diliman</p>
				</div>
			</div>
		</div>
	</div>
</div>