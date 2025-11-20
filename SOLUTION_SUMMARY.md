# Solution: Fix "Service Accounts do not have storage quota" Error

## Problem You Encountered
You received this error when trying to upload photos to Google Drive:
```
Warning: Failed to upload photo to Google Drive: Failed to upload file: 
Service Accounts do not have storage quota. Leverage shared drives or use 
OAuth delegation instead.
```

**Good News:** The Google Sheets integration continued to work correctly! This is by design - the application doesn't let Drive failures block your data from being saved.

## Root Cause
Service accounts in Google don't have storage quota. When the application tried to create folders and upload files to the service account's Drive (at 'root'), it failed because there's no storage available.

## The Solution
Upload photos to a folder in **your regular Google Drive** that you've shared with the service account. This is what you already suspected would work!

## Step-by-Step Setup

### 1. Create and Share a Folder
1. Open your Google Drive (your regular user account)
2. Create a new folder anywhere (e.g., "Photo Uploads" or "Site Photos")
3. Right-click on the folder → Click "Share"
4. Add your service account email (this should already be familiar from the Sheets setup)
   - Example: `your-service-account@your-project.iam.gserviceaccount.com`
5. Grant **"Editor"** permission
6. Click "Send"

### 2. Get the Folder ID
1. Open the folder you just created in your browser
2. Look at the URL in your address bar
3. Copy the folder ID from the URL

**Example URL:**
```
https://drive.google.com/drive/folders/1A2B3C4D5E6F7G8H9I0J
                                        ↑ This is your folder ID ↑
```

### 3. Add the Folder ID to Netlify
1. Go to your Netlify dashboard
2. Select your site
3. Navigate to: **Site Settings** → **Build & deploy** → **Environment**
4. Click **"Add variable"** or **"Edit variables"**
5. Add a new environment variable:
   - **Variable name:** `GOOGLE_DRIVE_FOLDER_ID`
   - **Variable value:** The folder ID you copied (e.g., `1A2B3C4D5E6F7G8H9I0J`)
6. Click **"Save"**

### 4. Deploy
1. After saving the environment variable, trigger a new deployment
2. You can do this by clicking "Trigger deploy" → "Deploy site" in Netlify
3. Or just push a new commit to your repository

### 5. Test
1. Open your application
2. Upload a construction site photo
3. Click "Analyze Photo"
4. Review the data and click "Save"
5. Check your Google Drive folder - you should see the "Automation/Site Pictures" folder structure created inside
6. The uploaded photo should be there with the format: `DATE_ADDRESS.jpg`

## What Happens Now?
- The application will create an "Automation/Site Pictures" folder structure **inside** the folder you specified
- All photos will be uploaded to your Drive (not the service account's Drive)
- Photos will be named: `2025-11-20_123_Main_Street.jpg` (DATE_ADDRESS format)
- You'll have full access to the photos in your Drive
- You can share the folder with your team if needed

## Folder Structure
```
Your Google Drive
└── [Your Specified Folder] (e.g., "Photo Uploads")
    └── Automation
        └── Site Pictures
            ├── 2025-11-20_123_Main_Street.jpg
            ├── 2025-11-20_456_Oak_Avenue.jpg
            └── 2025-11-21_789_Pine_Road.jpg
```

## Additional Resources
- **Complete Setup Guide:** See [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md)
- **Environment Variables:** See [NETLIFY_ENVIRONMENT_VARIABLES.md](NETLIFY_ENVIRONMENT_VARIABLES.md)
- **Troubleshooting:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## Questions & Answers

**Q: Do I need to create the "Automation/Site Pictures" folders manually?**
A: No! The application will create them automatically inside your specified folder on the first upload.

**Q: Can I use an existing folder that already has files?**
A: Yes! The application will create the "Automation/Site Pictures" subfolders inside it.

**Q: What if I forget to set GOOGLE_DRIVE_FOLDER_ID?**
A: The upload will fail with the storage quota error, but your data will still be saved to Google Sheets. You can add the folder ID later and the next uploads will work.

**Q: Can I change the folder later?**
A: Yes! Just update the `GOOGLE_DRIVE_FOLDER_ID` environment variable in Netlify and redeploy. Future uploads will go to the new folder.

**Q: Will this affect my Google Sheets integration?**
A: No! The Sheets integration uses the same service account credentials and will continue working exactly as before.

---

**That's it!** This simple change will fix the storage quota error and allow photos to be uploaded to your Drive. The solution is exactly what you suspected - using your regular user's Drive instead of the service account's Drive.
