import { z } from "zod";
import { buildZodField } from '$lib/form/buildSchema';
import { loadFormFieldsFromSheet } from '$lib/form/getFields';

export async function load({ fetch }) {
    // Get a record of header name, value of cell for each form field
    const fields = await loadFormFieldsFromSheet("Reservation Form", fetch);    
    // console.log(fields);

    const schemaShape = Object.fromEntries(
        fields.map(def => [def.Name, buildZodField(def)])
    );

    const formSchema = z.object(schemaShape);
    // console.log(schemaShape);
    
    return {
        fields
    };
}