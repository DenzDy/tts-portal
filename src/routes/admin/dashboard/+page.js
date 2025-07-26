/**
 * Fetch reservation data for the admin dashboard.
 */
export async function load({ fetch }) {
  const res = await fetch('/api/gsheet?tab=Form Responses');
  const raw = await res.json();

  if (!raw || raw.length <= 1) return { reservations: [] };

  const headers = raw[0];
  const rows = raw.slice(1);

  const index = {
    schedEvent: headers.indexOf('schedule of event'),
    activityName: headers.indexOf('activity name'),
    status: headers.indexOf('Approved?')
  };

  const reservations = rows.map(row => ({
    date: row[index.schedEvent] || 'N/A',
    activity: row[index.activityName] || 'N/A',
    status: (row[index.status] || 'Pending').trim()
  }));

  return { reservations };
}
