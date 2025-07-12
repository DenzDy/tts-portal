<script lang="ts">
    import { cn } from "$lib/utils";
    import type { ClassValue } from "clsx";

    export let name: string;
    export let label: string;
    export let type: string = "text";
    export let value: string = "";
    export let placeholder: string = "";
    export let helper: string = "";
    export let errors: string[] = [];
    export let isRequired: boolean = false;
    export let divClasses: ClassValue[] = [];
    export let labelClasses: ClassValue[] = [];
    export let helperClasses: ClassValue[] = [];
    export let inputClasses: ClassValue[] = [];
    export let errorClasses: ClassValue[] = [];

    function restrictNonNumericInput(event: KeyboardEvent) {
		if (type !== 'number') return;

		const allowedKeys = [
			'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
			'ArrowLeft', 'ArrowRight', 'Home', 'End', '-', '.',
		];
		const isNumber = /^[0-9]$/.test(event.key);

		if (!allowedKeys.includes(event.key) && !isNumber) {
			event.preventDefault();
		}
	}

	function filterPastedInput(event: Event) {
        const inputEvent = event as InputEvent;
        const input = inputEvent.target as HTMLInputElement;

        if (type !== 'number') return;

        input.value = input.value.replace(/[^\d.-]/g, '');
        value = input.value;
    }

    function trimValue(event: Event) {
        const input = event.target as HTMLInputElement;
        input.value = input.value.trim();
        value = input.value;
    }
</script>

<div class={cn("font-[Garet]", divClasses ?? [])}>
    <div class={cn("text-wrap", labelClasses ?? [])}>
        <label for={name}
            class={cn("text-wrap")}
        >
            {label}
        </label>
    
        {#if errors.length > 0}
            <p class={cn("text-wrap", "inline-block", errorClasses ?? [])}>
               ({errors[0]})
            </p>
        {/if}
    </div>

    <p class={cn("font-[Garet]", "text-wrap", helperClasses ?? [])}>{@html helper}</p>
    
    <input 
        type={type}
        id={name}
        name={name}
        class={cn(
            "font-[Garet]",
            inputClasses ?? []
        )}
        placeholder={placeholder}
        required={isRequired}
        aria-invalid={errors.length > 0}
        bind:value={value}
        autocomplete="off"
        on:keydown={restrictNonNumericInput}
		on:input={(e) => {
            filterPastedInput(e);
            trimValue(e);
        }}
    />
</div>