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
	export let placeholder: string = "Select...";
	export let divClasses: ClassValue[] = [];
	export let labelClasses: ClassValue[] = [];
	export let helperClasses: ClassValue[] = [];
	export let inputClasses: ClassValue[] = [];
	export let errorClasses: ClassValue[] = [];

	function handleChange(event: Event) {
		const selected = (event.target as HTMLSelectElement).value;
		value = selected;
        othersText = isOthersOption(selected) ? othersText : "";
	}
</script>

<div class={cn("font-[Garet]", divClasses ?? [])}>
	{#if label}
		<label for={name} class={cn("text-wrap", labelClasses ?? [])}>
            {label}{isRequired ? "*" : ""
        }</label>
	{/if}

	{#if helper}
		<p class={cn("font-[Garet]", "text-wrap", helperClasses ?? [])}>{helper}</p>
	{/if}

    <select
        name={name}
        id={name}
        bind:value={value}
        class={cn(
            "font-[Garet]", "w-5/6", "lg:w-4xl", "block",
            inputClasses ?? []
        )}
        on:change={handleChange}
        required={isRequired}
    >
        <option disabled value="">{placeholder}</option>
        {#each options as option}
            <option value={option}>{option}</option>
        {/each}
    </select>

    {#if isOthersOption(value)}
        <input
            type="text"
            bind:value={othersText}
            placeholder="Please specify..."
            class={cn(
                "font-[Garet]", "w-5/6", "lg:w-4xl", "block",
                inputClasses ?? [],
                "mt-1"
            )}
        />
    {/if}

	{#if errors.length > 0}
		<p class={cn(errorClasses)}>{errors[0]}</p>
	{/if}
</div>
