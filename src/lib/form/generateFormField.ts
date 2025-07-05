import type { FormFields } from "./formTypes";
import TextField from "$lib/components/form/TextField.svelte";

export function generateFormFields(def: FormFields) {
    let component = TextField;

    let formField = {
        ...def
    }

    console.log(formField);

    switch (def?.Type.toLowerCase()) {
        case "text":
        case "textarea":
        case "email":
        case "number":
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