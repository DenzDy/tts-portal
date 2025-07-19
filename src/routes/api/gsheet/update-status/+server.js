import { google } from 'googleapis';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { GOOGLE_SERVICE_ACCOUNT, SHEET_ID, RESPONSES_TAB } from '$env/static/private';

const rawCredentials = env.GOOGLE_SERVICE_ACCOUNT || GOOGLE_SERVICE_ACCOUNT;
const spreadsheetId = env.SHEET_ID || SHEET_ID;
const targetTab = env.RESPONSES_TAB || RESPONSES_TAB;

async function getSheetsClient() {
	const auth = new google.auth.GoogleAuth({
		credentials: JSON.parse(rawCredentials),
		scopes: ['https://www.googleapis.com/auth/spreadsheets']
	});
	return google.sheets({ version: 'v4', auth });
}

export async function PATCH({ request }) {
	const { row, newStatus } = await request.json();

	if (!row || !newStatus) {
		return json({ error: 'Missing parameters' }, { status: 400 });
	}

	const sheets = await getSheetsClient();

	// Column A is "Approved?", column index = 0 → column letter = A
	const range = `'${targetTab}'!A${row}`;

	await sheets.spreadsheets.values.update({
		spreadsheetId,
		range,
		valueInputOption: 'RAW',
		requestBody: {
			values: [[newStatus]]
		}
	});

	return json({ success: true });
}
