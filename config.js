// Configuration file for API keys and settings
// IMPORTANT: For production use, never commit API keys to the repository.
// Use environment variables or a secure configuration service.

const CONFIG = {
    // Google Cloud Vision API Key
    // Get your API key from: https://console.cloud.google.com/apis/credentials
    VISION_API_KEY: 'AIzaSyDkfiUXQR35cedbzOrGGaIsVanB5sFLnIM',
    
    // Google Gemini API Key
    // Get your API key from: https://aistudio.google.com/app/apikey
    GEMINI_API_KEY: 'AIzaSyClBmkK1toGM-Ai90oefqiO7AfnIO1wPlk',
    
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
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'
};

// Instructions for setup:
// 1. Create a Google Cloud Project
// 2. Enable Google Cloud Vision API
// 3. Enable Google Sheets API
// 4. Create API credentials (API keys)
// 5. Create a Google Sheet with columns: Address, Company Name, Website, Phone, Date Added, Photo Text
// 6. Share the Google Sheet (set to "Anyone with the link can edit" or use service account)
// 7. Replace the placeholder values above with your actual API keys and Sheet ID
