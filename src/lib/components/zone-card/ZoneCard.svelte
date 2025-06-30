<script>
    export let zoneName, zoneColor, zoneDescription;
</script>

<div class="flex flex-row gap-5 items-center">
    <div id="zone-box" class="w-18 h-18 bg-{zoneColor} rounded-md"></div>
    <div id="zone-text">
        <h2 class="font-[League_Spartan] font-semibold text-xl">{zoneName} zone</h2>
        <p class="font-[Comfortaa] text-xs">{zoneDescription}</p>
    </div>
</div>