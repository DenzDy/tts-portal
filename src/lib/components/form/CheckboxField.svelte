<script lang="ts">
    import { cn } from "$lib/utils";
    import type { ClassValue } from "clsx";
    import { isOthersOption } from "$lib/service/formOptions";

    export let name: string;
    export let label: string;
    export let values: string[] = [];
    export let placeholder: string = "";
    export let othersText: string = ""; // for "Others"
    export let helper: string = "";
    export let options: string[] = [];
    export let errors: string[] = [];
    export let isRequired: boolean = false;
    export let divClasses: ClassValue[] = [];
    export let labelClasses: ClassValue[] = [];
    export let helperClasses: ClassValue[] = [];
    export let inputClasses: ClassValue[] = [];
    export let errorClasses: ClassValue[] = [];

    const noneValue = "None";

    function handleChange(option: string, checked: boolean) {
		if (option === noneValue) {
			if (checked) {
				values = [noneValue];
                othersText = "";
			} else {
				values = [];
			}
        } else {
			// Remove "None" if another option is selected
			values = values.filter((v) => v !== noneValue);

			if (checked && !values.includes(option)) {
				values = [...values, option];
			} else if (!checked) {
				values = values.filter((v) => v !== option);
			}
		}

        // Clear text if "Others" is unchecked
        if (isOthersOption(option)) {
            othersText = checked ? othersText : "";
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
        <label class={cn("flex items-center gap-2", inputClasses, values.includes(noneValue) && option !== noneValue ? "text-gray-400" : "")}>
            <input
                type="checkbox"
                bind:group={values}
                value={option}
                class="rounded"
                disabled={values.includes(noneValue) && option !== noneValue}
                on:change={(e) => handleChange(option, (e.target as HTMLInputElement)?.checked)}
            />
            <span>{option}</span>
        </label>
    {/each}

    {#if values.some(isOthersOption)}
        <input
            type="text"
            bind:value={othersText}
            placeholder={placeholder !== "" ? placeholder : "Please specify..."}
            class={cn(
                "font-[Garet]", "w-5/6", "lg:w-4xl",
                inputClasses ?? [],
                "mt-1"
            )}
        />
    {/if}

    {#if errors.length > 0}
        <p class={cn(errorClasses)}>{errors[0]}</p>
    {/if}
</div>
