<script lang="ts">
    import { cn } from "$lib/utils";
    import type { ClassValue } from "clsx";
  
    export let name: string;
    export let label: string;
    export let value: string;
    export let placeholder: string = "";
    export let helper: string = "";
    export let errors: string[] = [];
    export let isRequired: boolean = false;
    export let divClasses: ClassValue[] = [];
    export let labelClasses: ClassValue[] = [];
    export let helperClasses: ClassValue[] = [];
    export let inputClasses: ClassValue[] = [];
    export let errorClasses: ClassValue[] = [];
</script>

<div class={cn("font-[Garet]", divClasses)}>
    {#if label}
        <label for={name} class={cn(labelClasses)}>
            {label}
        </label>
    {/if}

    <p class={cn("font-[Garet]", helperClasses)}>{helper}</p>

    <textarea
        id={name}
        name={name}
        bind:value={value}
        placeholder={placeholder}
        class={cn(
            "w-5/6", "lg:w-4xl", "h-50",
            inputClasses
        )}
        required={isRequired}
        aria-invalid={errors.length > 0}
        autocomplete="off"
    ></textarea>

    {#if errors.length > 0}
        <p class={cn(errorClasses)}>
            {errors[0]}
        </p>
    {/if}
</div>

<style>
</style>
