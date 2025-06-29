export async function load({ fetch }) {
    const res = await fetch("/api/gsheet?tab=Form Fields");
    const values: string[][] = await res.json();
    const filteredValues = values?.filter(row => row?.[0] !== "");
    return { values: filteredValues };
}