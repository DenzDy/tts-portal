// src/lib/form/reservationSchema.ts
import { z } from "zod";
import { buildZodField } from "$lib/form/buildSchema";
import { loadFormFieldsFromSheet } from "$lib/form/getFields";
import type { FormFields } from "./formTypes";

export async function getReservationSchema(fetch: typeof globalThis.fetch) {
	const fields: FormFields[] = await loadFormFieldsFromSheet("Reservation Form", fetch);

	const schemaShape = Object.fromEntries(
		fields.map((def) => [def.Name, buildZodField(def)])
	);

	const reservationFormSchema = z.object(schemaShape);
	return { 
        reservationFields: fields,
        schema: reservationFormSchema
    };
}
