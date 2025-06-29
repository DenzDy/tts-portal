import { env } from '$env/dynamic/private';
import { FORM_FIELDS_TAB, RESPONSES_TAB } from '$env/static/private';

export async function load({ fetch }) {
    const fieldsTab = env.FORM_FIELDS_TAB || FORM_FIELDS_TAB
    const res = await fetch(`/api/gsheet?tab=${fieldsTab}`);
    const values: string[][] = await res.json();
    const filteredValues = values?.filter(row => row?.[0] !== "");
    return {
        values: filteredValues,
        responsesTab: env.RESPONSES_TAB || RESPONSES_TAB
    };
}
