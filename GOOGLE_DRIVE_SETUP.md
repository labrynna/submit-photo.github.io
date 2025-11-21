# Google Drive Setup Guide for Photo Storage

This guide explains how to configure the application to automatically upload photos to Google Drive under the "Automation/Site Pictures" folder.

## Important: April 2025 Service Account Storage Change

**As of April 2025, Google changed the policy for service accounts** - they no longer have their own storage quota. This means files cannot be uploaded to the service account's Drive directly.

**Solution:** The application has been updated to use the `supportsAllDrives=true` parameter in all Google Drive API calls. This ensures that when you share a folder from your personal Google Drive with the service account, files uploaded by the service account will use **your personal account's storage quota**, not the service account's (which no longer exists).

**Key Requirements:**
1. You MUST share a folder from your personal Google Drive with the service account
2. You MUST set the `GOOGLE_DRIVE_FOLDER_ID` environment variable to point to that shared folder
3. The service account will then use your personal account's storage quota when uploading files

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

#### 2. Set Up a Folder in Your Google Drive (REQUIRED)

**Critical:** As of April 2025, service accounts no longer have storage quota. You MUST upload to a folder in your regular Google Drive that you've shared with the service account. The service account will use your personal account's storage quota.

**Step-by-step:**

1. **Create a folder in your Google Drive**
   - Open your Google Drive (the regular user account, NOT the service account)
   - Create a folder (e.g., name it "Photo Uploads" or any name you prefer)
   - You can create this folder anywhere in your Drive

2. **Share the folder with your service account**
   - Right-click on the folder you just created
   - Click "Share"
   - Add the service account email (e.g., `your-service-account@your-project.iam.gserviceaccount.com`)
   - Grant "Editor" permission
   - Click "Send"

3. **Get the folder ID**
   - Open the folder in your browser
   - Look at the URL, it should look like: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
   - Copy the `FOLDER_ID_HERE` part (the long string of letters and numbers)
   - Example: If the URL is `https://drive.google.com/drive/folders/1A2B3C4D5E6F7G8H9I0J`, then the folder ID is `1A2B3C4D5E6F7G8H9I0J`

4. **Add the folder ID to Netlify environment variables**
   - Go to your Netlify dashboard
   - Navigate to Site Settings → Build & deploy → Environment
   - Add a new environment variable:
     - **Name:** `GOOGLE_DRIVE_FOLDER_ID`
     - **Value:** The folder ID you copied (e.g., `1A2B3C4D5E6F7G8H9I0J`)
   - Save the changes

5. **Deploy your site**
   - After adding the environment variable, trigger a new deployment
   - The application will now upload photos to your specified folder
   - It will automatically create the "Automation/Site Pictures" folder structure inside your specified folder

## No Additional Environment Variables Needed (Optional)

The application can work with just your existing Netlify environment variables:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Already configured for Sheets
- `GOOGLE_PRIVATE_KEY` - Already configured for Sheets

However, **to upload to your regular Google Drive** (recommended because service accounts don't have storage quota), you should also add:
- `GOOGLE_DRIVE_FOLDER_ID` - The ID of a folder in your Google Drive that you've shared with the service account

**Why GOOGLE_DRIVE_FOLDER_ID?** Service accounts don't have storage quota. By specifying a folder ID from your regular Google Drive that you've shared with the service account, photos will be uploaded to your Drive instead of the service account's Drive (which has no storage).

These same credentials provide access to both Google Sheets and Google Drive.

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
Your Google Drive (specified folder)
└── Automation
    └── Site Pictures
        ├── 2025-11-20_123_Main_Street.jpg
        ├── 2025-11-20_456_Oak_Avenue.jpg
        └── 2025-11-21_789_Pine_Road.jpg
```

The "Automation/Site Pictures" folder structure is created automatically inside the folder you specified with `GOOGLE_DRIVE_FOLDER_ID`. If you don't specify a folder ID, the application will attempt to create the folders at the root of the service account's Drive (which will fail due to storage quota limitations).

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

### Error: "Failed to upload photo to Google Drive: Service Accounts do not have storage quota"

**Possible causes and solutions:**

1. **Service account has no storage quota (April 2025 policy change)**
   - **Cause**: As of April 2025, Google removed storage quota from service accounts
   - **Solution**: The application code has been updated to use `supportsAllDrives=true` parameter
   - **Requirements**:
     - You MUST specify a folder in your regular Google Drive
     - Add `GOOGLE_DRIVE_FOLDER_ID` environment variable in Netlify with the folder ID from your Drive
     - Share that folder with the service account email with Editor permission
     - Redeploy your application with the latest code
     - The service account will then use your personal account's storage quota
   - See "Set Up a Folder in Your Google Drive" section above for detailed steps

2. **Google Drive API not enabled**
   - Go to Google Cloud Console → APIs & Services → Library
   - Search for "Google Drive API" and enable it

3. **Service account credentials incorrect**
   - Verify `GOOGLE_SERVICE_ACCOUNT_EMAIL` is set correctly in Netlify
   - Verify `GOOGLE_PRIVATE_KEY` is set correctly (including BEGIN/END lines)
   - Check for any extra spaces or formatting issues

4. **Permission denied**
   - Ensure the folder specified in `GOOGLE_DRIVE_FOLDER_ID` is shared with your service account
   - The service account email must have Editor access to the folder
   - Verify you're using the correct folder ID
   - **For Google Workspace users**: Consider enabling domain-wide delegation (see below)

5. **Google Workspace users: Alternative solution with domain-wide delegation**
   - If you're using Google Workspace (not personal Gmail), you can enable domain-wide delegation
   - This allows the service account to impersonate a specific user in your organization
   - See [DOMAIN_WIDE_DELEGATION_SETUP.md](DOMAIN_WIDE_DELEGATION_SETUP.md) for complete setup
   - Requires Super Admin access to Google Workspace Admin Console
   - Add `GOOGLE_IMPERSONATE_USER_EMAIL` environment variable with a user email from your domain
   - This can resolve many permission and access issues in Google Workspace environments

5. **Quota exceeded**
   - Check your Google Cloud project quotas
   - Google Drive API has daily limits that may need to be increased

6. **For Google Workspace users: Consider domain-wide delegation**
   - If you're using Google Workspace and experiencing persistent issues
   - Domain-wide delegation allows the service account to act as a specific user
   - See [DOMAIN_WIDE_DELEGATION_SETUP.md](DOMAIN_WIDE_DELEGATION_SETUP.md) for setup instructions
   - This can help resolve complex permission scenarios in enterprise environments

### Warning: "Failed to upload photo to Google Drive. Data will still be saved to Sheets."

The application is designed to be resilient. If the Drive upload fails, it will:
- Continue and save the data to Google Sheets
- Show a warning message
- Allow the user to retry or continue

This ensures that even if Drive has issues, the form data is not lost.

### Photo not appearing in Drive

1. **Check if GOOGLE_DRIVE_FOLDER_ID is set**
   - Verify the `GOOGLE_DRIVE_FOLDER_ID` environment variable is set in Netlify
   - If not set, the upload will fail because service accounts have no storage quota
   - Add the environment variable and redeploy

2. **Check the correct folder in your Drive**
   - Photos will appear inside the folder you specified with `GOOGLE_DRIVE_FOLDER_ID`
   - Look for the "Automation/Site Pictures" folder structure inside that folder
   - The folder structure is created automatically on the first upload

3. **Verify folder permissions**
   - Ensure the service account has Editor access to the folder
   - Check that the folder exists and is not deleted
   - Make sure you're using the correct folder ID from the URL

4. **Check Netlify function logs**
   - Go to Netlify dashboard → Functions
   - Click on "drive-api" function
   - Review the logs for detailed error messages

## Accessing Uploaded Photos

### Simple Method: Check Your Drive

1. Open your Google Drive in a web browser
2. Navigate to the folder you specified in `GOOGLE_DRIVE_FOLDER_ID`
3. You'll see the "Automation/Site Pictures" folder structure created inside
4. All uploaded photos will be there with the filename format: `DATE_ADDRESS`

### Tips for Organization

1. **Create a shortcut**: You can create a shortcut to the "Automation/Site Pictures" folder in your Drive's main view for easy access
2. **Share with team**: You can share the parent folder with your team members to give them access to uploaded photos
3. **Set up folder notifications**: In Google Drive, you can enable notifications for when new files are added to the folder

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
☐ Created a folder in your regular Google Drive
☐ Copied the folder ID from the Drive URL
☐ Added GOOGLE_DRIVE_FOLDER_ID environment variable in Netlify
☐ Shared the folder with service account email (Editor permission)
☐ Service account credentials (GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY) are set in Netlify
☐ Deployed the updated application code to Netlify (includes supportsAllDrives fix)
☐ Tested uploading a photo and verified it appears in the correct folder in your Drive
☐ Checked that the filename format is DATE_ADDRESS
☐ Verified photos are in "Automation/Site Pictures" folder inside your specified folder
☐ Confirmed Google Sheets data save still works correctly
```

## Technical Details: How the Fix Works

### The April 2025 Service Account Change

In April 2025, Google changed the policy for service accounts, removing their storage quota entirely. This means:

- **Before April 2025**: Service accounts had their own limited storage quota
- **After April 2025**: Service accounts have no storage quota at all

### The Solution: supportsAllDrives Parameter

The application code has been updated to include the `supportsAllDrives=true` parameter in all Google Drive API calls:

1. **Folder Search**: `supportsAllDrives=true&includeItemsFromAllDrives=true`
   - Allows the service account to search for folders in shared drives and folders
   - Ensures folders created in your personal Drive are visible to the service account

2. **Folder Creation**: `supportsAllDrives=true`
   - When creating folders, uses the storage quota of the folder owner (your personal account)
   - Not the service account's quota (which doesn't exist)

3. **File Upload**: `supportsAllDrives=true`
   - When uploading files, uses the storage quota of the folder owner (your personal account)
   - Ensures files are stored using your personal account's storage, not the service account's

### How Storage Quota Works

When you share a folder from your personal Google Drive with the service account:

1. **Ownership**: You (your personal account) remain the owner of the folder
2. **Storage Quota**: Files uploaded by the service account use YOUR storage quota
3. **Access**: The service account has Editor permission to create folders and upload files
4. **Result**: Photos are stored in your personal Drive, using your storage, accessible to you

This is exactly what you need - the service account acts as an automated agent that uploads files on your behalf, but the files are stored in your Drive using your storage quota.

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
