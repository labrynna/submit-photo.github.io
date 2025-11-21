# OAuth 2.0 Setup Guide for Google Drive Upload

This guide will walk you through setting up OAuth 2.0 authentication for Google Drive uploads. With this setup, you'll authorize your application **once**, and the access will be automatically renewed using a refresh token stored in Netlify.

## Overview

- **Service Account** (for Google Sheets) - Still used, no changes needed
- **OAuth 2.0** (for Google Drive) - New method for photo uploads
- **One-time authorization** - You consent once, token is stored in Netlify
- **Automatic renewal** - Access tokens are automatically refreshed

---

## Step 1: Create OAuth 2.0 Credentials in Google Cloud Console

### 1.1 Go to Google Cloud Console

1. Navigate to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your existing project (the same one you're using for Sheets API)

### 1.2 Enable Google Drive API

1. Go to **APIs & Services** → **Library**
2. Search for **"Google Drive API"**
3. Click on it and click **"Enable"** (if not already enabled)

### 1.3 Create OAuth 2.0 Client ID

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted to configure the OAuth consent screen:
   - Click **"Configure Consent Screen"**
   - Select **"External"** (for personal Gmail accounts)
   - Click **"Create"**
   
4. Fill in the OAuth consent screen:
   - **App name**: `Photo Upload App` (or any name you prefer)
   - **User support email**: Your email address
   - **Developer contact email**: Your email address
   - Click **"Save and Continue"**
   
5. On the "Scopes" screen:
   - Click **"Add or Remove Scopes"**
   - Search for and add: `https://www.googleapis.com/auth/drive.file`
   - This scope allows the app to create and manage files it created
   - Click **"Update"** then **"Save and Continue"**
   
6. On the "Test users" screen (for External apps):
   - Click **"Add Users"**
   - Add your Gmail address
   - Click **"Save and Continue"**
   - Click **"Back to Dashboard"**

7. Now create the OAuth Client ID:
   - Go back to **APIs & Services** → **Credentials**
   - Click **"Create Credentials"** → **"OAuth client ID"**
   - Select **Application type**: **"Web application"**
   - **Name**: `Photo Upload OAuth Client` (or any name)
   - Click **"Create"**

8. **Save your credentials:**
   - You'll see a popup with **Client ID** and **Client Secret**
   - **IMPORTANT**: Copy both and save them securely
   - Example Client ID: `123456789-abcdefg.apps.googleusercontent.com`
   - Example Client Secret: `GOCSPX-abcdefghijklmnop`

---

## Step 2: Obtain Refresh Token Using OAuth 2.0 Playground

Since this is a one-time setup, we'll use Google's OAuth 2.0 Playground to get your refresh token.

### 2.1 Configure OAuth Playground

1. Go to [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

2. Click the **gear icon** (⚙️) in the top right corner

3. Check **"Use your own OAuth credentials"**

4. Enter your credentials:
   - **OAuth Client ID**: Paste your Client ID from Step 1
   - **OAuth Client Secret**: Paste your Client Secret from Step 1
   - Click **"Close"**

### 2.2 Authorize and Get Refresh Token

1. On the left side, find **"Drive API v3"**

2. Expand it and select:
   - ✅ `https://www.googleapis.com/auth/drive.file`

3. Click **"Authorize APIs"**

4. You'll be redirected to Google sign-in:
   - Select your Google account
   - Click **"Continue"** on the consent screen
   - You may see a warning "Google hasn't verified this app" - click **"Continue"** (it's safe, it's your own app)
   - Click **"Allow"** to grant permissions

5. You'll be redirected back to the Playground

6. Click **"Exchange authorization code for tokens"**

7. You'll see a response with:
   - `access_token` - Temporary token (ignore this)
   - `refresh_token` - **THIS IS WHAT YOU NEED!**
   
8. **Copy the refresh_token value** (it's a long string starting with `1//`)
   - Example: `1//0gPAbcDefGhiJkL...` (actual tokens are much longer)
   - **IMPORTANT**: Save this securely, you'll need it for Netlify

---

## Step 3: Add Environment Variables to Netlify

Now you'll add three new environment variables to Netlify for OAuth authentication.

### 3.1 Go to Netlify Environment Variables

1. Log in to [Netlify](https://app.netlify.com/)
2. Select your site
3. Go to **Site settings** → **Build & deploy** → **Environment**
4. Click **"Edit variables"** or **"Add variable"**

### 3.2 Add OAuth Variables

Add these **THREE** new environment variables:

#### Variable 1: GOOGLE_OAUTH_CLIENT_ID
```
Key:   GOOGLE_OAUTH_CLIENT_ID
Value: Your OAuth Client ID from Step 1
Example: 123456789-abcdefg.apps.googleusercontent.com
```

#### Variable 2: GOOGLE_OAUTH_CLIENT_SECRET
```
Key:   GOOGLE_OAUTH_CLIENT_SECRET
Value: Your OAuth Client Secret from Step 1
Example: GOCSPX-abcdefghijklmnop
```

#### Variable 3: GOOGLE_OAUTH_REFRESH_TOKEN
```
Key:   GOOGLE_OAUTH_REFRESH_TOKEN
Value: The refresh token from Step 2
Example: 1//0gPAbcDefGhiJkL...
```

### 3.3 Important Notes

- **Keep existing variables**: Don't remove the Google Sheets variables (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, etc.)
- **GOOGLE_DRIVE_FOLDER_ID** (optional): You can still use this to upload to a specific folder in your Drive
- Click **"Save"** after adding all variables

---

## Step 4: Deploy Your Application

1. After saving the environment variables, **trigger a new deployment**:
   - Go to **Deploys** tab in Netlify
   - Click **"Trigger deploy"** → **"Deploy site"**
   
2. Wait for the deployment to complete

3. Your application will now use OAuth for Google Drive uploads!

---

## Step 5: Test Your Setup

1. Open your application in a browser

2. Upload a construction site photo

3. Click **"Analyze Photo"**

4. Review the extracted data

5. Click **"Save"**

6. **Expected result:**
   - Photo is successfully uploaded to your Google Drive
   - Data is saved to Google Sheets (using the existing Service Account)
   - You'll see a success message

7. **Check Google Drive:**
   - Open your Google Drive
   - If you set `GOOGLE_DRIVE_FOLDER_ID`, go to that folder
   - Otherwise, check the root of your Drive
   - You should see the uploaded photo with filename format: `DATE_ADDRESS.jpg`

---

## How It Works

### OAuth Flow Explained

1. **Initial Setup** (once):
   - You authorize the app using OAuth Playground
   - Google gives you a refresh token
   - You store the refresh token in Netlify

2. **Each Photo Upload**:
   - Netlify Function reads the refresh token from environment variables
   - Uses refresh token to get a fresh access token (valid for ~1 hour)
   - Uses access token to upload photo to your Google Drive
   - Access tokens are automatically refreshed as needed

3. **Benefits**:
   - ✅ No need to share folders with service accounts
   - ✅ Files upload directly to YOUR Google Drive
   - ✅ Uses YOUR storage quota
   - ✅ No repeated authorization needed
   - ✅ Refresh tokens typically don't expire (unless you revoke access)

---

## Summary Checklist

Use this checklist to ensure you've completed all steps:

```
☐ Step 1: Create OAuth 2.0 credentials in Google Cloud Console
  ☐ Enable Google Drive API
  ☐ Configure OAuth consent screen
  ☐ Create OAuth Client ID (Web application type)
  ☐ Save Client ID and Client Secret

☐ Step 2: Obtain refresh token using OAuth Playground
  ☐ Configure OAuth Playground with your credentials
  ☐ Authorize with Google Drive API scope
  ☐ Exchange authorization code for tokens
  ☐ Copy and save the refresh token

☐ Step 3: Add environment variables to Netlify
  ☐ Add GOOGLE_OAUTH_CLIENT_ID
  ☐ Add GOOGLE_OAUTH_CLIENT_SECRET
  ☐ Add GOOGLE_OAUTH_REFRESH_TOKEN
  ☐ Keep existing Google Sheets variables
  ☐ Save changes

☐ Step 4: Deploy application
  ☐ Trigger new deployment in Netlify
  ☐ Wait for deployment to complete

☐ Step 5: Test
  ☐ Upload a photo
  ☐ Verify it appears in Google Drive
  ☐ Verify data is saved to Google Sheets
```

---

## Environment Variables Summary

After completing this setup, you should have these environment variables in Netlify:

### For Google Drive (OAuth 2.0) - NEW:
```bash
GOOGLE_OAUTH_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=GOCSPX-abcdefghijk
GOOGLE_OAUTH_REFRESH_TOKEN=1//0gPAbcDefGhiJkL...
```

### For Google Sheets (Service Account) - KEEP EXISTING:
```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
SHEET_ID=your-sheet-id
SHEET_NAME=Sites
```

### Optional:
```bash
GOOGLE_DRIVE_FOLDER_ID=folder-id-from-drive-url
VISION_API_KEY=your-vision-api-key
DEEPSEEK_API_KEY=your-deepseek-api-key
SHEETS_API_KEY=your-sheets-api-key
```

---

## Troubleshooting

### Error: "OAuth credentials not configured"

**Cause**: Missing or incorrect environment variables in Netlify

**Solutions**:
1. Verify all three OAuth variables are set in Netlify
2. Check for typos in variable names (they're case-sensitive)
3. Ensure values don't have extra spaces
4. Redeploy after adding variables

### Error: "Failed to obtain access token from refresh token"

**Cause**: Invalid or expired refresh token

**Solutions**:
1. The refresh token might be incorrect - double-check you copied it correctly
2. You may have revoked access - go through Step 2 again to get a new refresh token
3. Ensure you copied the entire refresh token (they're very long)

### Error: "The caller does not have permission"

**Cause**: OAuth scope not authorized

**Solutions**:
1. Verify you selected `https://www.googleapis.com/auth/drive.file` in OAuth Playground
2. Check that you completed the authorization flow
3. You may need to redo Step 2 to get a properly scoped refresh token

### Photos not appearing in Google Drive

**Cause**: Uploading to wrong location or permission issue

**Solutions**:
1. Check if `GOOGLE_DRIVE_FOLDER_ID` is set correctly
2. If set, verify the folder ID is correct (from the Drive URL)
3. Try removing `GOOGLE_DRIVE_FOLDER_ID` to upload to root
4. Check the Netlify function logs for detailed error messages

### Refresh token stops working

**Cause**: Access revoked or token expired (rare)

**Solutions**:
1. Go to your Google Account → Security → Third-party apps with account access
2. Check if your app is listed and has Drive access
3. If not listed or access revoked, go through Step 2 again to reauthorize

---

## Security Notes

🔒 **Security Best Practices:**

1. ✅ **Never commit credentials** to Git
2. ✅ **Store credentials only in Netlify** environment variables
3. ✅ **Use minimal scopes** - We only use `drive.file` scope (not full Drive access)
4. ✅ **Refresh tokens are long-lived** - Treat them like passwords
5. ✅ **Regular audits** - Periodically review apps with access to your Google account

**What each scope allows:**
- `https://www.googleapis.com/auth/drive.file` - Only access files created by this app (recommended)
- `https://www.googleapis.com/auth/drive` - Full Drive access (NOT used in this setup)

---

## FAQ

### Q: Do I need to reauthorize periodically?

**A:** No! Refresh tokens typically don't expire unless:
- You explicitly revoke access
- You change your Google account password (in some cases)
- The app remains unused for 6 months (Google's policy, but rare)

### Q: Can I use this with Google Workspace accounts?

**A:** Yes! The setup is similar, but:
- Use "Internal" consent screen type if your Workspace allows it
- Or use "External" and add yourself as a test user
- Follow the same steps

### Q: What if I want to change which Google account to use?

**A:** Go through Step 2 again:
1. Sign in with the different Google account in OAuth Playground
2. Get a new refresh token
3. Update `GOOGLE_OAUTH_REFRESH_TOKEN` in Netlify
4. Redeploy

### Q: Is my data secure?

**A:** Yes:
- Credentials are stored securely in Netlify environment variables
- Access tokens are generated on-demand and short-lived
- Your refresh token is never exposed to the client-side
- All communication uses HTTPS

### Q: Can I use both Service Account and OAuth together?

**A:** Yes! That's exactly what we're doing:
- **Service Account** for Google Sheets (existing, still works)
- **OAuth 2.0** for Google Drive (new method)
- They work independently and don't interfere with each other

---

## Need More Help?

If you encounter issues:

1. **Check Netlify function logs**:
   - Netlify Dashboard → Functions → drive-api
   - Look for detailed error messages

2. **Verify all environment variables**:
   - Netlify Dashboard → Site settings → Environment
   - Ensure all three OAuth variables are present

3. **Test refresh token manually**:
   - Go back to OAuth Playground
   - Paste your refresh token in the "Refresh token" field
   - Click "Refresh access token"
   - If it works there, it should work in your app

4. **Start over if needed**:
   - Revoke access in Google Account settings
   - Delete OAuth credentials in Google Cloud Console
   - Follow the guide from Step 1 again

---

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Drive API Documentation](https://developers.google.com/drive/api/guides/about-sdk)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
- [Netlify Environment Variables Documentation](https://docs.netlify.com/environment-variables/overview/)

---

**Remember**: You only need to do this setup **once**. After that, the refresh token will automatically handle authentication for all future photo uploads!
