<script lang="ts">
    import { generateFormFields } from "$lib/form/generateFormField";
    import type { SuperValidated, Infer } from 'sveltekit-superforms';
    import type { AnyZodObject } from 'zod';
    import { superForm } from 'sveltekit-superforms/client';
    import { enhance } from '$app/forms';
    import Button from '$lib/components/form/Button.svelte';

    export let data: {
        form: SuperValidated<Infer<AnyZodObject>>;
        reservationFields: any[];
    };

    const { form, errors } = superForm(data.form);

    let classes = {
        "divClasses": ["my-4"],
        "labelClasses": ["font-bold", "text-md"],
        "helperClasses": ["text-gray-500", "italic", "text-sm", "my-1"],
        "inputClasses": ["my-2", "rounded-md", "border-blue", "w-full"],
        "errorClasses": ["text-red-500", "italic", "text-sm"]
    }

    let renderedFields = data?.reservationFields?.map(def => {
        return {
            name: def?.Name,
            ...generateFormFields(def, classes)
        }
    })

</script>

<div class="mx-auto w-5/6 md:w-1/2 my-8">
    <h1 class="text-5xl text-center font-bold">
        Reservation Form
    </h1>

    <div class="w-full mx-auto border-b-2 border-gray-500 my-7"></div>
    
    <form method="POST" use:enhance>
        {#each renderedFields as field (field.name)}
            <svelte:component
                this={field.component}
                {...field.props}
                bind:value={$form[field.name]}
                errors={$errors[field.name] || []}
            />
            
            {#if field.name == 'timeSlotEnd'}
                <iframe src="https://calendar.google.com/calendar/embed?src=7c16b6d1b813168b67088842ec7b78cc29e1559bf69019070face3d5363717ad%40group.calendar.google.com&ctz=Asia%2FManila" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>
            {/if}
        {/each}
    
        <div class="flex w-full gap-2">
            <Button href="/reserve" variant="outline" btnClass={["w-1/2"]}>
                Back
            </Button>
            <Button type="submit" variant="primary" btnClass={["w-1/2"]}>
                Submit
            </Button>
        </div>
    </form>
</div>
