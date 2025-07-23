import { getReservationGuidelines } from '$lib/guidelines/getQuesAns';

export async function load({ url, fetch }) {
    const toastMessage = url.searchParams.get('toast');
    const toastType = url.searchParams.get('type') || 'success';

    const guidelines = await getReservationGuidelines(fetch);

    return {
        toast: toastMessage ? { message: toastMessage, type: toastType } : null,
        guidelines
    };
}