#!/usr/bin/env node

/**
 * Build script to generate config.js from environment variables
 * This script is run during Netlify build process to inject environment variables
 */

const fs = require('fs');
const path = require('path');

// Read environment variables
const VISION_API_KEY = process.env.VISION_API_KEY || '';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const SHEETS_API_KEY = process.env.SHEETS_API_KEY || '';
const SHEET_ID = process.env.SHEET_ID || '';
const SHEET_NAME = process.env.SHEET_NAME || 'Sites';

// Validate that required environment variables are set
const missingVars = [];
if (!VISION_API_KEY) missingVars.push('VISION_API_KEY');
if (!DEEPSEEK_API_KEY) missingVars.push('DEEPSEEK_API_KEY');
if (!SHEETS_API_KEY) missingVars.push('SHEETS_API_KEY');
if (!SHEET_ID) missingVars.push('SHEET_ID');

if (missingVars.length > 0) {
    console.error('ERROR: Missing required environment variables:');
    missingVars.forEach(varName => console.error(`  - ${varName}`));
    console.error('\nPlease set these variables in your Netlify dashboard:');
    console.error('Site settings → Build & deploy → Environment → Environment variables');
    process.exit(1);
}

// Generate config.js content
const configContent = `// Configuration file for API keys and settings
// THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY
// Generated at build time from environment variables

const CONFIG = {
    // Google Cloud Vision API Key
    VISION_API_KEY: '${VISION_API_KEY}',
    
    // DeepSeek API Key
    DEEPSEEK_API_KEY: '${DEEPSEEK_API_KEY}',
    
    // Google Sheets API Configuration
    SHEETS_API_KEY: '${SHEETS_API_KEY}',
    
    // Google Sheet ID (from the sheet URL)
    SHEET_ID: '${SHEET_ID}',
    
    // Sheet name/tab within the spreadsheet
    SHEET_NAME: '${SHEET_NAME}',
    
    // API endpoints
    VISION_API_URL: 'https://vision.googleapis.com/v1/images:annotate',
    SHEETS_API_URL: 'https://sheets.googleapis.com/v4/spreadsheets',
    DEEPSEEK_API_URL: 'https://api.deepseek.com/v1/chat/completions'
};
`;

// Write the config.js file
const configPath = path.join(__dirname, 'config.js');
fs.writeFileSync(configPath, configContent, 'utf8');

console.log('✓ config.js generated successfully from environment variables');
console.log(`  - VISION_API_KEY: ${VISION_API_KEY.substring(0, 10)}...`);
console.log(`  - DEEPSEEK_API_KEY: ${DEEPSEEK_API_KEY.substring(0, 10)}...`);
console.log(`  - SHEETS_API_KEY: ${SHEETS_API_KEY.substring(0, 10)}...`);
console.log(`  - SHEET_ID: ${SHEET_ID}`);
console.log(`  - SHEET_NAME: ${SHEET_NAME}`);
