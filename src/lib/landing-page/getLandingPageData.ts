import { env } from '$env/dynamic/private';
import { LANDING_PAGE } from '$env/static/private';
import type { LandingPage } from "./landingPageType.ts";

type Entry = [string, string];

const labelKeyMap: Record<string, keyof landingPage> = {
  'Hero Paragraph': 'heroPg',
  'About Us Header': 'aboutHeader',
  'About Us Paragraph': 'aboutPg',
  'Zones Header': 'zonesHeader',
  'Recent Events Header': 'eventsHeader',
  'Contact Us Header': 'contactHeader'
};

function createLandingPageObject(entries: Entry[]): landingPage {
  const obj = {} as landingPage;

  for (const [label, value] of entries) {
    const key = labelKeyMap[label];
    if (key) obj[key] = value;
    else console.warn(`Unknown label "${label}" — skipping`);
  }

  return obj;
}

export async function getLandingPageData(fetch: typeof globalThis.fetch): Promise<LandingPage[]> {
    const res = await fetch(`/api/gsheet?tab=${env.LANDING_PAGE || LANDING_PAGE}`);
    const [header, ...rows]: string[][] = await res.json();
    const filteredRows = rows?.filter(row => row?.[0] !== "");
    return createLandingPageObject(filteredRows);
}





