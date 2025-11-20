/**
 * Netlify Function: Google Cloud Vision API proxy
 * This function securely handles Vision API requests server-side,
 * keeping the API key secure and not exposed to clients.
 */

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get API key from environment variable
  const VISION_API_KEY = process.env.VISION_API_KEY;
  
  if (!VISION_API_KEY) {
    console.error('VISION_API_KEY environment variable is not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  try {
    // Parse request body
    const requestBody = JSON.parse(event.body);
    
    // Make request to Google Cloud Vision API
    const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY.trim()}`;
    
    const response = await fetch(visionApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

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
    console.error('Error calling Vision API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process Vision API request',
        message: error.message 
      })
    };
  }
};
