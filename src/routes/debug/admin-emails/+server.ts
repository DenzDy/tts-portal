import { json } from '@sveltejs/kit';

export async function GET({ fetch }) {
    try {
        const res = await fetch('/api/gsheet?tab=Admin Emails');
        const data = await res.json();

        return json({
            success: true,
            rawData: data,
            processedEmails: data.flat().map((email: string) => email.toLowerCase().trim()).filter(Boolean)
        });
    } catch (error) {
        console.error('Error fetching admin emails:', error);
        return json({
            success: false,
            error: error.message
        });
    }
}