<script lang="ts">
	import { generateFormFields } from '$lib/form/generateFormField';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import type { AnyZodObject } from 'zod';
	import { superForm } from 'sveltekit-superforms/client';
	import Button from '$lib/components/form/Button.svelte';

	export let data: {
		form: SuperValidated<Infer<AnyZodObject>>;
		reservationFields: any[];
		calendarSource: string;
	};

	const { form, errors, enhance, submitting } = superForm(data.form);

	let classes = {
		divClasses: ['my-4'],
		labelClasses: ['font-bold', 'text-md'],
		helperClasses: ['text-gray-500', 'italic', 'text-sm', 'my-1'],
		inputClasses: ['my-2', 'rounded-md', 'border-blue', 'w-full'],
		errorClasses: ['text-red-500', 'italic', 'text-sm']
	};

	let renderedFields = data?.reservationFields?.map((def) => {
		return {
			name: def?.Name,
			label: def?.Label,
			...generateFormFields(def, classes)
		};
	});

	$: erroredFields = Object.entries($errors)
		.filter(([_, val]) => {
			if (Array.isArray(val)) {
				return val.length > 0;
			}
			if (val && typeof val === 'object' && '_errors' in val) {
				return Array.isArray(val._errors) && val._errors.length > 0;
			}
			return false;
		})
		.map(([key]) => key);
</script>

<div class="mx-auto my-8 w-5/6 md:w-1/2">
	<h1 class="text-center text-5xl font-bold">Reservation Form</h1>

	<div class="mx-auto my-7 w-full border-b-2 border-gray-500"></div>

	<form method="POST" use:enhance>
		{#each renderedFields as field (field.name)}
			{#if !field.name.includes('Others')}
				<svelte:component
					this={field.component}
					{...field.props}
					bind:value={$form[field.name]}
					errors={$errors[field.name] || []}
				/>
			{/if}

			{#if field.name == 'timeSlotEnd'}
				<iframe
					src={data.calendarSource}
					class="border-blue h-[600px] w-full rounded-md border-2"
					frameborder="0"
					scrolling="no"
					title="Google Calendar"
				></iframe>
			{/if}
		{/each}

		{#if erroredFields.length > 0}
			<div class="mb-6 rounded-md border-2 border-red-500 p-4 text-wrap">
				<p class="font-bold">You have errors in the following fields:</p>
				<ul class="mx-4 list-inside list-disc">
					{#each erroredFields as field}
						<li>{renderedFields.find((f) => f.name == field)?.label}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<div class="my-4 flex w-full gap-2">
			<Button href="/reserve" variant="outline" btnClass={['w-1/2']}>Back</Button>
			<Button type="submit" variant="primary" btnClass={['w-1/2']} loading={$submitting}>
				Submit
			</Button>
		</div>
	</form>
</div>
