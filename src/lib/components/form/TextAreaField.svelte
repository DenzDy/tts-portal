<script lang="ts">
    import { cn } from "$lib/utils";
    import type { ClassValue } from "clsx";
  
    export let name: string;
    export let label: string;
    export let value: string = "";
    export let placeholder: string = "";
    export let helper: string = "";
    export let additionalText: string = "";
    export let errors: string[] = [];
    export let isRequired: boolean = false;
    export let divClasses: ClassValue[] = [];
    export let labelClasses: ClassValue[] = [];
    export let helperClasses: ClassValue[] = [];
    export let inputClasses: ClassValue[] = [];
    export let errorClasses: ClassValue[] = [];

    function trimValue(event: Event) {
        const target = event.target as HTMLInputElement;
        target.value = target.value.trim();
        value = target.value;
    }
</script>

<div class={cn("font-[Garet]", divClasses ?? [])}>
    <div class={cn("text-wrap", labelClasses ?? [])}>
        {#if label}
            <label for={name} class={cn("text-wrap")}>
                {label}
            </label>
        {/if}
    
        {#if errors.length > 0}
            <p class={cn("text-wrap", "inline-block", errorClasses ?? [])}>
                ({errors[0]})
            </p>
        {/if}
    </div>
        
    <p class={cn("font-[Garet]", "text-wrap", helperClasses ?? [])}>{@html helper}</p>

    <textarea
        id={name}
        name={name}
        bind:value={value}
        placeholder={placeholder}
        class={cn(
            "h-50", "text-wrap",
            inputClasses ?? []
        )}
        required={isRequired}
        aria-invalid={errors.length > 0}
        autocomplete="off"
        on:input={trimValue}
    ></textarea>

    {#if additionalText}
        <p class={cn("font-[Garet]", "text-wrap", helperClasses ?? [])}>{@html additionalText}</p>
    {/if}
</div>
