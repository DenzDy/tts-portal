<script lang="ts">
    import { generateFormFields } from "$lib/form/generateFormField";

    export let data;

    let classes = {
        "divClasses": [],
        "labelClasses": ["font-bold", "text-md"],
        "helperClasses": ["text-gray-500", "italic", "text-sm"],
        "inputClasses": ["mt-3", "mb-5", "rounded-md", "border-blue"],
        "errorClasses": []
    }

    let renderedFields = data?.reservationFields?.map(def => {
        return {
            name: def?.Name,
            ...generateFormFields(def, classes),
        }
    })

    let formData: Record<string, any> = {};
</script>

<h1>Reservation Form</h1>

<form method="POST">
    {#each renderedFields as field (field.name)}
        <svelte:component
            this={field.component}
            {...field.props}
            bind:value={formData[field.name]}
        />
    {/each}
    <button type="submit">Submit</button>
</form>
