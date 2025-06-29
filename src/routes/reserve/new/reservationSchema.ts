import { z } from "zod";
import { buildZodField } from "$lib/form/buildSchema";
import { loadFormFieldsFromSheet } from "$lib/form/getFields";

// Get a record of header name, value of cell for each form field under the Reservation Form module
const fields = await loadFormFieldsFromSheet("Reservation Form", fetch);

// Build the schema from the form fields
const schemaShape = Object.fromEntries(
    fields.map(def => [def.Name, buildZodField(def)])
);

// Turn into one schema
export const reservationFormSchema = z.object(schemaShape);
export type ReservationFormSchema = typeof reservationFormSchema;
