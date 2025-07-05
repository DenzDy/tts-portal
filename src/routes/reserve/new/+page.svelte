<script lang="ts">
    import { generateFormFields } from "$lib/form/generateFormField";
    // import { superForm } from 'sveltekit-superforms/client';

    export let data;

    let renderedFields = data?.reservationFields?.map(def => {
        return {
            name: def?.Name,
            ...generateFormFields(def)
        }
    })

    let formData: Record<string, any> = {};
    // const { form } = superForm(data.form);
</script>

<h1>Reservation Form</h1>

<!-- <form use:form> -->
    <!-- Put dynamic fields in here -->
<!-- </form> -->

{#each renderedFields as field (field.name)}
	<svelte:component
		this={field.component}
		{...field.props}
		bind:value={formData[field.name]}
        />
        <!-- Replace bind with below if superform is implemented -->
        <!-- bind:value={form[def.Name]} -->
{/each}