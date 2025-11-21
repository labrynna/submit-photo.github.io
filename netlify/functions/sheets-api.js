/**
 * Netlify Function: Google Sheets API proxy
 * This function securely handles Google Sheets API requests server-side,
 * using Service Account authentication for secure access.
 */

const { GoogleAuth } = require('google-auth-library');

exports.handler = async (event, context) => {
  // Only allow GET and POST requests
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get credentials from environment variables
  const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
  const GOOGLE_IMPERSONATE_USER_EMAIL = process.env.GOOGLE_IMPERSONATE_USER_EMAIL; // Optional: User email to impersonate for domain-wide delegation
  const SHEET_ID = process.env.SHEET_ID;
  const SHEET_NAME = process.env.SHEET_NAME || 'Sites';
  
  // Check for required environment variables
  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !SHEET_ID) {
    console.error('Missing required environment variables. Required: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, SHEET_ID');
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Server configuration error',
        message: 'Service Account credentials not configured. Please set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY environment variables.'
      })
    };
  }

  try {
    // Initialize Google Auth with Service Account
    // If GOOGLE_IMPERSONATE_USER_EMAIL is set, use domain-wide delegation to impersonate that user
    const authConfig = {
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle escaped newlines
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ],
    };
    
    // Add subject for domain-wide delegation if impersonation is configured
    if (GOOGLE_IMPERSONATE_USER_EMAIL) {
      authConfig.clientOptions = {
        subject: GOOGLE_IMPERSONATE_USER_EMAIL
      };
      console.log(`Using domain-wide delegation to impersonate: ${GOOGLE_IMPERSONATE_USER_EMAIL}`);
    }
    
    const auth = new GoogleAuth(authConfig);

    // Get access token
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    
    if (!accessToken.token) {
      throw new Error('Failed to obtain access token from Service Account');
    }

    const sheetsBaseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    
    // Parse query parameters to determine the action
    const queryParams = event.queryStringParameters || {};
    const action = queryParams.action; // 'read', 'append', or 'update'
    const range = queryParams.range || SHEET_NAME;
    
    let url;
    let fetchOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.token}`,
      }
    };

    if (action === 'read' || event.httpMethod === 'GET') {
      // Read data from sheet
      url = `${sheetsBaseUrl}/${SHEET_ID.trim()}/values/${range}`;
      fetchOptions.method = 'GET';
      
    } else if (action === 'append') {
      // Append data to sheet
      const requestBody = JSON.parse(event.body);
      url = `${sheetsBaseUrl}/${SHEET_ID.trim()}/values/${range}:append?valueInputOption=USER_ENTERED`;
      fetchOptions.method = 'POST';
      fetchOptions.body = JSON.stringify(requestBody);
      
    } else if (action === 'update') {
      // Update specific row in sheet
      const requestBody = JSON.parse(event.body);
      const updateRange = queryParams.updateRange || range;
      url = `${sheetsBaseUrl}/${SHEET_ID.trim()}/values/${updateRange}?valueInputOption=USER_ENTERED`;
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
