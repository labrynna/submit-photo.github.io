# Troubleshooting Guide

This guide helps you resolve common errors when using the Construction Site Photo Submission application.

## Error Messages and Solutions

### "Failed to connect to Google Vision API. Please check your internet connection and try again."

**Cause:** Network connectivity issue or CORS policy blocking the request.

**Solutions:**
1. Check your internet connection
2. Try refreshing the page
3. If using a firewall or VPN, ensure `vision.googleapis.com` is not blocked
4. Check browser console for CORS errors
5. Ensure you're accessing the site via HTTPS (not HTTP)

---

### "Google Vision API: Invalid API key. Please check your Google Vision API key in config.js"

**Cause:** The API key format is invalid or contains extra characters.

**Solutions:**
1. Verify the API key in your config.js (or Netlify environment variables)
2. Ensure there are no spaces or special characters in the key
3. The key should start with `AIza`
4. Create a new API key if needed: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

---

### "Google Vision API: API key expired. Please renew your Google Vision API key in Google Cloud Console."

**Cause:** Your API key has expired or been revoked.

**Solutions:**
1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Check if your API key is still active
3. Create a new API key if the old one is expired
4. Update your config.js (or Netlify environment variables) with the new key
5. Redeploy your application if using Netlify

---

### "Google Vision API: Google Vision API is not enabled. Please enable it in Google Cloud Console."

**Cause:** The Cloud Vision API is not enabled for your Google Cloud project.

**Solutions:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" → "Library"
4. Search for "Cloud Vision API"
5. Click "Enable"

---

### "Google Vision API: Access denied. Please check API key restrictions in Google Cloud Console."

**Cause:** The API key has restrictions that prevent it from being used with your domain.

**Solutions:**
1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your API key
3. Under "Application restrictions":
   - For testing: Select "None"
   - For production: Select "HTTP referrers" and add your domain (e.g., `*.netlify.app/*` or your custom domain)
4. Under "API restrictions":
   - Ensure "Cloud Vision API" is in the allowed list
5. Save changes and wait a few minutes for them to take effect

---

### "DeepSeek API: Invalid or expired API key. Please check your DeepSeek API key in config.js or renew it at platform.deepseek.com"

**Cause:** The DeepSeek API key is invalid, expired, or incorrectly formatted.

**Solutions:**
1. Go to [DeepSeek Platform](https://platform.deepseek.com/)
2. Sign in to your account
3. Check your API key status
4. Generate a new API key if needed
5. Update your config.js (or Netlify environment variables)
6. The key should start with `sk-`

---

### "DeepSeek API: Insufficient credits. Please add credits to your DeepSeek account."

**Cause:** Your DeepSeek account has run out of credits.

**Solutions:**
1. Go to [DeepSeek Platform](https://platform.deepseek.com/)
2. Check your account balance
3. Add credits to your account
4. Try again after credits are added

---

### "Failed to connect to Google Sheets. Please check your internet connection and try again."

**Cause:** Network connectivity issue preventing access to Google Sheets API.

**Solutions:**
1. Check your internet connection
2. Ensure `sheets.googleapis.com` is not blocked by firewall
3. Try refreshing the page
4. Check browser console for additional error details

---

### "Google Sheets: Invalid API key. Please check your Google Sheets API key in config.js"

**Cause:** The Sheets API key is invalid or incorrectly configured.

**Solutions:**
1. Verify your SHEETS_API_KEY in config.js (or Netlify environment variables)
2. Ensure it's the same format as your Vision API key (starts with `AIza`)
3. You can use the same API key for both Vision and Sheets APIs
4. Ensure Google Sheets API is enabled in your Google Cloud project

---

### "Failed to save data: API keys are not supported by this API. Expected OAuth2 access token or other authentication credentials"

**Cause:** This is a critical error - Google Sheets API v4 does NOT support API keys for write operations (append/update).

**Solutions:**
1. You MUST switch to Service Account authentication
2. Follow the complete guide: [SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md)
3. Set up `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` in Netlify environment variables
4. Remove the old `SHEETS_API_KEY` environment variable (it's no longer used)
5. Share your Google Sheet with the Service Account email
6. Redeploy your Netlify site after updating environment variables

---

### "Google Sheets: Access denied. Please check that your Sheet is shared properly."

**Cause:** The Google Sheet is not shared with the Service Account or has incorrect permissions.

**Solutions:**
1. Open your Google Sheet
2. Click the "Share" button
3. Add the Service Account email (e.g., `your-service-account@project.iam.gserviceaccount.com`)
4. Grant "Editor" permission
5. Click "Send" to save
6. Verify the Service Account email is correct in your Netlify environment variables
7. See [SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md) for detailed instructions

---

### "Google Sheets: Sheet not found. Please verify the SHEET_ID in config.js is correct."

**Cause:** The SHEET_ID in your configuration doesn't match an existing Google Sheet.

**Solutions:**
1. Open your Google Sheet in a browser
2. Copy the Sheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Copy only the SHEET_ID_HERE part
3. Update your Netlify environment variables with the correct SHEET_ID
4. Verify the SHEET_NAME matches the tab name in your spreadsheet (default: "Sites")

---

### "Failed to upload photo to Google Drive: Service Accounts do not have storage quota"

**Cause:** As of April 2025, Google changed the policy for service accounts - they no longer have their own storage quota. The application must use a shared folder from a personal Google Drive account to leverage that account's storage quota.

**Solution (Required as of April 2025):**

This issue has been **fixed in the latest version** of the code. The application now uses the `supportsAllDrives=true` parameter in all Google Drive API calls, which ensures that files are uploaded using the storage quota of the personal Gmail account that owns the shared folder, not the service account's quota.

**Setup Requirements:**
1. Set up a folder in your regular Google Drive
2. Share that folder with your service account email (Editor permission)
3. Get the folder ID from the Drive URL (e.g., `https://drive.google.com/drive/folders/FOLDER_ID_HERE`)
4. Add `GOOGLE_DRIVE_FOLDER_ID` environment variable in Netlify with that folder ID
5. Redeploy your application with the latest code

**Step-by-step guide:**
1. Open your Google Drive (regular user account, NOT the service account)
2. Create a new folder (e.g., "Photo Uploads")
3. Right-click the folder → Share
4. Add your service account email (from GOOGLE_SERVICE_ACCOUNT_EMAIL)
5. Grant "Editor" permission
6. Click "Send" to share the folder
7. Open the folder in your browser
8. Copy the folder ID from the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
9. In Netlify: Site Settings → Build & deploy → Environment
10. Add new variable: `GOOGLE_DRIVE_FOLDER_ID` = `FOLDER_ID_HERE`
11. Save and trigger a new deployment

**Technical Details:**

The fix adds these parameters to all Google Drive API calls:
- `supportsAllDrives=true` - Enables support for shared drives and folders
- `includeItemsFromAllDrives=true` - Includes items from shared folders in search results

These parameters ensure that when the service account creates folders or uploads files, it uses the storage quota of the owner of the shared folder (your personal Gmail account) rather than attempting to use the service account's own quota (which no longer exists).

See [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md) for complete instructions.

**Note:** Even if photo upload fails for other reasons, your data will still be saved to Google Sheets. The application is designed to continue working even if Drive upload fails.

**Alternative Solution for Google Workspace Users:**

If you're using Google Workspace (not personal Gmail) and still experiencing issues, you can enable domain-wide delegation to have the service account impersonate a specific user:

1. See [DOMAIN_WIDE_DELEGATION_SETUP.md](DOMAIN_WIDE_DELEGATION_SETUP.md) for complete setup instructions
2. This requires Super Admin access to Google Workspace Admin Console
3. Add `GOOGLE_IMPERSONATE_USER_EMAIL` environment variable in Netlify
4. This approach makes the service account act on behalf of a specific user, using that user's permissions and storage quota

---

### "Failed to upload photo to Google Drive: OAuth credentials not configured"

**Cause:** The OAuth 2.0 credentials required for Google Drive upload are missing or incorrectly configured in Netlify environment variables.

**Error Message Example:**
```
Warning: Failed to upload photo to Google Drive: OAuth credentials not configured. 
Please set GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, and GOOGLE_OAUTH_REFRESH_TOKEN 
environment variables. See OAUTH_SETUP_GUIDE.md for instructions.
```

**Solutions:**

1. **Verify all three OAuth environment variables are set in Netlify:**
   - Go to Netlify Dashboard → Your Site → Site settings → Environment variables
   - Check that ALL THREE variables exist:
     - `GOOGLE_OAUTH_CLIENT_ID`
     - `GOOGLE_OAUTH_CLIENT_SECRET`
     - `GOOGLE_OAUTH_REFRESH_TOKEN`
   - If any are missing, follow [OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md) to set them up

2. **Check for whitespace or formatting issues:**
   - Environment variables should NOT have extra spaces before or after the value
   - Client ID should look like: `123456789-abc.apps.googleusercontent.com`
   - Client Secret should look like: `GOCSPX-abcdefghijk`
   - Refresh Token should look like: `1//0gPAbcDefGhiJkL...` (very long string)

3. **Check Netlify Function Logs for details:**
   - Go to Netlify Dashboard → Functions → drive-api
   - Look at recent invocations for error details
   - The logs will show which specific variable is missing:
     - `GOOGLE_OAUTH_CLIENT_ID: NOT SET` or `SET`
     - `GOOGLE_OAUTH_CLIENT_SECRET: NOT SET` or `SET`
     - `GOOGLE_OAUTH_REFRESH_TOKEN: NOT SET` or `SET`

4. **Redeploy after adding environment variables:**
   - After adding or updating environment variables in Netlify
   - You MUST trigger a new deployment for changes to take effect
   - Go to Netlify Dashboard → Deploys → Trigger deploy → Deploy site

5. **Verify OAuth credentials are valid:**
   - Test your refresh token using [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
   - Click the gear icon, check "Use your own OAuth credentials"
   - Enter your Client ID and Client Secret
   - Paste your Refresh Token in the "Refresh token" field
   - Click "Refresh access token"
   - If it fails, you need to generate a new refresh token (follow Step 2 in OAUTH_SETUP_GUIDE.md)

6. **Common setup mistakes:**
   - ❌ Only setting 1 or 2 of the 3 required variables
   - ❌ Copying the Authorization Code instead of the Refresh Token
   - ❌ Using the Access Token instead of the Refresh Token (access tokens expire quickly)
   - ❌ Not completing the authorization flow in OAuth Playground
   - ❌ Forgetting to click "Exchange authorization code for tokens" in OAuth Playground
   - ❌ Not redeploying after setting environment variables

**Quick Verification Checklist:**
```
☐ GOOGLE_OAUTH_CLIENT_ID is set in Netlify (not empty)
☐ GOOGLE_OAUTH_CLIENT_SECRET is set in Netlify (not empty)
☐ GOOGLE_OAUTH_REFRESH_TOKEN is set in Netlify (not empty)
☐ Values have no extra spaces at beginning or end
☐ Triggered a new deployment after setting variables
☐ Refresh token was obtained from OAuth Playground (Step 2 in OAUTH_SETUP_GUIDE.md)
☐ All three variables are in the SAME Netlify site
```

**Note:** OAuth is specifically for Google Drive uploads. If Drive upload fails, your data will still be saved to Google Sheets (which uses Service Account authentication separately).

**See Also:**
- Complete setup guide: [OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md)
- Quick start guide: [OAUTH_QUICK_START.md](OAUTH_QUICK_START.md)

---

### "Failed to obtain access token from refresh token"

**Cause:** The OAuth refresh token is invalid, expired, or the Client ID/Secret don't match the token.

**Error Message Example:**
```
Failed to obtain access token from refresh token. This may indicate: 
1) Invalid refresh token format, 2) Expired or revoked refresh token, 
3) Incorrect Client ID or Secret.
```

**Solutions:**

1. **Generate a new refresh token:**
   - The most common solution is to get a fresh refresh token
   - Follow Step 2 in [OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md)
   - Use [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
   - Make sure to:
     - Configure with your Client ID and Secret (gear icon)
     - Authorize with `https://www.googleapis.com/auth/drive.file` scope
     - Click "Exchange authorization code for tokens"
     - Copy the **refresh_token** (not the access_token)
   - Update `GOOGLE_OAUTH_REFRESH_TOKEN` in Netlify
   - Redeploy

2. **Verify Client ID and Secret match:**
   - The refresh token is tied to specific OAuth credentials
   - If you created new OAuth credentials, you need a new refresh token
   - The Client ID and Secret must be from the SAME OAuth client that was used to generate the refresh token

3. **Check if access was revoked:**
   - Go to [Google Account - Third-party apps with account access](https://myaccount.google.com/permissions)
   - Look for your app (the name from OAuth consent screen)
   - If it's not listed or shows "Removed", you need to reauthorize:
     - Generate a new refresh token following Step 2 in OAUTH_SETUP_GUIDE.md

4. **Verify the refresh token format:**
   - Refresh tokens typically start with `1//`
   - They are very long (100+ characters)
   - Ensure you copied the entire token
   - Check for no extra spaces or line breaks

5. **Check OAuth consent screen configuration:**
   - Go to [Google Cloud Console - OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)
   - Verify your email is listed as a test user (for External apps)
   - Ensure the app status is not "Suspended"

**See Also:** [OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md) for complete setup instructions

---

### "Failed to upload photo to Google Drive: Permission denied" or "Access denied"

**Cause:** The service account doesn't have proper access to the Google Drive folder.

**Solutions:**

1. **Verify folder sharing:**
   - Open the folder specified in `GOOGLE_DRIVE_FOLDER_ID` in Google Drive
   - Click "Share" button
   - Ensure the service account email (from `GOOGLE_SERVICE_ACCOUNT_EMAIL`) is listed
   - Ensure it has "Editor" permission (not just "Viewer")
   - If missing, add it with Editor permission

2. **Check folder ID is correct:**
   - Verify the `GOOGLE_DRIVE_FOLDER_ID` in Netlify matches your folder
   - The ID should be from the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
   - Make sure there are no extra spaces or characters

3. **For Google Workspace users:**
   - If you're using Google Workspace, consider enabling domain-wide delegation
   - See [DOMAIN_WIDE_DELEGATION_SETUP.md](DOMAIN_WIDE_DELEGATION_SETUP.md)
   - Set `GOOGLE_IMPERSONATE_USER_EMAIL` to a user with proper permissions
   - This allows the service account to act as that user

4. **Ensure Google Drive API is enabled:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to APIs & Services → Library
   - Search for "Google Drive API" and ensure it's enabled

---

## General Troubleshooting Steps

### Check Configuration

1. **For local development:**
   - Verify all values in `config.js` are correct
   - Ensure no placeholder values like `YOUR_API_KEY_HERE` remain

2. **For Netlify deployment:**
   - Check all environment variables are set in Netlify dashboard
   - Trigger a new deployment after updating environment variables
   - Check build logs for errors

### Test API Keys

You can test your API keys using curl or a tool like Postman:

**Test Google Vision API:**
```bash
curl -X POST \
  "https://vision.googleapis.com/v1/images:annotate?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"requests":[{"image":{"content":"base64_encoded_image"},"features":[{"type":"TEXT_DETECTION"}]}]}'
```

**Test DeepSeek API:**
```bash
curl -X POST \
  "https://api.deepseek.com/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"Hello"}]}'
```

**Test Google Sheets API:**
```bash
curl "https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Sites?key=YOUR_API_KEY"
```

### Browser Console

Always check the browser console (F12 → Console tab) for additional error details:
- Network errors will show the exact HTTP status code
- CORS errors will be clearly indicated
- API error responses will be logged

### API Usage Limits

Each API has usage limits:
- **Google Cloud Vision API:** Check quotas in Google Cloud Console
- **DeepSeek API:** Check your account credits and rate limits
- **Google Sheets API:** Check API quotas in Google Cloud Console

If you're hitting rate limits, you may need to:
1. Request quota increases
2. Add credits to your account
3. Optimize your usage
4. Wait before making more requests

---

## Need More Help?

If you're still experiencing issues:

1. Check the browser console for detailed error messages
2. Verify all API keys are valid and not expired
3. Ensure all APIs are enabled in Google Cloud Console
4. Check that your Google Sheet is properly shared
5. Try with a fresh API key
6. Review the [setup guide](SETUP.md) to ensure all steps were followed

For Netlify-specific issues, see [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md)
