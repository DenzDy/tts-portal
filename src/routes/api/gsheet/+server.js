import { google } from 'googleapis';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { GOOGLE_SERVICE_ACCOUNT, SHEET_ID } from '$env/static/private';

const rawCredentials = env.GOOGLE_SERVICE_ACCOUNT || GOOGLE_SERVICE_ACCOUNT;
const spreadsheetId = env.SHEET_ID || SHEET_ID;

if (!rawCredentials) {
	throw new Error('Missing GOOGLE_SERVICE_ACCOUNT env variable');
}
if (!spreadsheetId) {
	throw new Error('Missing SHEET_ID env variable');
}

async function getSheetsClient() {
	const auth = new google.auth.GoogleAuth({
		credentials: JSON.parse(rawCredentials),
		scopes: ['https://www.googleapis.com/auth/spreadsheets']
	});
	return google.sheets({ version: 'v4', auth });
}

export async function POST({ request }) {
	const { values, targetTab } = await request.json();
	const safeTab = targetTab.replace(/'/g, ''); // remove extra quotes

	const sheets = await getSheetsClient();

	const resp = await sheets.spreadsheets.values.append({
		spreadsheetId,
		range: `'${safeTab}'!A1`,
		valueInputOption: 'RAW',
		requestBody: { values }
	});

	return json({ status: resp.status, statusText: resp.statusText });
}

export async function GET({ url }) {
	const targetTab = url.searchParams.get('tab') || 'Sheet1';
    const safeTab = targetTab.replace(/'/g, ''); // remove extra quotes
	const sheets = await getSheetsClient();

	const res = await sheets.spreadsheets.values.get({
		spreadsheetId,
		range: `'${safeTab}'!A1:Z1000`
	});

	return json(res.data.values || []);
}
