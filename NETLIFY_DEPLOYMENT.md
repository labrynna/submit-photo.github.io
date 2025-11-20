# Netlify Deployment Guide

This guide explains how to deploy the Construction Site Photo Submission application to Netlify with proper environment variable configuration.

## Prerequisites

Before deploying to Netlify, you need to have:

1. A Netlify account (free tier works)
2. The following API keys and credentials:
   - Google Cloud Vision API Key
   - DeepSeek API Key
   - Google Sheets API Key
   - Google Sheet ID

If you don't have these yet, see the [API Setup Guide](#api-setup-guide) section below.

## Quick Deployment Steps

### 1. Connect Your Repository to Netlify

1. Log in to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub)
4. Select the `submit-photo.github.io` repository
5. Configure build settings:
   - **Build command**: `node generate-config.js`
   - **Publish directory**: `.` (current directory)
   
   These should be automatically detected from `netlify.toml`

### 2. Configure Environment Variables

Before deploying, you must set up environment variables in Netlify:

1. Go to your site's dashboard in Netlify
2. Navigate to **Site settings** → **Build & deploy** → **Environment**
3. Click **"Edit variables"** or **"Add variable"**
4. Add the following environment variables:

#### For Google Sheets (Service Account - Recommended)

**⚠️ Important**: Google Sheets API v4 requires Service Account authentication for write operations (API keys are NOT supported for append/update).

For detailed instructions on setting up a Service Account, see **[SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md)**.

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service Account email from JSON key file | `your-service-account@project.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | Private key from JSON key file (include BEGIN/END lines) | `-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n` |
| `SHEET_ID` | Your Google Sheet ID | `1A2B3C4D5E6F7G8H9I0J` |
| `SHEET_NAME` | Sheet tab name (optional) | `Sites` (default if not set) |

#### For Other APIs

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `VISION_API_KEY` | Google Cloud Vision API Key | `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` |
| `DEEPSEEK_API_KEY` | DeepSeek AI API Key | `sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` |

**Important**: Make sure to click **"Save"** after adding all variables.

### 3. Deploy

1. Click **"Deploy site"** or trigger a deployment
2. Wait for the build to complete (usually takes 1-2 minutes)
3. Once deployed, your site will be live at: `https://your-site-name.netlify.app`

### 4. Custom Domain (Optional)

If you want to use a custom domain:

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the instructions to configure your DNS settings

## How It Works

### Build Process

When you deploy to Netlify, the following happens:

1. Netlify checks out your repository code
2. Runs the build command: `node generate-config.js`
3. The script reads environment variables and generates `config.js` with the actual API keys
4. The generated `config.js` is included in the deployed site
5. Your application loads `config.js` and has access to the API keys

### Security Considerations

- ✅ API keys are stored securely in Netlify's environment variables
- ✅ API keys are never committed to your Git repository
- ✅ Each deployment generates a fresh `config.js` with current environment variables
- ⚠️ API keys are still exposed in the client-side JavaScript (unavoidable for static sites)
- 🔒 **Recommendation**: Restrict API keys in Google Cloud Console to your Netlify domain

### Restricting API Keys (Recommended)

To improve security, restrict your API keys:

#### For Google Cloud APIs:
1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your API key
3. Under "Application restrictions":
   - Select "HTTP referrers (websites)"
   - Add your Netlify URL: `https://your-site-name.netlify.app/*`
   - If using a custom domain, add that too: `https://yourdomain.com/*`
4. Under "API restrictions":
   - Select "Restrict key"
   - Enable only: Cloud Vision API and Google Sheets API
5. Click "Save"

#### For DeepSeek API:
- Check DeepSeek's dashboard for any available security restrictions
- Consider implementing rate limiting or usage quotas

## Troubleshooting

### Build Fails with "Missing required environment variables"

**Problem**: The build script exits with an error listing missing variables.

**Solution**: 
1. Go to Netlify dashboard → Site settings → Build & deploy → Environment
2. Verify all 4 required variables are set (VISION_API_KEY, DEEPSEEK_API_KEY, SHEETS_API_KEY, SHEET_ID)
3. Trigger a new deployment

### API Errors When Using the App

**Problem**: The app shows "API key not configured" or "API request failed".

**Solution**:
1. Check that environment variables are correctly set in Netlify
2. Check the browser console for specific error messages
3. Verify your API keys are valid and active
4. If using API restrictions, ensure your Netlify domain is whitelisted

### Site Works Locally but Not on Netlify

**Problem**: The app works on your local machine but fails on Netlify.

**Solution**:
1. Make sure you didn't accidentally commit a local `config.js` with hardcoded keys
2. Check the Netlify build logs for any errors
3. Verify the `generate-config.js` script ran successfully during build

## Local Development

For local development without using Netlify:

1. Copy `config.template.js` to `config.js`
2. Fill in your actual API keys in `config.js`
3. **DO NOT** commit `config.js` with real keys to Git
4. Open `index.html` in a browser or use a local web server

Example using Python:
```bash
python3 -m http.server 8000
```

Then open: http://localhost:8000

## Monitoring and Logs

To view deployment logs and troubleshoot issues:

1. Go to your site's Netlify dashboard
2. Click on "Deploys"
3. Click on any deployment to see detailed build logs
4. Check for any errors in the build process

## API Setup Guide

If you haven't set up your APIs yet, follow these steps:

### Google Cloud Vision & Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable APIs:
   - [Cloud Vision API](https://console.cloud.google.com/apis/library/vision.googleapis.com)
   - [Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com)
4. Create API Keys:
   - Go to [Credentials](https://console.cloud.google.com/apis/credentials)
   - Click "Create Credentials" → "API Key"
   - Create two keys (one for Vision, one for Sheets) or use the same key for both
   - Copy these keys for use in Netlify environment variables

### DeepSeek API

1. Visit [DeepSeek Platform](https://platform.deepseek.com/)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy this key for use in Netlify environment variables

### Google Sheet Setup

1. Create a new Google Sheet
2. Add the following column headers in the first row:
   - Address
   - Company Name
   - Contact Name
   - Email
   - Website
   - Phone
   - Date Added
   - Photo Text
3. Share the sheet with your Service Account:
   - Click "Share" button
   - Add the Service Account email (e.g., `your-service-account@project.iam.gserviceaccount.com`)
   - Grant "Editor" permission
   - Click "Send"
4. Copy the Sheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - The SHEET_ID is the long string between `/d/` and `/edit`

**For detailed Service Account setup instructions, see [SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md)**

## Environment Variables Summary

Here's the complete list of environment variables you need to set in Netlify:

```bash
# Required for Google Sheets (Service Account Authentication)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQI...\n-----END PRIVATE KEY-----\n
SHEET_ID=1A2B3C4D5E6F7G8H9I0J

# Required for other APIs
VISION_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
DEEPSEEK_API_KEY=sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Optional (defaults to 'Sites' if not set)
SHEET_NAME=Sites
```

## Support

If you encounter issues:

1. Check the Netlify build logs
2. Check the browser console for JavaScript errors
3. Verify all environment variables are set correctly
4. Ensure API keys are valid and have proper permissions
5. Check that your Google Sheet has the correct column structure

## Security Best Practices

1. ✅ Never commit API keys to your Git repository
2. ✅ Use Netlify environment variables for all secrets
3. ✅ Restrict API keys to your specific domain in Google Cloud Console
4. ✅ Regularly rotate API keys
5. ✅ Monitor API usage in your provider dashboards
6. ✅ Set up usage quotas and alerts for your APIs

---

**Need Help?** Check the [Netlify Documentation](https://docs.netlify.com/) or [Google Cloud Documentation](https://cloud.google.com/docs) for more information.
