<script lang="ts">
	import Button from '$lib/components/form/Button.svelte';
	import FAQ from '$lib/components/faq/FAQ.svelte';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		if (data?.toast) {
			if (data.toast.type === 'success') toast.success(data.toast.message);
			if (data.toast.type === 'error') toast.error(data.toast.message);

			// Clean URL
			history.replaceState({}, '', '/reserve');
		}
	});

	let guidelines = data?.guidelines;

	let divClasses: string[] = ['my-8', 'text-justify'];
	let questionClasses: string[] = ['font-black', 'text-lg', 'my-1', 'text-orange'];
	let answerClasses: string[] = ['text-gray-600'];
</script>

<div class="mx-auto my-8 w-5/6 md:w-1/2">
	<h1 class="text-center text-5xl font-bold">Reservation Guidelines</h1>

	<div class="mx-auto my-7 w-full border-b-2 border-gray-500"></div>

	{#each guidelines as guideline (guideline?.question)}
		<FAQ
			question={guideline?.question}
			answer={guideline?.answer}
			divClass={divClasses}
			questionClass={questionClasses}
			answerClass={answerClasses}
		/>
	{/each}

	<Button href="/reserve/new" btnClass={['w-full']}>Reserve</Button>
</div>
