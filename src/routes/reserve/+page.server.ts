import { getReservationGuidelines } from '$lib/guidelines/getQuesAns';

export async function load(event) {
    const guidelines = await getReservationGuidelines(event.fetch);

    return {
        guidelines
    };
}