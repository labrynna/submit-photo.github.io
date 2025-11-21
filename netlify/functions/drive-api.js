/**
 * Netlify Function: Google Drive API proxy
 * This function uploads photos to Google Drive using Service Account authentication.
 * Saves files to the "Automation/Site Pictures" folder.
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
    const auth = new GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle escaped newlines
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    // Get access token
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    
    if (!accessToken.token) {
      throw new Error('Failed to obtain access token from Service Account');
    }

    // Step 1: Find or create the "Automation/Site Pictures" folder
    const folderPath = ['Automation', 'Site Pictures'];
    // Use GOOGLE_DRIVE_FOLDER_ID if provided, otherwise use 'root'
    // This allows uploading to a folder shared with the service account
    let parentFolderId = GOOGLE_DRIVE_FOLDER_ID || 'root';
    
    for (const folderName of folderPath) {
      // Search for the folder
      // Include supportsAllDrives=true to work with shared drives and use owner's storage quota
      // Properly escape folder name and parent ID to prevent query injection
      // First escape backslashes, then escape single quotes
      const escapedFolderName = folderName.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      const escapedParentId = parentFolderId.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${escapedFolderName}' and '${escapedParentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false&supportsAllDrives=true&includeItemsFromAllDrives=true`;
      
      const searchResponse = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken.token}`,
        }
      });
      
      if (!searchResponse.ok) {
        throw new Error(`Failed to search for folder: ${searchResponse.statusText}`);
      }
      
      const searchData = await searchResponse.json();
      
      if (searchData.files && searchData.files.length > 0) {
        // Folder exists, use it
        parentFolderId = searchData.files[0].id;
      } else {
        // Folder doesn't exist, create it
        // Include supportsAllDrives=true to use owner's storage quota instead of service account quota
        const createFolderResponse = await fetch('https://www.googleapis.com/drive/v3/files?supportsAllDrives=true', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentFolderId]
          })
        });
        
        if (!createFolderResponse.ok) {
          throw new Error(`Failed to create folder: ${createFolderResponse.statusText}`);
        }
        
        const folderData = await createFolderResponse.json();
        parentFolderId = folderData.id;
      }
    }

    // Step 2: Upload the file to the folder
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
