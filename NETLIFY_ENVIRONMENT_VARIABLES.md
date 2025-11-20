# Netlify Environment Variables

This file lists all the environment variables that need to be configured in Netlify for the application to work.

## Required Environment Variables

Set these in your Netlify dashboard: **Site settings → Build & deploy → Environment → Environment variables**

### 1. VISION_API_KEY
- **Description**: Google Cloud Vision API Key for OCR text extraction
- **Where to get**: [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
- **Example**: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- **Required**: Yes

### 2. DEEPSEEK_API_KEY
- **Description**: DeepSeek AI API Key for intelligent text parsing
- **Where to get**: [DeepSeek Platform](https://platform.deepseek.com/)
- **Example**: `sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- **Required**: Yes

### 3. SHEETS_API_KEY
- **Description**: Google Sheets API Key for data storage
- **Where to get**: [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
- **Example**: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- **Required**: Yes

### 4. SHEET_ID
- **Description**: Your Google Sheet ID where data will be stored
- **Where to get**: From your Google Sheet URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
- **Example**: `1A2B3C4D5E6F7G8H9I0J_KLMNOPQRSTUVWXYZabcdef`
- **Required**: Yes

## Optional Environment Variables

### 5. SHEET_NAME
- **Description**: Name of the sheet tab within the spreadsheet
- **Default**: `Sites` (if not set)
- **Example**: `Sites` or `Construction_Sites`
- **Required**: No

## How to Set Environment Variables in Netlify

1. Log in to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Build & deploy** → **Environment**
4. Click **"Edit variables"** or **"Add variable"**
5. Add each variable one by one:
   - Enter the variable name (e.g., `VISION_API_KEY`)
   - Enter the variable value (your actual API key)
   - Click **"Add"** or **"Save"**
6. After adding all variables, click **"Save"** to apply
7. Trigger a new deployment for the changes to take effect

## Security Notes

- ✅ Environment variables are encrypted at rest in Netlify
- ✅ Environment variables are only accessible during build time
- ✅ Never commit API keys to your Git repository
- 🔒 Recommended: Restrict API keys in Google Cloud Console to your Netlify domain

## Verifying Your Configuration

After setting up environment variables:

1. Trigger a new deployment in Netlify
2. Check the build logs to see if config.js was generated successfully
3. You should see output like:
   ```
   ✓ config.js generated successfully from environment variables
     - VISION_API_KEY: AIzaSyDkfi...
     - DEEPSEEK_API_KEY: sk-c11fbd1...
     - SHEETS_API_KEY: AIzaSyXXXX...
     - SHEET_ID: 1A2B3C4D5E...
     - SHEET_NAME: Sites
   ```

## Troubleshooting

If the build fails with "Missing required environment variables":
- Double-check that all 4 required variables are set
- Make sure there are no typos in variable names (they are case-sensitive)
- Verify that values don't have leading/trailing spaces
- Click "Save" after adding variables
- Trigger a new deployment after saving

## For Local Development

For local development (not using Netlify):
1. Copy `config.template.js` to `config.js`
2. Fill in your API keys directly in `config.js`
3. DO NOT commit `config.js` with real keys to Git

## Summary

Copy and paste this checklist when setting up your Netlify environment variables:

```
☐ VISION_API_KEY = your_google_vision_api_key
☐ DEEPSEEK_API_KEY = your_deepseek_api_key
☐ SHEETS_API_KEY = your_google_sheets_api_key
☐ SHEET_ID = your_google_sheet_id
☐ SHEET_NAME = Sites (optional)
```
