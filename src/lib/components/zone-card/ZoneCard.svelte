<script>
	export let zoneName, zoneColor, zoneDescription;
</script>

<div class="flex flex-row gap-5 items-center w-[80%] sm:w-1/3 sm:flex-col">
    <div id="zone-box" class="min-w-18 h-18 bg-{zoneColor} rounded-md sm:h-40 sm:w-40 lg:h-64 lg:w-64"></div>
    <div id="zone-text" class=" sm:flex sm:flex-col items-center gap-2">
        <h2 class="font-[League_Spartan] font-semibold sm:text-xl lg:text-[2.5rem] text-{zoneColor} text-shadow-xs" style="">{zoneName} zone.</h2>
        <p class="font-[Comfortaa] text-xs sm:text-lg sm:text-center">{zoneDescription}</p>
    </div>
</div>
