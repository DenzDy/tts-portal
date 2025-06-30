<script>
    export let zoneName, zoneColor, zoneDescription;
</script>

<div class="flex flex-row gap-5 items-center max-w-[80%]">
    <div id="zone-box" class="min-w-18 h-18 bg-{zoneColor} rounded-md"></div>
    <div id="zone-text">
        <h2 class="font-[League_Spartan] font-semibold text-xl text-{zoneColor} text-shadow-xs" style="">{zoneName} zone.</h2>
        <p class="font-[Comfortaa] text-xs">{zoneDescription}</p>
    </div>
</div>