import { getReservationSchema } from "$lib/form/reservationSchema.js";
// import { superValidate } from "sveltekit-superforms/server";

export async function load(event) {
	const { schema, reservationFields } = await getReservationSchema(event.fetch);
    
    // const form = await superValidate(schema);

	return {
        // form,
		reservationFields,
	};
}