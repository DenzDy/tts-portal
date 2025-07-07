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
        fields
            .map((def) => [def.Name, buildZodField(def)])
            .filter(([_, val]) => val !== undefined)
    );

	const reservationFormSchema = z.object(schemaShape);

    if (!reservationFormSchema || typeof reservationFormSchema.parse !== "function") {
        throw new Error("Generated schema is invalid.");
    }

	return { 
        reservationFields: fields,
        schema: reservationFormSchema
    };
}
