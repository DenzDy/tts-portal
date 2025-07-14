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
    export let additionalText: string = "";
    export let options: string[] = [];
    export let errors: string[] | { _errors: string[] } = [];
    export let isRequired: boolean = false;
    export let divClasses: ClassValue[] = [];
    export let labelClasses: ClassValue[] = [];
    export let helperClasses: ClassValue[] = [];
    export let inputClasses: ClassValue[] = [];
    export let errorClasses: ClassValue[] = [];

    const noneValue = "none";

    function handleChange(option: string, checked: boolean) {
        const optionLower = option.toLowerCase();

        if (optionLower === noneValue) {
            if (checked) {
                values = [option];
                othersText = "";
            } else {
                values = [];
            }
        } else {
            // Remove any "None" (case-insensitive)
            values = values.filter(v => v.toLowerCase() !== noneValue);

            if (checked && !values.includes(option)) {
                values = [...values, option];
            } else if (!checked) {
                values = values.filter(v => v !== option);
            }
        }

        // Clear text if "Others" is unchecked
        if (isOthersOption(option)) {
            othersText = checked ? othersText : "";
        }
    }

    $: noneSelected = values.some(v => v.toLowerCase() === noneValue);
    $: hasOtherSelected = values.some(v => v.toLowerCase() !== noneValue);
</script>

<div class={cn("font-[Garet]", divClasses ?? [])}>
    <div class={cn("text-wrap", labelClasses ?? [])}>
        {#if label}
            <label for={name} class={cn("text-wrap")}>
                {label}{isRequired ? "*" : ""}
            </label>
        {/if}

        {#if Array.isArray(errors) && errors.length > 0}
            <p class={cn("text-wrap", "inline-block", errorClasses ?? [])}>
                ({errors[0]?.toLowerCase()})
            </p>
        {:else if typeof errors === 'object' && errors !== null && '_errors' in errors && errors._errors.length > 0}
            <p class={cn("text-wrap", "inline-block", errorClasses ?? [])}>
                ({errors._errors[0]?.toLowerCase()})
            </p>
        {/if}
    </div>

    {#if helper}
        <p class={cn("font-[Garet]", "text-wrap", helperClasses ?? [])}>{@html helper}</p>
    {/if}

    {#each options as option}
        <label
            class={cn(
                "flex items-center gap-2",
                inputClasses ?? [],
                (noneSelected && option.toLowerCase() !== noneValue) || (hasOtherSelected && option.toLowerCase() === noneValue)
                    ? "text-gray-400"
                    : ""
            )}
        >
            <input
                type="checkbox"
                bind:group={values}
                value={option}
                class="rounded"
                name={name}
                disabled={
                    (noneSelected && option.toLowerCase() !== noneValue) ||
                    (hasOtherSelected && option.toLowerCase() === noneValue)
                }
                on:change={(e) => handleChange(option, (e.target as HTMLInputElement)?.checked)}
            />
            <span>{option}</span>
        </label>
    {/each}

    {#if values.some(isOthersOption)}
        <input
            type="text"
            bind:group={values}
            name={name + "Others"}
            bind:value={othersText}
            placeholder={placeholder !== "" ? placeholder : "Please specify..."}
            class={cn("font-[Garet]", inputClasses ?? [], "mt-1")}
        />
    {/if}

    {#if additionalText}
        <p class={cn("font-[Garet]", "text-wrap", helperClasses ?? [])}>{@html additionalText}</p>
    {/if}
</div>
