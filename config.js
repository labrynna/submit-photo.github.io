// Configuration file for API keys and settings
// IMPORTANT: For production use, never commit API keys to the repository.
// Use environment variables or a secure configuration service.

const CONFIG = {
    // Google Cloud Vision API Key
    // Get your API key from: https://console.cloud.google.com/apis/credentials
    VISION_API_KEY: 'AIzaSyDkfiUXQR35cedbzOrGGaIsVanB5sFLnIM',
    
    // DeepSeek API Key
    // Get your API key from: https://platform.deepseek.com/
    DEEPSEEK_API_KEY: 'sk-c11fbd1df9dd4b52ba1eefbf64619773',
    
    // Google Sheets API Configuration
    // Get your API key from: https://console.cloud.google.com/apis/credentials
    SHEETS_API_KEY: 'YOUR_GOOGLE_SHEETS_API_KEY_HERE',
    
    // Google Sheet ID (from the sheet URL)
    // Example: https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
    SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',
    
    // Sheet name/tab within the spreadsheet
    SHEET_NAME: 'Sites',
    
    // API endpoints
    VISION_API_URL: 'https://vision.googleapis.com/v1/images:annotate',
    SHEETS_API_URL: 'https://sheets.googleapis.com/v4/spreadsheets',
    DEEPSEEK_API_URL: 'https://api.deepseek.com/v1/chat/completions'
};

// Instructions for setup:
// 1. Create a Google Cloud Project
// 2. Enable Google Cloud Vision API
// 3. Enable Google Sheets API
// 4. Create API credentials (API keys)
// 5. Get a DeepSeek API key from https://platform.deepseek.com/
// 6. Create a Google Sheet with columns: Address, Company Name, Contact Name, Email, Website, Phone, Date Added, Photo Text
// 7. Share the Google Sheet (set to "Anyone with the link can edit" or use service account)
// 8. Replace the placeholder values above with your actual API keys and Sheet ID
