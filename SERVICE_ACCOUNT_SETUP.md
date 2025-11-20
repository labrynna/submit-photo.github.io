# Google Service Account Setup Guide

This guide explains how to set up Google Service Account authentication for the Google Sheets integration in this application.

## Why Service Account?

Google Sheets API v4 **does not support API keys** for write operations (append, update). Instead, you need to use:
- **OAuth2** (requires user interaction, not suitable for automated systems)
- **Service Account** (recommended for automated systems like this application)

## Prerequisites

- A Google Cloud Platform account
- Access to [Google Cloud Console](https://console.cloud.google.com/)
- Admin access to your Netlify site

## Step 1: Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **IAM & Admin** → **Service Accounts**
4. Click **"Create Service Account"**
5. Fill in the details:
   - **Service account name**: `sheets-api-service-account` (or any name you prefer)
   - **Service account description**: `Service account for Construction Site Photo Submission app`
6. Click **"Create and Continue"**
7. For **"Grant this service account access to project"**, select role:
   - Choose **"Basic"** → **"Editor"** (or create a custom role with only Sheets API permissions)
8. Click **"Continue"** and then **"Done"**

## Step 2: Create and Download Service Account Key

1. In the Service Accounts list, find the account you just created
2. Click on the service account email to open its details
3. Go to the **"Keys"** tab
4. Click **"Add Key"** → **"Create new key"**
5. Choose **"JSON"** format
6. Click **"Create"**
7. A JSON file will be downloaded automatically - **save this file securely**

⚠️ **Security Warning**: This JSON file contains credentials that allow access to your Google Cloud resources. Never commit it to version control or share it publicly.

## Step 3: Enable Google Sheets API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for **"Google Sheets API"**
3. Click on it and click **"Enable"**

## Step 4: Share Your Google Sheet with the Service Account

This is a critical step that's often missed!

1. Open the JSON key file you downloaded
2. Find the `client_email` field - it looks like:
   ```
   your-service-account@your-project-id.iam.gserviceaccount.com
   ```
3. Copy this email address
4. Open your Google Sheet
5. Click the **"Share"** button
6. Paste the service account email
7. Grant **"Editor"** permission
8. Click **"Send"** (you can uncheck "Notify people" since it's a service account)

## Step 5: Extract Credentials from JSON File

Open the downloaded JSON key file. It will look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkq...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project-id.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

You need to extract two values:
1. **`client_email`**: Copy the entire email address
2. **`private_key`**: Copy the entire private key including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines

## Step 6: Configure Netlify Environment Variables

1. Log in to [Netlify](https://app.netlify.com/)
2. Select your site
3. Go to **Site settings** → **Build & deploy** → **Environment**
4. Click **"Edit variables"** or **"Add variable"**
5. Add the following environment variables:

### Required Variables:

| Variable Name | Value | Example |
|---------------|-------|---------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | The `client_email` from your JSON file | `your-service-account@your-project-id.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | The `private_key` from your JSON file | `-----BEGIN PRIVATE KEY-----\nMIIEvQI...\n-----END PRIVATE KEY-----\n` |
| `SHEET_ID` | Your Google Sheet ID from the URL | `1A2B3C4D5E6F7G8H9I0J` |
| `SHEET_NAME` | Sheet tab name (optional) | `Sites` (default if not set) |

### Also Keep These for Other APIs:

| Variable Name | Value | Source |
|---------------|-------|--------|
| `VISION_API_KEY` | Google Cloud Vision API Key | [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials) |
| `DEEPSEEK_API_KEY` | DeepSeek AI API Key | [DeepSeek Platform](https://platform.deepseek.com/) |

### Important Notes for `GOOGLE_PRIVATE_KEY`:

The private key contains newline characters (`\n`). When pasting into Netlify:

**Option 1: Paste as-is (Recommended)**
- Copy the entire private key exactly as it appears in the JSON file
- Netlify will handle it correctly

**Option 2: If you need to manually format it**
- Keep the newline characters as `\n` (literal backslash-n, not actual newlines)
- The key should look like: `-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n`

## Step 7: Deploy Your Site

1. After adding all environment variables, click **"Save"**
2. Trigger a new deployment (or just commit and push changes)
3. Wait for the build to complete
4. Your site should now be able to write to Google Sheets using Service Account authentication

## Troubleshooting

### "Failed to obtain access token from Service Account"

**Cause**: Invalid credentials or incorrect formatting of private key

**Solutions**:
1. Verify the `GOOGLE_SERVICE_ACCOUNT_EMAIL` is correct
2. Check that the `GOOGLE_PRIVATE_KEY` includes the BEGIN and END lines
3. Ensure the private key newlines are properly formatted (`\n`)
4. Try deleting and re-creating the environment variables
5. Generate a new service account key and try again

### "Permission denied" or "Access denied"

**Cause**: Service account doesn't have access to the Google Sheet

**Solutions**:
1. Verify you shared the Google Sheet with the service account email
2. Ensure the service account has "Editor" permission
3. Check that you're using the correct Sheet ID
4. Make sure the sheet tab name matches the `SHEET_NAME` variable

### "API key not supported" error

**Cause**: Still using the old API key authentication method

**Solutions**:
1. Verify you've deployed the latest code that uses Service Account
2. Check that `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` are set (not `SHEETS_API_KEY`)
3. Clear your browser cache and try again
4. Check the Netlify function logs for detailed error messages

### "google-auth-library not found" error

**Cause**: The npm package wasn't installed during Netlify build

**Solutions**:
1. Verify `netlify/functions/package.json` exists in your repository
2. Check the Netlify build logs to see if npm install ran
3. Try triggering a clean rebuild in Netlify

## Security Best Practices

1. ✅ Never commit the service account JSON file to Git
2. ✅ Store credentials only in Netlify environment variables
3. ✅ Regularly rotate service account keys (every 90 days recommended)
4. ✅ Use the principle of least privilege - only grant necessary permissions
5. ✅ Monitor service account usage in Google Cloud Console
6. ✅ Set up alerts for unusual API activity
7. ✅ Delete old/unused service account keys

## Alternative: Using API Key for Read-Only Access

If you only need to **read** data from Google Sheets (not write), you can still use an API key:

1. The sheet must be publicly accessible (shared with "Anyone with the link can view")
2. Use the API key method with GET requests only
3. This is less secure but simpler for read-only scenarios

However, this application requires **write access** (append and update operations), so Service Account is required.

## Summary Checklist

Use this checklist to ensure you've completed all steps:

```
☐ Created a Service Account in Google Cloud Console
☐ Downloaded the JSON key file
☐ Enabled Google Sheets API
☐ Shared Google Sheet with service account email (Editor permission)
☐ Extracted client_email and private_key from JSON file
☐ Added GOOGLE_SERVICE_ACCOUNT_EMAIL to Netlify environment variables
☐ Added GOOGLE_PRIVATE_KEY to Netlify environment variables
☐ Added SHEET_ID to Netlify environment variables
☐ Added SHEET_NAME to Netlify environment variables (optional)
☐ Verified VISION_API_KEY and DEEPSEEK_API_KEY are still set
☐ Saved all environment variables in Netlify
☐ Triggered a new deployment
☐ Tested the application by uploading a photo and saving data
```

## Need Help?

If you encounter issues:
1. Check the Netlify function logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure the Google Sheet is shared with the service account
4. Check that Google Sheets API is enabled in your Google Cloud project
5. Review the [Netlify documentation on environment variables](https://docs.netlify.com/environment-variables/overview/)
6. Review the [Google Cloud Service Accounts documentation](https://cloud.google.com/iam/docs/service-accounts)

---

**For more information:**
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Google Sheets API Authentication](https://developers.google.com/sheets/api/guides/authorizing)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
