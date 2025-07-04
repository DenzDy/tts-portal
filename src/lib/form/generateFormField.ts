import type { FormFields } from "./formTypes";
import TextField from "$lib/components/form/TextField.svelte";
import TextAreaField from '$lib/components/form/TextAreaField.svelte';

export function generateFormFields(def: FormFields) {
    let component = TextField;

    let formField = {
        ...def
    }

    console.log(formField);

    switch (def?.Type.toLowerCase()) {
        case "text":
        case "email":
        case "number":
            break;
        case "textarea":
            component = TextAreaField;
            break;        
        default:
            // Defaults to TextField
            break;
    }

    return {
        component,
        props: {
            name: def?.Name,
            label: def?.Label,
            type: def?.Type,
            placeholder: def?.Placeholder,
            helper: def?.Helper,
            required: def?.Required?.toLowerCase() === "true",
            options: def.Options?.split('; ').map((opt) => opt.trim()),
            ...formField
        }
    }
}