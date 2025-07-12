import { getReservationSchema } from "$lib/form/reservationSchema.js";
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters'
import { message } from 'sveltekit-superforms';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { ResponsesTab } from '$env/static/private';

export async function load(event) {
	const { schema, reservationFields } = await getReservationSchema(event.fetch);

    const form = await superValidate(zod(schema));
    
	return {
        form,
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
        const { schema } = await getReservationSchema(event.fetch);
		const form = await superValidate(event.request, zod(schema));
        
		if (!form.valid) {
			return fail(400, { form });
		}

        let values = Object.values(form.data);
		values = values.map(joinLists);
        
		// Return the form with a status message
		const res = await event.fetch("/api/gsheet", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                values: [["Pending", -1, new Date(), ...values]],
                targetTab: env.RESPONSES_TAB || RESPONSES_TAB
            })
        });

        const result = await res.json();

        if ((result.status === 200) && (result.statusText === "OK")) {
            throw redirect(303, "/reserve?toast=Successfully+submitted+form!&type=success");
        }
	}
}