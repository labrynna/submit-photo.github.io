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

### 3. GOOGLE_SERVICE_ACCOUNT_EMAIL
- **Description**: Service Account email for Google Sheets and Drive API authentication
- **Where to get**: From your Service Account JSON key file (`client_email` field)
- **Example**: `your-service-account@your-project.iam.gserviceaccount.com`
- **Required**: Yes
- **Note**: See [SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md) for detailed setup instructions

### 4. GOOGLE_PRIVATE_KEY
- **Description**: Service Account private key for Google Sheets and Drive API authentication
- **Where to get**: From your Service Account JSON key file (`private_key` field)
- **Example**: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkq...\n-----END PRIVATE KEY-----\n`
- **Required**: Yes
- **Important**: Include the BEGIN and END lines, and keep newlines as `\n`
- **Note**: See [SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md) for detailed setup instructions. The same service account is used for both Sheets and Drive access.

### 5. SHEET_ID
- **Description**: Your Google Sheet ID where data will be stored
- **Where to get**: From your Google Sheet URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
- **Example**: `1A2B3C4D5E6F7G8H9I0J_KLMNOPQRSTUVWXYZabcdef`
- **Required**: Yes

## Optional Environment Variables

### 6. SHEET_NAME
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
- Double-check that all 5 required variables are set (VISION_API_KEY, DEEPSEEK_API_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, SHEET_ID)
- Make sure there are no typos in variable names (they are case-sensitive)
- Verify that values don't have leading/trailing spaces
- For GOOGLE_PRIVATE_KEY, ensure it includes the BEGIN/END lines and newlines are formatted as `\n`
- Click "Save" after adding variables
- Trigger a new deployment after saving

If you get "API keys are not supported by this API" error:
- This means you're still using the old SHEETS_API_KEY method
- You must switch to Service Account authentication (GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY)
- See [SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md) for detailed instructions

## For Local Development

For local development (not using Netlify):
1. Copy `config.template.js` to `config.js`
2. Fill in your API keys directly in `config.js`
3. DO NOT commit `config.js` with real keys to Git
4. Note: Local development will require modifications to support Service Account authentication

## Summary

Copy and paste this checklist when setting up your Netlify environment variables:

```
☐ VISION_API_KEY = your_google_vision_api_key
☐ DEEPSEEK_API_KEY = your_deepseek_api_key
☐ GOOGLE_SERVICE_ACCOUNT_EMAIL = your-service-account@project.iam.gserviceaccount.com
☐ GOOGLE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
☐ SHEET_ID = your_google_sheet_id
☐ SHEET_NAME = Sites (optional)
```

**Important**: For Google Sheets access, you MUST use Service Account authentication. See [SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md) for complete setup instructions.
