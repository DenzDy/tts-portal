import type { FormFields } from "./formTypes";
import { noneDoesNotExist } from "$lib/service/formOptions";

export function addNone(fields: FormFields[]): FormFields[] {
    return fields.map(field => {
        if (field?.Options && field?.Validation === "none" && noneDoesNotExist(field.Options.split("; "))) {
            field.Options = "None; " + field.Options;
        }
        return field;
    });
}