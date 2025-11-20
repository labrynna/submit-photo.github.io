/**
 * Netlify Function: DeepSeek API proxy
 * This function securely handles DeepSeek API requests server-side,
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
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  
  if (!DEEPSEEK_API_KEY) {
    console.error('DEEPSEEK_API_KEY environment variable is not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  try {
    // Parse request body
    const requestBody = JSON.parse(event.body);
    
    // Make request to DeepSeek API
    const deepseekApiUrl = 'https://api.deepseek.com/v1/chat/completions';
    
    const response = await fetch(deepseekApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY.trim()}`
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
    console.error('Error calling DeepSeek API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process DeepSeek API request',
        message: error.message 
      })
    };
  }
};
