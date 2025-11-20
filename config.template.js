// Configuration file template for non-secret settings
// Copy this file to config.js for local development
//
// SECURITY NOTE: This file contains NO API keys or secrets.
// For local development, you need to set up a local proxy or use
// a development server that mimics Netlify Functions.
//
// For production deployment on Netlify:
// - Set environment variables in Netlify dashboard (Site settings → Build & deploy → Environment)
// - Required variables: VISION_API_KEY, DEEPSEEK_API_KEY, SHEETS_API_KEY, SHEET_ID, SHEET_NAME
// - The build script will generate config.js with only non-secret values
// - API calls are proxied through secure Netlify Functions

const CONFIG = {
    // Sheet name/tab within the spreadsheet
    SHEET_NAME: 'Sites',
    
    // Netlify Functions endpoints (serverless functions that proxy API calls)
    // For local development, these would need to point to your local dev server
    VISION_API_ENDPOINT: '/.netlify/functions/vision-api',
    DEEPSEEK_API_ENDPOINT: '/.netlify/functions/deepseek-api',
    SHEETS_API_ENDPOINT: '/.netlify/functions/sheets-api'
};
