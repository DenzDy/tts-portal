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
	try {
		const requestBody = await request.json();
		console.log('Raw request body:', requestBody);

		const { rowIndex, newStatus } = requestBody;
		console.log('Extracted values:', { rowIndex, newStatus });

		// Validate parameters more thoroughly
		if (!rowIndex || rowIndex < 2) {
			console.log('Invalid rowIndex - must be >= 2, received:', rowIndex);
			return json({ 
				error: 'Invalid row index', 
				received: { rowIndex, newStatus },
				success: false 
			}, { status: 400 });
		}

		if (!newStatus || (newStatus !== 'Approved' && newStatus !== 'Rejected')) {
			console.log('Invalid newStatus - must be "Approved" or "Rejected", received:', newStatus);
			return json({ 
				error: 'Invalid status - must be "Approved" or "Rejected"', 
				received: { rowIndex, newStatus },
				success: false 
			}, { status: 400 });
		}

		const sheets = await getSheetsClient();

		// Column A is "Approved?" (index 0)
		const range = `'${targetTab}'!A${rowIndex}`;
		console.log('Updating range:', range, 'with value:', newStatus);

		const response = await sheets.spreadsheets.values.update({
			spreadsheetId,
			range,
			valueInputOption: 'RAW',
			requestBody: {
				values: [[newStatus]]
			}
		});

		console.log('Google Sheets API response status:', response.status);
		console.log('Google Sheets API response data:', response.data);

		if (response.status === 200) {
			return json({ 
				success: true, 
				message: 'Status updated successfully',
				updatedRange: range,
				newValue: newStatus,
				rowIndex: rowIndex
			});
		} else {
			throw new Error(`Google Sheets API returned status ${response.status}`);
		}

	} catch (error) {
		console.error('Error in update-status API:', error);
		return json({ 
			error: error.message || 'Failed to update status',
			success: false,
			stack: error.stack
		}, { status: 500 });
	}
}