import { getReservationSchema } from "$lib/form/reservationSchema.js";
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters'
import { message } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { ResponsesTab } from '$env/static/private';

let fin_schema;
export async function load(event) {
	const { schema, reservationFields } = await getReservationSchema(event.fetch);
    fin_schema = schema;

    // const form = await superValidate(schema);

	return {
        // form,
		reservationFields,
	};
}

function joinLists(elem){
	if(Array.isArray(elem)){
		return elem.join('; ');
	}
	return elem;
}
export const actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(fin_schema));
    	console.log(form);
		let values = Object.values(form.data);
		if (!form.valid) {
		// Return { form } and things will just work.
			return fail(400, { form });
		}
		values = values.map(joinLists);
		// TODO: Do something with the validated form.data
		// Return the form with a status message
		const res = await event.fetch("/api/gsheet", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                values: [["Pending", 0, new Date(), ...values]],
                targetTab: env.RESPONSES_TAB || RESPONSES_TAB
            })
        });

        const result = await res.json();
        console.log(result);
	}
}