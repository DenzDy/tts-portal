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
        const { rowIndex, newStatus, fromDashboard = false } = requestBody;

        // Validate parameters more thoroughly
        if (!rowIndex || rowIndex < 2) {
            return json({
                error: 'Invalid row index',
                received: { rowIndex, newStatus },
                success: false
            }, { status: 400 });
        }

        if (!newStatus || (newStatus !== 'Approved' && newStatus !== 'Rejected')) {
            return json({
                error: 'Invalid status - must be "Approved" or "Rejected"',
                received: { rowIndex, newStatus },
                success: false
            }, { status: 400 });
        }

        const sheets = await getSheetsClient();

        // If updating from dashboard, also set cost fields to default values
        if (fromDashboard) {
            // Update status (column A), cost breakdown (column B), and actual total (column E)
            const response = await sheets.spreadsheets.values.batchUpdate({
                spreadsheetId,
                requestBody: {
                    valueInputOption: 'RAW',
                    data: [
                        {
                            range: `'${targetTab}'!A${rowIndex}`,
                            values: [[newStatus]]
                        },
                        {
                            range: `'${targetTab}'!B${rowIndex}`,
                            values: [['']] // Empty cost breakdown for dashboard approvals
                        },
                        {
                            range: `'${targetTab}'!E${rowIndex}`,
                            values: [[0]] // 0 cost for dashboard approvals
                        }
                    ]
                }
            });

            if (response.status === 200) {
                return json({
                    success: true,
                    message: 'Status and cost data updated successfully (dashboard approval)',
                    updatedRanges: [`'${targetTab}'!A${rowIndex}`, `'${targetTab}'!B${rowIndex}`, `'${targetTab}'!E${rowIndex}`],
                    newValues: { status: newStatus, costBreakdown: '', actualTotal: 0 },
                    rowIndex: rowIndex
                });
            } else {
                throw new Error(`Google Sheets API returned status ${response.status}`);
            }
        } else {
            // Only update status (from details page - costs already set separately)
            const range = `'${targetTab}'!A${rowIndex}`;

            const response = await sheets.spreadsheets.values.update({
                spreadsheetId,
                range,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [[newStatus]]
                }
            });

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