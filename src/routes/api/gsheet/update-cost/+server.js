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
		console.log('Raw cost update request body:', requestBody);

		const { rowIndex, costBreakdown, actualTotal } = requestBody;
		console.log('Extracted values:', { rowIndex, costBreakdown, actualTotal });

		// Validate parameters
		if (!rowIndex || rowIndex < 2) {
			console.log('Invalid rowIndex - must be >= 2, received:', rowIndex);
			return json({ 
				error: 'Invalid row index', 
				received: { rowIndex, costBreakdown, actualTotal },
				success: false 
			}, { status: 400 });
		}

		if (costBreakdown === undefined || actualTotal === undefined) {
			console.log('Missing cost data, received:', { costBreakdown, actualTotal });
			return json({ 
				error: 'Missing cost breakdown or actual total', 
				received: { rowIndex, costBreakdown, actualTotal },
				success: false 
			}, { status: 400 });
		}

		const sheets = await getSheetsClient();

		// Column B is "Cost Breakdown" (index 1)
		// Column E is "Actual Total" (index 4)  
		const costBreakdownRange = `'${targetTab}'!B${rowIndex}`;
		const actualTotalRange = `'${targetTab}'!E${rowIndex}`;

		console.log('Updating ranges:', { costBreakdownRange, actualTotalRange });
		console.log('With values:', { costBreakdown, actualTotal });

		// Update both columns in batch
		const response = await sheets.spreadsheets.values.batchUpdate({
			spreadsheetId,
			requestBody: {
				valueInputOption: 'RAW',
				data: [
					{
						range: costBreakdownRange,
						values: [[costBreakdown || '']]
					},
					{
						range: actualTotalRange,
						values: [[actualTotal || 0]]
					}
				]
			}
		});

		console.log('Google Sheets API batch response status:', response.status);
		console.log('Google Sheets API batch response data:', response.data);

		if (response.status === 200) {
			return json({ 
				success: true, 
				message: 'Cost data updated successfully',
				updatedRanges: [costBreakdownRange, actualTotalRange],
				newValues: { costBreakdown, actualTotal },
				rowIndex: rowIndex
			});
		} else {
			throw new Error(`Google Sheets API returned status ${response.status}`);
		}

	} catch (error) {
		console.error('Error in update-cost API:', error);
		return json({ 
			error: error.message || 'Failed to update cost data',
			success: false,
			stack: error.stack
		}, { status: 500 });
	}
}