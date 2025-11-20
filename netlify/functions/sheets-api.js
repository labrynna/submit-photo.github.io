/**
 * Netlify Function: Google Sheets API proxy
 * This function securely handles Google Sheets API requests server-side,
 * keeping the API key secure and not exposed to clients.
 */

exports.handler = async (event, context) => {
  // Only allow GET and POST requests
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get API credentials from environment variables
  const SHEETS_API_KEY = process.env.SHEETS_API_KEY;
  const SHEET_ID = process.env.SHEET_ID;
  const SHEET_NAME = process.env.SHEET_NAME || 'Sites';
  
  if (!SHEETS_API_KEY || !SHEET_ID) {
    console.error('SHEETS_API_KEY or SHEET_ID environment variable is not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  try {
    const sheetsBaseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    
    // Parse query parameters to determine the action
    const queryParams = event.queryStringParameters || {};
    const action = queryParams.action; // 'read', 'append', or 'update'
    const range = queryParams.range || SHEET_NAME;
    
    let url;
    let fetchOptions = {
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (action === 'read' || event.httpMethod === 'GET') {
      // Read data from sheet
      url = `${sheetsBaseUrl}/${SHEET_ID.trim()}/values/${range}?key=${SHEETS_API_KEY.trim()}`;
      fetchOptions.method = 'GET';
      
    } else if (action === 'append') {
      // Append data to sheet
      const requestBody = JSON.parse(event.body);
      url = `${sheetsBaseUrl}/${SHEET_ID.trim()}/values/${range}:append?valueInputOption=USER_ENTERED&key=${SHEETS_API_KEY.trim()}`;
      fetchOptions.method = 'POST';
      fetchOptions.body = JSON.stringify(requestBody);
      
    } else if (action === 'update') {
      // Update specific row in sheet
      const requestBody = JSON.parse(event.body);
      const updateRange = queryParams.updateRange || range;
      url = `${sheetsBaseUrl}/${SHEET_ID.trim()}/values/${updateRange}?valueInputOption=USER_ENTERED&key=${SHEETS_API_KEY.trim()}`;
      fetchOptions.method = 'PUT';
      fetchOptions.body = JSON.stringify(requestBody);
      
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid action parameter. Use: read, append, or update' })
      };
    }

    // Make request to Google Sheets API
    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    // Return response
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error calling Sheets API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process Sheets API request',
        message: error.message 
      })
    };
  }
};
