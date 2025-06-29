import { env } from '$env/dynamic/private';
import { FORM_FIELDS_TAB } from '$env/static/private';
import type { FormFields } from "./formTypes";

export async function loadFormFieldsFromSheet(module: string, fetch: typeof globalThis.fetch): Promise<FormFields[]> {
    // Get the form fields from sheets  
    const fieldsTab = env.FORM_FIELDS_TAB || FORM_FIELDS_TAB;
    const sheetRows = await fetch(`/api/gsheet?tab=${fieldsTab}`);
    const [header, ...rows]: string[][] = await sheetRows.json();

    // Filter the rows based on the module
    const filteredRows = rows?.filter(row => (row?.[0] !== '' && row?.[3] === module));

    // Properly format the form fields
    const fields = filteredRows.map(row =>
        Object.fromEntries(row.map((cell, i) => [header[i], cell])) as unknown as FormFields
    );

    return fields;
}