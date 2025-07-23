<script>
	export let zoneName, zoneColor, zoneDescription;
</script>

<div class="flex max-w-[80%] flex-row items-center gap-5 sm:max-w-80 sm:flex-col">
	<div id="zone-box" class="h-18 min-w-18 bg-{zoneColor} rounded-md sm:h-64 sm:w-64"></div>
	<div id="zone-text" class=" items-center gap-2 sm:flex sm:flex-col">
		<h2
			class="font-[League_Spartan] text-xl font-semibold sm:text-[2.5rem] text-{zoneColor} text-shadow-xs"
			style=""
		>
			{zoneName} zone.
		</h2>
		<p class="font-[Comfortaa] text-xs sm:text-lg md:text-center">{zoneDescription}</p>
	</div>
</div>
