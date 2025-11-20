// Configuration file for API keys and settings
// THIS FILE IS A PLACEHOLDER TEMPLATE.
// It is safe to copy and edit this file for local development.
// DO NOT commit config.js with real keys to the repository.
// During deployment (e.g., on Netlify), this file will be overwritten/generated using environment variables.
//
// For local development:
// 1. Copy config.template.js to config.js (or edit this file directly)
// 2. Fill in your API keys
// 3. DO NOT commit config.js with real keys to the repository
//
// For Netlify deployment:
// Set the following environment variables in Netlify dashboard:
// - VISION_API_KEY
// - DEEPSEEK_API_KEY
// - SHEETS_API_KEY
// - SHEET_ID
// - SHEET_NAME (optional, defaults to 'Sites')

const CONFIG = {
    // Google Cloud Vision API Key
    VISION_API_KEY: '',
    
    // DeepSeek API Key
    DEEPSEEK_API_KEY: '',
    
    // Google Sheets API Configuration
    SHEETS_API_KEY: '',
    
    // Google Sheet ID (from the sheet URL)
    SHEET_ID: '',
    
    // Sheet name/tab within the spreadsheet
    SHEET_NAME: 'Sites',
    
    // API endpoints
    VISION_API_URL: 'https://vision.googleapis.com/v1/images:annotate',
    SHEETS_API_URL: 'https://sheets.googleapis.com/v4/spreadsheets',
    DEEPSEEK_API_URL: 'https://api.deepseek.com/v1/chat/completions'
};
