import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, locals }) => {
  // Get reservations data
  const res = await fetch('/api/gsheet?tab=Form Responses');
  const raw = await res.json();

  let reservations = [];
  if (raw && raw.length > 1) {
    const headers = raw[0];
    const rows = raw.slice(1); // Skip header row

    console.log('Headers:', headers);
    console.log('Total rows (excluding header):', rows.length);

    // Find column indices more robustly
    const statusIndex = 0; // "Approved?" is always column A (index 0)
    
    // Look for activity name column
    const activityIndex = headers.findIndex(h => 
      h && (h.toLowerCase().includes('activity') || h.toLowerCase().includes('name'))
    );
    
    // Look for date/schedule column  
    const dateIndex = headers.findIndex(h => 
      h && (h.toLowerCase().includes('schedule') || 
            h.toLowerCase().includes('date') || 
            h.toLowerCase().includes('event'))
    );

    console.log('Column indices found:', { 
      statusIndex, 
      activityIndex, 
      dateIndex,
      statusColumn: headers[statusIndex],
      activityColumn: headers[activityIndex], 
      dateColumn: headers[dateIndex] 
    });

    reservations = rows.map((row, idx) => {
      const reservation = {
        rowIndex: idx + 2, // +2 because: sheet is 1-indexed + skip header row
        date: row[dateIndex] || 'N/A',
        activity: row[activityIndex] || 'N/A', 
        status: (row[statusIndex] || 'Pending').trim()
      };
      
      console.log(`Row ${idx + 2}:`, reservation);
      return reservation;
    }).filter(r => r.activity !== 'N/A' && r.activity !== '' && r.activity); // Filter out empty rows

    console.log('Final processed reservations:', reservations.length);
    reservations.forEach(r => console.log('Reservation:', r));
  }

  return { 
    reservations,
    adminSession: locals.adminSession 
  };
};