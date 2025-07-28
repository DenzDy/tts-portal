import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { loadFormFieldsFromSheet } from '$lib/form/getFields';

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
    // Check if user is authenticated admin
    if (!locals.adminSession) {
        throw error(401, 'Unauthorized');
    }

    const reservationId = params.id;

    try {
        // Fetch form responses from Google Sheets
        const res = await fetch('/api/gsheet?tab=Form Responses');
        const raw = await res.json();


        if (!raw || raw.length <= 1) {
            throw error(404, 'No reservations found');
        }

        const headers = raw[0];
        const dataRows = raw.slice(1);

        // Find the specific reservation by row index
        const rowIndex = parseInt(reservationId);
        if (isNaN(rowIndex) || rowIndex < 2 || rowIndex > dataRows.length + 1) {
            throw error(404, 'Reservation not found');
        }

        // Get the reservation data (rowIndex - 2 because we start from index 2 in sheets)
        const reservationRow = dataRows[rowIndex - 2];

        if (!reservationRow) {
            throw error(404, 'Reservation not found');
        }

        // Create reservation object by mapping headers to values
        const reservationByHeader: Record<string, any> = {};
        headers.forEach((header: string, index: number) => {
            reservationByHeader[header] = reservationRow[index] || '';
        });

        // Get the correct status from column A (index 0) which is "Approved?"
        const actualStatus = reservationRow[0] || 'Pending';

        // Create the fixed reservation object with correct status
        const reservation: Record<string, any> = {
            'status': actualStatus,  // Use the actual status from column A
            'Approved?': actualStatus  // Also set this for consistency
        };

        // Load form fields to understand field structure
        const formFields = await loadFormFieldsFromSheet("Reservation Form", fetch);

        // Enhanced mapping function with better field name matching
        function mapFieldNameToHeader(fieldName: string): string {
            // Primary mapping between form field names and actual sheet headers
            const fieldMapping: Record<string, string> = {
                'lastName': 'last name',
                'firstName': 'first name',
                'middleInitial': 'middle initial',
                'studentNumber': 'student number',
                'email': 'email',
                'contactNumber': 'contact number',
                'activityName': 'activity name',
                'organizer': 'organizer',
                'schedEvent': 'schedule of event',
                'timeSlotStart': 'event time start',
                'timeSlotEnd': 'event time end',
                'briefDescription': 'brief description',
                'objectives': 'objectives',
                'targetAudience': 'target audience',
                'expectedAttendees': 'expected number of attendees',
                'nameLead': 'name of lead/guest',
                'backgroundLead': 'background of lead/guest',
                'nonElectricalEquipment': 'non-electrical equipment to bring in',
                'electricalEquipment': 'electrical equipment to bring in',
                'equipmentRent': 'equipment to rent',
                'equipmentRentOthers': 'other equipment to rent',
                'programFlow': 'program flow',
                'setupTeam': 'set-up team',
                'signedAAF': 'signed AAF GDrive Link',
            };

            return fieldMapping[fieldName] || fieldName;
        }

        // Map all form fields to their values
        formFields.forEach(field => {
            const expectedHeader = mapFieldNameToHeader(field.Name);

            // Try exact match first
            let fieldValue = reservationByHeader[expectedHeader];

            // If exact match fails, try case-insensitive search
            if (fieldValue === undefined || fieldValue === '') {
                const caseInsensitiveMatch = Object.keys(reservationByHeader).find(
                    header => header.toLowerCase() === expectedHeader.toLowerCase()
                );
                if (caseInsensitiveMatch) {
                    fieldValue = reservationByHeader[caseInsensitiveMatch];
                }
            }

            // If still no match, try partial matching for common variations
            if (fieldValue === undefined || fieldValue === '') {
                const partialMatch = Object.keys(reservationByHeader).find(header => {
                    const headerLower = header.toLowerCase();
                    const expectedLower = expectedHeader.toLowerCase();
                    return headerLower.includes(expectedLower) || expectedLower.includes(headerLower);
                });
                if (partialMatch) {
                    fieldValue = reservationByHeader[partialMatch];
                }
            }

            reservation[field.Name] = fieldValue || '';
        });

        // EXPLICITLY MAP THE COST FIELDS
        // Find Cost Breakdown column (should be column B, index 1)
        const costBreakdownIndex = headers.findIndex(h => h && h.toLowerCase().includes('cost breakdown'));
        if (costBreakdownIndex !== -1) {
            reservation['Cost Breakdown'] = reservationRow[costBreakdownIndex] || '';
        }

        // Find Actual Total column (should be column E, index 4) 
        const actualTotalIndex = headers.findIndex(h => h && h.toLowerCase().includes('actual total'));
        if (actualTotalIndex !== -1) {
            reservation['Actual Total'] = reservationRow[actualTotalIndex] || '';
        }

        // Special handling for the extended columns
        for (let i = 26; i < headers.length; i++) {
            const header = headers[i];
            const value = reservationRow[i];

            if (header && header.toLowerCase().includes('program flow')) {
                reservation['programFlow'] = value || '';
            }
            if (header && header.toLowerCase().includes('set-up team')) {
                reservation['setupTeam'] = value || '';
            }
            if (header && header.toLowerCase().includes('signed aaf')) {
                reservation['signedAAF'] = value || '';
            }
        }

        return {
            reservation,
            formFields,
            adminSession: locals.adminSession,
            reservationId
        };

    } catch (err) {
        console.error('Error loading reservation:', err);
        if (err instanceof Response && err.status >= 300 && err.status < 400) {
            throw err;
        }
        throw error(500, 'Failed to load reservation details');
    }
};