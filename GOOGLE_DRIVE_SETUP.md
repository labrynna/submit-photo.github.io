# Google Drive Setup Guide for Photo Storage

This guide explains how to configure the application to automatically upload photos to Google Drive under the "Automation/Site Pictures" folder.

## Overview

When users click "Save" after uploading a construction site photo, the application will:
1. Show a loading indicator on the Save button
2. Upload the photo to Google Drive in the folder "Automation/Site Pictures"
3. Name the file using the format: `DATE_ADDRESS` (e.g., `2025-11-20_123_Main_Street.jpg`)
4. Save the extracted data to Google Sheets

## Using Your Existing Service Account

**Good news!** The same service account that you already configured for Google Sheets access can be used for Google Drive access. You don't need to create a new service account.

### What You Need to Do

The application has been updated to use the existing `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` environment variables that are already configured in Netlify. However, you need to ensure the following:

#### 1. Enable Google Drive API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (the same one you used for Sheets API)
3. Navigate to **APIs & Services** → **Library**
4. Search for **"Google Drive API"**
5. Click on it and click **"Enable"**

#### 2. Grant Drive Access to Service Account (if using a shared Drive)

If you want to save photos to a specific Google Drive folder that you own:

**Option A: No additional setup needed**
- The service account will automatically create the "Automation/Site Pictures" folder in its own Drive
- You can access this by sharing the service account's Drive with your Google account
- OR you can grant the service account access to a specific folder in your Drive

**Option B: Use a folder in your Google Drive**
1. Create the folder structure in your Google Drive: `Automation` → `Site Pictures`
2. Right-click on the "Automation" folder
3. Click "Share"
4. Add the service account email (e.g., `your-service-account@your-project.iam.gserviceaccount.com`)
5. Grant "Editor" permission
6. Click "Send"

## No Additional Environment Variables Needed

The application automatically uses your existing Netlify environment variables:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Already configured for Sheets
- `GOOGLE_PRIVATE_KEY` - Already configured for Sheets

These same credentials now provide access to both Google Sheets and Google Drive.

## How It Works

### File Naming Convention

Photos are saved with the filename format: `DATE_ADDRESS`

Example:
- **Date**: 2025-11-20
- **Address**: 123 Main Street, San Francisco
- **Filename**: `2025-11-20_123_Main_Street_San_Francisco.jpg`

All non-alphanumeric characters in the address are replaced with underscores for file system compatibility.

### Folder Structure

Photos are automatically organized in Google Drive:
```
Google Drive (Service Account)
└── Automation
    └── Site Pictures
        ├── 2025-11-20_123_Main_Street.jpg
        ├── 2025-11-20_456_Oak_Avenue.jpg
        └── 2025-11-21_789_Pine_Road.jpg
```

The folders are created automatically if they don't exist.

### Loading Indicator

When the user clicks "Save":
1. The button text changes to "Saving" with a small spinning loader
2. The button is disabled to prevent double-submission
3. The photo is uploaded to Google Drive
4. The data is saved to Google Sheets
5. The button is re-enabled and restored to "Save"
6. Success or error message is displayed

## Testing the Setup

After deploying the updated application:

1. Open your application
2. Upload a construction site photo
3. Click "Analyze Photo"
4. Review and edit the extracted information
5. Click "Save"
6. **Observe**: The button should show "Saving" with a spinner
7. **Wait**: For the confirmation message
8. **Check**: Your Google Drive for the uploaded photo in "Automation/Site Pictures"

## Troubleshooting

### Error: "Failed to upload photo to Google Drive"

**Possible causes and solutions:**

1. **Google Drive API not enabled**
   - Go to Google Cloud Console → APIs & Services → Library
   - Search for "Google Drive API" and enable it

2. **Service account credentials incorrect**
   - Verify `GOOGLE_SERVICE_ACCOUNT_EMAIL` is set correctly in Netlify
   - Verify `GOOGLE_PRIVATE_KEY` is set correctly (including BEGIN/END lines)
   - Check for any extra spaces or formatting issues

3. **Permission denied**
   - If using a folder in your personal Drive, ensure the service account has Editor access
   - The service account email should be shared on the folder

4. **Quota exceeded**
   - Check your Google Cloud project quotas
   - Google Drive API has daily limits that may need to be increased

### Warning: "Failed to upload photo to Google Drive. Data will still be saved to Sheets."

The application is designed to be resilient. If the Drive upload fails, it will:
- Continue and save the data to Google Sheets
- Show a warning message
- Allow the user to retry or continue

This ensures that even if Drive has issues, the form data is not lost.

### Photo not appearing in Drive

1. **Check the service account's Drive**
   - The folder is created in the service account's Drive, not yours
   - Share the service account's Drive with your Google account to access it
   - OR configure a shared folder as described in "Grant Drive Access to Service Account"

2. **Verify folder permissions**
   - Ensure the service account has write access to the folder
   - Check that the folder exists and is not deleted

3. **Check Netlify function logs**
   - Go to Netlify dashboard → Functions
   - Click on "drive-api" function
   - Review the logs for detailed error messages

## Accessing Uploaded Photos

### Method 1: Through Service Account Drive

1. In Google Drive, click "Shared with me"
2. Look for items shared by the service account email
3. Or navigate to the "Automation/Site Pictures" folder if you set up folder sharing

### Method 2: Share Service Account Drive with Yourself

1. Have the service account share its entire Drive with your Google account
2. You'll see all folders including "Automation/Site Pictures"
3. You can add shortcuts to this folder to your Drive for easy access

### Method 3: Use Drive API to List Files

You can use the Google Drive API to programmatically list and access files uploaded by the service account.

## Security Notes

- ✅ Photos are uploaded using secure service account authentication
- ✅ No API keys are exposed to the client-side
- ✅ All uploads go through secure Netlify Functions
- ✅ Service account credentials are stored securely in Netlify environment variables
- 🔒 Recommended: Regularly review files in the Drive folder
- 🔒 Recommended: Set up alerts for unusual API activity in Google Cloud Console

## Summary Checklist

Use this checklist to ensure Google Drive photo uploads are working:

```
☐ Google Drive API is enabled in Google Cloud Console
☐ Service account credentials (GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY) are set in Netlify
☐ If using a folder in personal Drive, service account has Editor access to the folder
☐ Deployed the updated application code to Netlify
☐ Tested uploading a photo and verified it appears in Drive
☐ Checked that the filename format is DATE_ADDRESS
☐ Verified photos are in "Automation/Site Pictures" folder
☐ Confirmed Google Sheets data save still works correctly
```

## Additional Resources

- [Google Drive API Documentation](https://developers.google.com/drive/api/v3/about-sdk)
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md) - Detailed service account setup guide

## Need Help?

If you encounter issues:
1. Check the Netlify function logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure Google Drive API is enabled
4. Review the service account permissions
5. Check Google Cloud Console quotas and limits

---

**Note**: The same service account that provides Google Sheets access now also provides Google Drive access. No additional credentials are needed!
