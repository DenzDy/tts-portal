<script lang="ts">
    import { ChevronDown } from '@lucide/svelte';
</script>

<div class="bg-[url($lib/static/images/hero.png)] bg-size-[auto_100%] bg-[rgba(255,255,255,0.4)] bg-blend-lighten bg-center w-full h-full flex flex-col items-center justify-between pt-10">
    <img id='hero-image' src="src/lib/static/images/mobile-logo.png" alt="The Third Space Logo" class="w-[500px] h-[300px] object-cover">
    <p id="hero-text" class="text-primary w-full text-wrap p-5 text-center ">
        a place where people spend their time between their first place (home) and second place (work or school)
    </p>
    <ChevronDown/>
    <div id="stripes" class="w-full">
        <div class="bg-blue w-full h-[20px]"></div>
        <div class="bg-orange w-full h-[20px]"></div>
        <div class="bg-green w-full h-[20px]"></div>

    </div>
</div>