<script lang="ts">
	import { cn } from "$lib/utils";
	import { isOthersOption } from "$lib/service/formOptions";
	import type { ClassValue } from "clsx";

	export let name: string;
	export let label: string;
	export let value: string = "";
	export let othersText: string = "";
	export let helper: string = "";
	export let options: string[] = [];
	export let errors: string[] = [];
	export let isRequired: boolean = false;
	export let divClasses: ClassValue[] = [];
	export let labelClasses: ClassValue[] = [];
	export let helperClasses: ClassValue[] = [];
	export let inputClasses: ClassValue[] = [];
	export let errorClasses: ClassValue[] = [];

	function handleChange(selected: string) {
		value = selected;
		if (!isOthersOption(selected)) {
			othersText = "";
		}
	}
</script>

<div class={cn("font-[Garet]", divClasses ?? [])}>
	{#if label}
		<label for={name} class={cn("text-wrap", labelClasses ?? [])}>
            {label}{isRequired ? "*" : ""}
        </label>
	{/if}

	{#if helper}
		<p class={cn("font-[Garet]", "text-wrap", helperClasses ?? [])}>{helper}</p>
	{/if}

	{#each options as option}
		<label class={cn("flex items-center gap-2", inputClasses ?? [])}>
			<input
				type="radio"
				name={name}
				value={option}
				checked={value === option}
				on:change={() => handleChange(option)}
				required={isRequired}
			/>
			<span>{option}</span>
		</label>
	{/each}

	{#if isOthersOption(value)}
		<input
			type="text"
			bind:value={othersText}
			placeholder="Please specify..."
			class={cn(
                "font-[Garet]", "w-5/6", "lg:w-4xl", "mt-1",
                inputClasses ?? []
            )}
		/>
	{/if}

	{#if errors.length > 0}
		<p class={cn("text-wrap", errorClasses ?? [])}>{errors[0]}</p>
	{/if}
</div>
