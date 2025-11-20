# Setup Guide: Google Drive Photo Upload Feature

## Summary of Changes

This PR implements two key features requested in the issue:

1. **Loading Indicator on Save Button**: Shows "Saving..." with a spinner while the save operation is in progress
2. **Automatic Photo Upload to Google Drive**: Photos are automatically saved to Google Drive under "Automation/Site Pictures" folder with filename format `DATE_ADDRESS`

## Can I Reuse My Existing Service Account?

**YES!** ✅ The same service account credentials that you already have configured for Google Sheets can be used for Google Drive access.

**What you already have:**
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` (configured in Netlify)
- `GOOGLE_PRIVATE_KEY` (configured in Netlify)

**What you need to do:**
1. Enable Google Drive API in your Google Cloud Console
2. (Optional) Share a Drive folder with the service account if you want to use a specific folder

**No new credentials needed!** The application will automatically use your existing service account for both Sheets and Drive access.

## Step-by-Step Setup Instructions

### Step 1: Enable Google Drive API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (the same one you're using for Sheets API)
3. Navigate to **APIs & Services** → **Library**
4. Search for **"Google Drive API"**
5. Click on it and click **"Enable"**

That's it! The API is now enabled.

### Step 2: Choose Your Photo Storage Option

You have two options for where photos will be stored:

#### Option A: Use Service Account's Own Drive (Simplest)
- **No additional setup required**
- The application will automatically create the "Automation/Site Pictures" folder in the service account's Drive
- To access the photos, you'll need to either:
  - Share the service account's Drive with your Google account, OR
  - Use the Google Drive API to access files programmatically

#### Option B: Use a Folder in Your Personal Google Drive (Recommended)
1. Create a folder structure in your Google Drive: `Automation` → `Site Pictures`
2. Right-click on the **"Automation"** folder
3. Click **"Share"**
4. Add your service account email:
   - Example: `your-service-account@your-project.iam.gserviceaccount.com`
   - This is the same email you used when sharing your Google Sheet
5. Grant **"Editor"** permission
6. Click **"Send"** (you can uncheck "Notify people")

Now photos will be saved to this folder in your Drive, and you can easily access them!

### Step 3: Deploy the Updated Code

1. Merge this PR to your main branch
2. Netlify will automatically rebuild and deploy the changes
3. Wait for the deployment to complete (usually 1-2 minutes)

### Step 4: Test the Feature

1. Open your deployed application
2. Upload a construction site photo
3. Click "Analyze Photo"
4. Review the extracted information
5. Click **"Save"**
6. **Observe**: The button should show "Saving..." with a small spinner
7. **Wait**: For the success confirmation message
8. **Check**: Your Google Drive for the uploaded photo
   - Look in "Automation/Site Pictures" folder
   - Filename will be in format: `2025-11-20_123_Main_Street.jpg`

## How to Access Uploaded Photos

### If You Used Option B (Personal Drive):
Simply navigate to `Automation/Site Pictures` in your Google Drive. All uploaded photos will be there!

### If You Used Option A (Service Account Drive):
1. Go to Google Drive
2. Click "Shared with me" in the left sidebar
3. Look for items shared by the service account
4. Or use Google Drive API to programmatically access the files

## Filename Format

Photos are named using the format: `DATE_ADDRESS`

**Examples:**
- Address: `123 Main Street, San Francisco`
- Date: `2025-11-20`
- **Filename**: `2025-11-20_123_Main_Street_San_Francisco.jpg`

All non-alphanumeric characters (spaces, commas, etc.) are replaced with underscores for file system compatibility.

## Features

### Loading Indicator
- When user clicks "Save", the button shows "Saving..." with a spinner
- Button is disabled to prevent double-submission
- Button returns to "Save" after operation completes

### Error Handling
- If Drive upload fails, the application will:
  - Show a warning message
  - Continue and save data to Google Sheets
  - Not lose any form data
- This ensures reliability even if Drive has temporary issues

### Success Messages
- If photo uploads successfully: "Site updated successfully! Photo saved to Google Drive."
- If photo upload fails: "Warning: Failed to upload photo to Google Drive: [error]. Data will still be saved to Sheets."

## Troubleshooting

### "Failed to upload photo to Google Drive"

**Check these:**
1. Google Drive API is enabled in Google Cloud Console
2. Service account credentials are correct in Netlify
3. If using personal Drive folder, service account has Editor access

### Photo not appearing in Drive

**Check these:**
1. Look in the correct location (service account's Drive vs. personal Drive)
2. Verify folder permissions
3. Check Netlify function logs for detailed errors:
   - Go to Netlify dashboard → Functions
   - Click on "drive-api" function
   - Review the logs

### Still having issues?

1. Check the [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md) file for detailed troubleshooting
2. Review Netlify function logs for specific error messages
3. Verify all environment variables are set correctly
4. Ensure Google Drive API quotas are not exceeded

## Security Notes

✅ Photos are uploaded using secure service account authentication  
✅ No API keys are exposed to the client-side  
✅ All uploads go through secure Netlify Functions  
✅ Service account credentials are stored securely in Netlify environment variables  
🔒 Recommended: Regularly review files in the Drive folder  
🔒 Recommended: Set up alerts for unusual API activity in Google Cloud Console  

## What Files Were Changed?

1. **app.js** - Added loading indicator and Drive upload functionality
2. **netlify/functions/drive-api.js** - New serverless function for Drive uploads
3. **styles.css** - Added spinner-small CSS class for inline loading
4. **generate-config.js** - Added Drive API endpoint to config
5. **index.html** - Added ID to Save button
6. **netlify/functions/sheets-api.js** - Added Drive API scope
7. **Documentation files** - Updated to include Drive setup instructions

## Additional Resources

- [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md) - Comprehensive Drive setup guide
- [SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md) - Service account creation guide
- [NETLIFY_ENVIRONMENT_VARIABLES.md](NETLIFY_ENVIRONMENT_VARIABLES.md) - Environment variables reference

## Summary Checklist

Use this checklist to ensure everything is set up correctly:

```
☐ Google Drive API is enabled in Google Cloud Console
☐ Service account credentials (GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY) are already set in Netlify
☐ (Optional) Created "Automation/Site Pictures" folder in personal Drive
☐ (Optional) Shared folder with service account email (Editor permission)
☐ Merged and deployed the updated code to Netlify
☐ Tested uploading a photo and clicking "Save"
☐ Confirmed loading spinner appears on Save button
☐ Verified photo appears in Google Drive with correct filename format
☐ Confirmed Google Sheets data save still works correctly
```

---

**Questions?** Check the documentation files or review the Netlify function logs for detailed error messages.
