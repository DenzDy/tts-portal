// src/routes/admin/reservation/[id]/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { loadFormFieldsFromSheet } from '$lib/form/getFields';

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
  console.log('=== VIEW RESERVATION LOAD START ===');
  
  // Check if user is authenticated admin
  if (!locals.adminSession) {
    throw error(401, 'Unauthorized');
  }
  
  const reservationId = params.id;
  console.log('Reservation ID:', reservationId);
  
  try {
    // Fetch form responses from Google Sheets
    const res = await fetch('/api/gsheet?tab=Form Responses');
    const raw = await res.json();
    
    console.log('Raw data length:', raw?.length);
    
    if (!raw || raw.length <= 1) {
      console.log('No data or only headers');
      throw error(404, 'No reservations found');
    }

    const headers = raw[0];
    const dataRows = raw.slice(1);
    
    console.log('Headers:', headers);
    console.log('Headers count:', headers.length);
    console.log('Data rows count:', dataRows.length);

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
    
    // FIXED: Get the correct status from column A (index 0) which is "Approved?"
    const actualStatus = reservationRow[0] || 'Pending';
    console.log('Raw status from column A:', actualStatus);
    
    // Create the fixed reservation object with correct status
    const reservation: Record<string, any> = {
      'status': actualStatus,  // Use the actual status from column A
      'Approved?': actualStatus  // Also set this for consistency
    };
    
    console.log('Found reservation by header:', reservationByHeader);
    console.log('Available headers:', Object.keys(reservationByHeader));
    
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
          console.log(`Used partial match for ${field.Name}: "${expectedHeader}" -> "${partialMatch}"`);
        }
      }
      
      reservation[field.Name] = fieldValue || '';
    });
    
    // Special handling for the extended columns
    console.log('\n=== EXTENDED COLUMNS CHECK ===');
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
    
    console.log('Final reservation status:', reservation.status);
    console.log('Final mapped reservation:', reservation);
    
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