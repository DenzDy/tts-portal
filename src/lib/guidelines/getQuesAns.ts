import { env } from '$env/dynamic/private';
import { RESERVATION_GUIDELINES } from '$env/static/private';

export async function getReservationGuidelines(fetch: typeof globalThis.fetch): Promise<string[]> {
    const res = await fetch(`/api/gsheet?tab=${env.RESERVATION_GUIDELINES || RESERVATION_GUIDELINES}`);
    const [header, ...rows]: string[][] = await res.json();
    const filteredRows = rows?.filter(row => row?.[0] !== "");

    const qa = filteredRows.map(row => Object.fromEntries(row.map((cell, i) => [header[i].toLowerCase(), cell])));
    return qa;
}