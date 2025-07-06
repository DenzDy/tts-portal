// src/lib/form/reservationSchema.ts
import { z } from "zod";
import { buildZodField } from "$lib/form/buildSchema";
import { loadFormFieldsFromSheet } from "$lib/form/getFields";
import type { FormFields } from "./formTypes";
import { addNone } from "./addNoneOption";

export async function getReservationSchema(fetch: typeof globalThis.fetch) {
	let fields: FormFields[] = await loadFormFieldsFromSheet("Reservation Form", fetch);

    fields = addNone(fields);

	const schemaShape = Object.fromEntries(
		fields.map((def) => [def.Name, buildZodField(def)])
	);

	const reservationFormSchema = z.object(schemaShape);
	return { 
        reservationFields: fields,
        schema: reservationFormSchema
    };
}
