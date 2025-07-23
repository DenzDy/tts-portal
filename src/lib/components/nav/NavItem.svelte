<script lang="ts">
	import { cn } from '$lib/utils';
	import type { ClassValue } from 'clsx';
	export let name;
	export let link;
	export let itemClass: ClassValue[] = [];
	export let onClick: () => void;
</script>

<a
	href={link}
	class={cn(
		'ml-4',
		'py-4',
		'sm:px-1',
		'font-[League_Spartan]',
		'text-[1.25rem] sm:text-[1rem]',
		'font-semibold',
		itemClass
	)}
	onclick={onClick}>{name}</a
>
