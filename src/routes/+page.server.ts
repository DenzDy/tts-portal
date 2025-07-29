import { getEventData } from '$lib/landing-page/getEventData';
import { getLandingPageData } from '$lib/landing-page/getLandingPageData';
export async function load(event){
    const eventData = await getEventData(event.fetch);
    const landingPageData = await getLandingPageData(event.fetch);
    return {eventData, landingPageData};
}