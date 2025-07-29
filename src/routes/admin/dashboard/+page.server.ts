import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, locals }) => {
    try {
        const res = await fetch('/api/gsheet?tab=Form Responses');
        const raw = await res.json();


        if (!raw || raw.length <= 1) {
            return { reservations: [], adminSession: locals.adminSession };
        }

        const headers = raw[0];
        const dataRows = raw.slice(1);

        // Manually build reservations array
        const reservations = [];

        for (let i = 0; i < dataRows.length; i++) {
            const row = dataRows[i];

            // Skip if no row data
            if (!row || row.length === 0) continue;

            // Get the activity name from column 12 (index 12)
            const activity = row[12];

            // Skip if no activity
            if (!activity || activity.trim() === '') continue;

            // Calculate the actual row number in the sheet
            const sheetRowNumber = i + 2; // +2 because sheet starts at 1 and we skip header

            // Create reservation object
            const reservation = {
                rowIndex: sheetRowNumber,
                activity: activity.toString().trim(),
                status: (row[0] || 'Pending').toString().trim(),
                date: (row[14] || 'N/A').toString().trim()
            };

            reservations.push(reservation);
        }

        return {
            reservations,
            adminSession: locals.adminSession
        };

    } catch (error) {
        console.error('Load error:', error);
        return {
            reservations: [],
            adminSession: locals.adminSession
        };
    }
};