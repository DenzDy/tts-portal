<script lang="ts">
	import '../app.css';
    import { Menu } from '@lucide/svelte';
	let { children } = $props();
</script>
<button>
    <Menu/>
</button>
{@render children()}