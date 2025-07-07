<script lang="ts">
    import { generateFormFields } from "$lib/form/generateFormField";
    import type { SuperValidated, Infer } from 'sveltekit-superforms';
    import type { AnyZodObject } from 'zod';
    import { superForm } from 'sveltekit-superforms/client';
    import { enhance } from '$app/forms';

    export let data: {
        form: SuperValidated<Infer<AnyZodObject>>;
        reservationFields: any[];
    };

    let classes = {
        "divClasses": [],
        "labelClasses": ["font-bold", "text-md"],
        "helperClasses": ["text-gray-500", "italic", "text-sm"],
        "inputClasses": ["my-2", "rounded-md", "border-blue"],
        "errorClasses": ["text-red-500", "mb-5"]
    }

    let renderedFields = data?.reservationFields?.map(def => {
        return {
            name: def?.Name,
            ...generateFormFields(def, classes),
        }
    })

    const { form, errors } = superForm(data.form);

</script>

<h1>Reservation Form</h1>

<form method="POST" use:enhance>
    {#each renderedFields as field (field.name)}
        <svelte:component
            this={field.component}
            {...field.props}
            bind:value={$form[field.name]}
            errors={$errors[field.name] || []}
        />
    {/each}
    <button type="submit">Submit</button>
</form>
