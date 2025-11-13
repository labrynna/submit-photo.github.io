// Configuration file template for API keys and settings
// Copy this file to config.js and fill in your actual values

const CONFIG = {
    // Google Cloud Vision API Key
    // Get your API key from: https://console.cloud.google.com/apis/credentials
    VISION_API_KEY: 'YOUR_GOOGLE_VISION_API_KEY_HERE',
    
    // Google Sheets API Configuration
    // Get your API key from: https://console.cloud.google.com/apis/credentials
    SHEETS_API_KEY: 'YOUR_GOOGLE_SHEETS_API_KEY_HERE',
    
    // Google Sheet ID (from the sheet URL)
    // Example: https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
    SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',
    
    // Sheet name/tab within the spreadsheet
    SHEET_NAME: 'Sites',
    
    // API endpoints (usually don't need to change these)
    VISION_API_URL: 'https://vision.googleapis.com/v1/images:annotate',
    SHEETS_API_URL: 'https://sheets.googleapis.com/v4/spreadsheets'
};
