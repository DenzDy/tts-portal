import { json } from '@sveltejs/kit';

export async function GET({ fetch }) {
  try {
    console.log('Testing sheets data endpoint...');
    
    const res = await fetch('/api/gsheet?tab=Form Responses');
    const data = await res.json();
    
    console.log('Raw sheets data:', data);
    
    if (!data || data.length <= 1) {
      return json({
        success: false,
        error: 'No data found or only headers present',
        data
      });
    }

    const headers = data[0];
    const rows = data.slice(1);

    // Find important columns
    const statusIndex = 0; // "Approved?" column
    const activityIndex = headers.findIndex(h => 
      h && (h.toLowerCase().includes('activity') && h.toLowerCase().includes('name'))
    );
    const dateIndex = headers.findIndex(h => 
      h && (h.toLowerCase().includes('schedule') || h.toLowerCase().includes('event'))
    );

    const analysis = {
      totalRows: rows.length,
      headers: headers.map((h, i) => ({ index: i, name: h })),
      columnIndices: {
        status: statusIndex,
        activity: activityIndex,
        date: dateIndex
      },
      sampleRows: rows.slice(0, 5).map((row, idx) => ({
        rowNumber: idx + 2,
        status: row[statusIndex],
        activity: row[activityIndex],
        date: row[dateIndex],
        fullRow: row
      }))
    };
    
    return json({
      success: true,
      analysis,
      rawData: data
    });
  } catch (error) {
    console.error('Error fetching sheets data:', error);
    return json({
      success: false,
      error: error.message
    });
  }
}