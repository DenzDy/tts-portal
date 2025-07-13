import { getReservationSchema } from "$lib/form/reservationSchema.js";
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters'
import { message } from 'sveltekit-superforms';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { RESPONSES_TAB, CALENDAR_ID, GOOGLE_SERVICE_ACCOUNT, CALENDAR_LINK } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { google } from 'googleapis';

export async function load(event) {
	const { schema, reservationFields } = await getReservationSchema(event.fetch);

    const form = await superValidate(zod(schema));
    
	return {
        form,
		reservationFields,
        calendarSource: env.CALENDAR_LINK || CALENDAR_LINK
	};
}

function joinLists(elem){
	if(Array.isArray(elem)){
		return elem.join('; ');
	}
	return elem;
}

function convertToRFC3339WithTime(dateStr, timeStr, offset = '+08:00') {
    // Parse date part
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date string");
    }

    // Extract the YYYY-MM-DD
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');

    // Normalize and extract time components (e.g., "8:00 AM", "5:00PM", etc.)
    const timeMatch = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!timeMatch) {
        throw new Error("Invalid time format. Use the format of '8:00 AM' or '5:00PM'.");
    }

    let [_, hourStr, minuteStr, meridian] = timeMatch;
    let hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);


    if (meridian.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (meridian.toUpperCase() === 'AM' && hours === 12) hours = 0;


    const hh = String(hours).padStart(2, '0');
    const min = String(minutes).padStart(2, '0');
    // Construct RFC3339 string
    return `${yyyy}-${mm}-${dd}T${hh}:${min}:00${offset}`;
}

export const actions = {
	default: async (event) => {
        const { schema } = await getReservationSchema(event.fetch);
		let form = await superValidate(event.request, zod(schema));
        
		if (!form?.valid) {
			return fail(400, { form });
		}

        const calendarId = env.CALENDAR_ID || CALENDAR_ID;
        
        let values = Object.values(form.data);
		values = values.map(joinLists);

        const serviceAccount = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT || GOOGLE_SERVICE_ACCOUNT);
        const auth = new google.auth.GoogleAuth({
            credentials: serviceAccount, // your key file
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });


        const calendar = google.calendar({ version: 'v3', auth });
        const calendar_item = {
            summary: `[PENDING] ${form?.data?.activityName ?? ""}`,
            location: 'The Third Space',
            description: form?.data?.briefDescription,
            start: {
                dateTime: convertToRFC3339WithTime(String(form?.data?.schedEvent), form?.data?.timeSlotStart, '+08:00'),
                timeZone: 'Asia/Manila',
            },
            end: {
                dateTime: convertToRFC3339WithTime(String(form?.data?.schedEvent), form?.data?.timeSlotEnd, '+08:00'),
                timeZone: 'Asia/Manila',
            }
        };
        // Post Calendar Event to GCal
        const { start, end } = calendar_item;

        try {
            // Check for conflicts
            const freeBusyRes = await calendar.freebusy.query({
                requestBody: {
                    timeMin: start.dateTime,
                    timeMax: end.dateTime,
                    timeZone: start.timeZone,
                    items: [{ id: calendarId }],
                },
            });

            const busySlots = freeBusyRes.data.calendars?.[calendarId]?.busy || [];

            if (busySlots.length > 0) {
                let timeSlotEndErrors = form?.errors?.timeSlotEnd ?? [];
                timeSlotEndErrors.push('time slot conflict detected');
                form.errors.timeSlotEnd = timeSlotEndErrors;
                return fail(400, { form });
            }

            // Add event if no conflict
            const insertRes = await calendar.events.insert({
                calendarId,
                requestBody: calendar_item,
            });

        } catch (err) {
            let timeSlotEndErrors = form?.errors?.timeSlotEnd ?? [];
            timeSlotEndErrors.push("failed to check or insert event");
            form.errors.timeSlotEnd = timeSlotEndErrors;
            return fail(400, { form });
        }

        
        const res = await event.fetch("/api/gsheet", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                values: [["Pending", "", "", -1, new Date(), ...values]],
                targetTab: env.RESPONSES_TAB || RESPONSES_TAB
            })
        });

        const result = await res.json();

        if ((result?.status === 200) && (result?.statusText === "OK")) {
            throw redirect(303, "/reserve?toast=Successfully+submitted+form!&type=success");
        }
	}
}