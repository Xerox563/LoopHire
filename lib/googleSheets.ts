import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

export async function getGoogleSheetsData() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!spreadsheetId || !clientEmail || !privateKey) {
    console.warn('Google Sheets credentials missing. Background sync will not work.');
    return [];
  }

  try {
    const auth = new google.auth.JWT(
      clientEmail,
      undefined,
      privateKey,
      SCOPES
    );

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:E', // Adjust range as needed: URL, Company, Role, Pitch
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    // Assuming row 0 is header: [Apply Link, Company, Role, Pitch]
    const header = rows[0].map(h => String(h).toLowerCase());
    const linkIdx = header.findIndex(h => h.includes('link') || h.includes('url'));
    const companyIdx = header.findIndex(h => h.includes('company'));
    const roleIdx = header.findIndex(h => h.includes('role'));
    const pitchIdx = header.findIndex(h => h.includes('pitch') || h.includes('outreach'));

    return rows.slice(1).map((row, index) => ({
      url: row[linkIdx] || '',
      company: row[companyIdx] || 'Imported',
      role: row[roleIdx] || 'Job',
      outreachMessage: row[pitchIdx] || '',
      rowIndex: index + 2, // 1-based index for the actual sheet row
    })).filter(j => j.url && j.url.startsWith('http'));
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return [];
  }
}
