#!/usr/bin/env node

/**
 * Build script to generate config.js from environment variables
 * This script is run during Netlify build process to inject non-secret configuration
 * 
 * NOTE: This script no longer writes API keys to config.js for security reasons.
 * API keys are kept secure in Netlify environment variables and accessed via
 * serverless functions (Netlify Functions) at runtime.
 */

const fs = require('fs');
const path = require('path');

// Read non-secret environment variables
const SHEET_NAME = process.env.SHEET_NAME || 'Sites';

// Validate that required environment variables are set (for build-time validation)
// These are not written to config.js but we validate they exist
const missingVars = [];
if (!process.env.VISION_API_KEY) missingVars.push('VISION_API_KEY');
if (!process.env.DEEPSEEK_API_KEY) missingVars.push('DEEPSEEK_API_KEY');
if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) missingVars.push('GOOGLE_SERVICE_ACCOUNT_EMAIL');
if (!process.env.GOOGLE_PRIVATE_KEY) missingVars.push('GOOGLE_PRIVATE_KEY');
if (!process.env.SHEET_ID) missingVars.push('SHEET_ID');

if (missingVars.length > 0) {
    console.error('ERROR: Missing required environment variables:');
    missingVars.forEach(varName => console.error(`  - ${varName}`));
    console.error('\nPlease set these variables in your Netlify dashboard:');
    console.error('Site settings → Build & deploy → Environment → Environment variables');
    console.error('\nFor Google Sheets authentication, see SERVICE_ACCOUNT_SETUP.md');
    process.exit(1);
}

// Generate config.js content with ONLY non-secret values
const configContent = `// Configuration file for non-secret settings
// THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY
// Generated at build time from environment variables
//
// SECURITY NOTE: This file contains NO API keys or secrets.
// All API calls are proxied through secure Netlify Functions that
// access secrets from server-side environment variables.

const CONFIG = {
    // Sheet name/tab within the spreadsheet
    SHEET_NAME: ${JSON.stringify(SHEET_NAME)},
    
    // Netlify Functions endpoints (serverless functions that proxy API calls)
    VISION_API_ENDPOINT: '/.netlify/functions/vision-api',
    DEEPSEEK_API_ENDPOINT: '/.netlify/functions/deepseek-api',
    SHEETS_API_ENDPOINT: '/.netlify/functions/sheets-api',
    DRIVE_API_ENDPOINT: '/.netlify/functions/drive-api'
};
`;

// Write the config.js file
const configPath = path.join(__dirname, 'config.js');
fs.writeFileSync(configPath, configContent, 'utf8');

console.log('✓ config.js generated successfully (non-secret configuration only)');
console.log(`  - SHEET_NAME: ${SHEET_NAME}`);
console.log('  - API keys are kept secure in Netlify Functions');
console.log('  - Vision API endpoint: /.netlify/functions/vision-api');
console.log('  - DeepSeek API endpoint: /.netlify/functions/deepseek-api');
console.log('  - Sheets API endpoint: /.netlify/functions/sheets-api');
console.log('  - Drive API endpoint: /.netlify/functions/drive-api');

