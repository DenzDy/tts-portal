<script lang="ts">
	import '../app.css';
    import { Menu } from '@lucide/svelte';
    const { children } = $props();
</script>
<nav class="sticky top-0 bg-primary w-screen h-fit p-3 box-border">
    <button class="align-bottom">
        <Menu size={32} strokeWidth={3} class=""/>
    </button>
</nav>
<main class="bg-primary h-[calc(100vh-56px)]">
    {@render children()}
</main>