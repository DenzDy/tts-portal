import type { FormFields } from "./formTypes";
import TextField from "$lib/components/form/TextField.svelte";
import TextAreaField from '$lib/components/form/TextAreaField.svelte';
import CheckboxField from "$lib/components/form/CheckboxField.svelte";
import SelectField from "$lib/components/form/SelectField.svelte";
import RadioField from "$lib/components/form/RadioField.svelte";
import type { ClassValue } from "clsx";

export function generateFormFields(def: FormFields, classes: Record<string, ClassValue[]> = {}) {
    let component = TextField;

    let formField = {
        ...def
    }

    switch (def?.Type.toLowerCase()) {
        case "text":
        case "email":
        case "number":
            break;
        case "textarea":
            component = TextAreaField;
            break;
        case "checkbox":
            component = CheckboxField;
            break;
        case "select":
            component = SelectField;
            break;
        case "radio":
            component = RadioField;
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
            regex: def?.Regex,
            required: def?.Required?.toLowerCase() === "true",
            options: def.Options?.split('; ').map((opt) => opt.trim()),
            ...formField,
            ...classes,
        }
    }
}