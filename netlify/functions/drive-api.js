/**
 * Netlify Function: Google Drive API proxy
 * This function uploads photos to Google Drive using OAuth 2.0 authentication.
 * Uses a refresh token stored in Netlify environment variables to obtain access tokens.
 * Saves files directly to the folder specified by GOOGLE_DRIVE_FOLDER_ID environment variable.
 */

const { OAuth2Client } = require('google-auth-library');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get OAuth credentials from environment variables
  const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const GOOGLE_OAUTH_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const GOOGLE_OAUTH_REFRESH_TOKEN = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID; // Optional: Folder ID to upload to
  
  // Check for required environment variables
  if (!GOOGLE_OAUTH_CLIENT_ID || !GOOGLE_OAUTH_CLIENT_SECRET || !GOOGLE_OAUTH_REFRESH_TOKEN) {
    console.error('Missing required environment variables. Required: GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN');
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Server configuration error',
        message: 'OAuth credentials not configured. Please set GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, and GOOGLE_OAUTH_REFRESH_TOKEN environment variables. See OAUTH_SETUP_GUIDE.md for instructions.'
      })
    };
  }

  try {
    // Parse request body
    const requestBody = JSON.parse(event.body);
    const { fileName, fileData, mimeType } = requestBody;
    
    if (!fileName || !fileData || !mimeType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: fileName, fileData, mimeType' })
      };
    }

    // Initialize OAuth2 client
    const oauth2Client = new OAuth2Client(
      GOOGLE_OAUTH_CLIENT_ID,
      GOOGLE_OAUTH_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground' // Redirect URI (not used for refresh token flow)
    );

    // Set the refresh token
    oauth2Client.setCredentials({
      refresh_token: GOOGLE_OAUTH_REFRESH_TOKEN
    });

    // Get a fresh access token (automatically handles refresh)
    const { token: accessToken } = await oauth2Client.getAccessToken();
    
    if (!accessToken) {
      throw new Error('Failed to obtain access token from refresh token. Your refresh token may be invalid or expired.');
    }

    // Use GOOGLE_DRIVE_FOLDER_ID if provided, otherwise use 'root'
    // This uploads to your personal Google Drive
    const parentFolderId = GOOGLE_DRIVE_FOLDER_ID || 'root';

    // Upload the file to the folder
    // Create metadata
    const metadata = {
      name: fileName,
      parents: [parentFolderId]
    };
    
    // Create multipart request body
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";
    
    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: ' + mimeType + '\r\n' +
      'Content-Transfer-Encoding: base64\r\n\r\n' +
      fileData +
      close_delim;
    
    // Upload file to Google Drive
    const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'multipart/related; boundary=' + boundary,
      },
      body: multipartRequestBody
    });
    
    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(`Failed to upload file: ${errorData.error?.message || uploadResponse.statusText}`);
    }
    
    const uploadData = await uploadResponse.json();
    
    // Return response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        fileId: uploadData.id,
        fileName: uploadData.name,
        webViewLink: uploadData.webViewLink
      })
    };
    
  } catch (error) {
    console.error('Error uploading to Drive:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to upload file to Google Drive',
        message: error.message 
      })
    };
  }
};
