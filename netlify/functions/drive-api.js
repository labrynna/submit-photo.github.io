/**
 * Netlify Function: Google Drive API proxy
 * This function uploads photos to Google Drive using Service Account authentication.
 * Saves files directly to the folder specified by GOOGLE_DRIVE_FOLDER_ID environment variable.
 */

const { GoogleAuth } = require('google-auth-library');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get credentials from environment variables
  const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
  const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID; // Optional: Folder ID to upload to
  const GOOGLE_IMPERSONATE_USER_EMAIL = process.env.GOOGLE_IMPERSONATE_USER_EMAIL; // Optional: User email to impersonate for domain-wide delegation
  
  // Check for required environment variables
  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    console.error('Missing required environment variables. Required: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY');
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Server configuration error',
        message: 'Service Account credentials not configured. Please set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY environment variables.'
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

    // Initialize Google Auth with Service Account
    // If GOOGLE_IMPERSONATE_USER_EMAIL is set, use domain-wide delegation to impersonate that user
    const authConfig = {
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle escaped newlines
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
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

    // Use GOOGLE_DRIVE_FOLDER_ID if provided, otherwise use 'root'
    // This allows uploading to a folder shared with the service account
    // Pictures will be saved directly to this folder without creating subfolders
    const parentFolderId = GOOGLE_DRIVE_FOLDER_ID || 'root';

    // Upload the file to the folder
    // Convert base64 to buffer
    const fileBuffer = Buffer.from(fileData, 'base64');
    
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
    
    // Upload file
    // Include supportsAllDrives=true to use owner's storage quota instead of service account quota
    const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true';
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
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
