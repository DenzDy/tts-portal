import { env } from '$env/dynamic/private';
import { EVENT_DATA } from '$env/static/private';
import type { Event } from "./eventType.ts";

export async function getEventData(fetch: typeof globalThis.fetch): Promise<Event[]> {
    const res = await fetch(`/api/gsheet?tab=${env.EVENT_DATA || EVENT_DATA}`);
    const [header, ...rows]: string[][] = await res.json();
    const filteredRows = rows?.filter(row => row?.[0] !== "");
    const qa = filteredRows.map(row => Object.fromEntries(row.map((cell, i) => [header[i].toLowerCase(), cell])));
    return qa;
}