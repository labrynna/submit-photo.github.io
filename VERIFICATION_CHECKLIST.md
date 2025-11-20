# Post-Deployment Verification Checklist

Use this checklist after merging and deploying the PR to ensure everything is working correctly.

## Pre-Deployment

- [ ] Review all changes in the Pull Request
- [ ] Merge the PR to the main branch
- [ ] Wait for Netlify to complete the deployment (check Netlify dashboard)
- [ ] Verify build logs show no errors

## Google Cloud Configuration

- [ ] Log in to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Select your project
- [ ] Navigate to **APIs & Services** → **Library**
- [ ] Search for "Google Drive API"
- [ ] Verify it shows "MANAGE" (meaning it's enabled)
  - If not, click "ENABLE"
- [ ] Navigate to **APIs & Services** → **Enabled APIs & services**
- [ ] Confirm you see:
  - ✓ Google Cloud Vision API
  - ✓ Google Sheets API
  - ✓ Google Drive API

## Netlify Environment Variables (No Changes Needed)

Verify these are still set correctly in Netlify (no new variables needed):

- [ ] `VISION_API_KEY` is set
- [ ] `DEEPSEEK_API_KEY` is set
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL` is set
- [ ] `GOOGLE_PRIVATE_KEY` is set
- [ ] `SHEET_ID` is set
- [ ] `SHEET_NAME` is set (optional, defaults to "Sites")

**Note:** The same service account credentials are now used for both Sheets AND Drive!

## Google Drive Folder Setup (Choose One)

### Option A: Use Service Account's Drive (Automatic)
- [ ] No setup needed! The application will create folders automatically.
- [ ] To access photos later, you'll need to share the service account's Drive with yourself.

### Option B: Use Your Personal Drive (Recommended)
- [ ] Open Google Drive in your browser
- [ ] Create folder: `Automation`
- [ ] Inside Automation, create subfolder: `Site Pictures`
- [ ] Right-click on the "Automation" folder
- [ ] Click "Share"
- [ ] Add your service account email (e.g., `your-sa@project.iam.gserviceaccount.com`)
- [ ] Set permission to "Editor"
- [ ] Click "Send"
- [ ] Verify the service account appears in the "Share" dialog

## Functional Testing

### Test 1: Loading Indicator
- [ ] Open your deployed application
- [ ] Upload any test photo
- [ ] Click "Analyze Photo"
- [ ] Wait for analysis to complete
- [ ] Review the form data
- [ ] **ACTION:** Click the "Save" button
- [ ] **VERIFY:** Button text changes to "Saving" with a small spinner
- [ ] **VERIFY:** Button is disabled (can't click it again)
- [ ] **VERIFY:** After save completes, button returns to "Save"

### Test 2: Google Drive Upload
- [ ] Complete Test 1 above
- [ ] Wait for the success message
- [ ] **VERIFY:** Success message mentions "Photo saved to Google Drive"
- [ ] Open Google Drive in a new tab
- [ ] Navigate to "Automation/Site Pictures" folder
- [ ] **VERIFY:** You see a new photo file
- [ ] **VERIFY:** Filename format is `DATE_ADDRESS` (e.g., `2025-11-20_123_Main_Street.jpg`)
- [ ] **VERIFY:** You can open/download the photo
- [ ] **VERIFY:** Photo matches what you uploaded

### Test 3: Google Sheets Integration (Still Works)
- [ ] After Test 2, open your Google Sheet
- [ ] **VERIFY:** New row was added or existing row was updated
- [ ] **VERIFY:** All form data is present in the correct columns
- [ ] **VERIFY:** "Picture Date" shows today's date
- [ ] **VERIFY:** "Picture taken" column shows "Yes"

### Test 4: Error Handling - Drive Failure
To test this, temporarily disable Drive API:
- [ ] Go to Google Cloud Console → APIs & Services → Google Drive API
- [ ] Click "DISABLE"
- [ ] Upload a photo and save
- [ ] **VERIFY:** Warning message about Drive failure is shown
- [ ] **VERIFY:** Data is still saved to Google Sheets
- [ ] **VERIFY:** Application doesn't crash or freeze
- [ ] Re-enable Google Drive API

### Test 5: Multiple Uploads
- [ ] Upload and save 3 different photos with different addresses
- [ ] **VERIFY:** All 3 photos appear in Google Drive
- [ ] **VERIFY:** All 3 have unique filenames based on address
- [ ] **VERIFY:** All 3 entries are in Google Sheets

### Test 6: Mobile Testing (If Applicable)
- [ ] Open application on a mobile device
- [ ] Use camera to take a photo
- [ ] Follow the upload and save process
- [ ] **VERIFY:** Loading indicator works on mobile
- [ ] **VERIFY:** Photo uploads to Drive
- [ ] **VERIFY:** Data saves to Sheets

## Performance Testing

- [ ] Upload and save a photo
- [ ] **TIME:** Note how long the save operation takes
  - Expected: 2-10 seconds depending on photo size and network
  - If longer than 30 seconds, check Netlify function logs
- [ ] Check Netlify Functions dashboard
- [ ] **VERIFY:** `drive-api` function shows successful executions
- [ ] **VERIFY:** No error logs in function logs

## Browser Compatibility

Test on at least 2 different browsers:
- [ ] Chrome/Edge: Loading indicator works correctly
- [ ] Firefox: Loading indicator works correctly
- [ ] Safari: Loading indicator works correctly (if available)

## Security Verification

- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Upload and save a photo
- [ ] Inspect network requests
- [ ] **VERIFY:** API keys are NOT visible in requests
- [ ] **VERIFY:** All requests go to `/.netlify/functions/` endpoints
- [ ] **VERIFY:** No sensitive data in URL parameters

## Troubleshooting Common Issues

### Issue: "Failed to upload photo to Google Drive"
**Check:**
- [ ] Google Drive API is enabled
- [ ] Service account credentials are correct
- [ ] Folder permissions are set (if using Option B)
- [ ] Check Netlify function logs for details

### Issue: Photos not appearing in Drive
**Check:**
- [ ] Looking in the correct Drive location
- [ ] Service account has Editor access to folder
- [ ] Folder name is exactly "Automation/Site Pictures"
- [ ] No typos in folder path

### Issue: Loading indicator not showing
**Check:**
- [ ] Clear browser cache
- [ ] Verify `config.js` includes `DRIVE_API_ENDPOINT`
- [ ] Check browser console for JavaScript errors

### Issue: Button stuck in "Saving" state
**Check:**
- [ ] Check browser console for errors
- [ ] Verify Netlify functions are responding
- [ ] Check network connectivity
- [ ] Refresh the page

## Final Verification

- [ ] Take a screenshot of successful photo upload with Drive confirmation
- [ ] Take a screenshot of Google Drive showing uploaded photos
- [ ] Take a screenshot of Google Sheets showing updated data
- [ ] Document any issues or unexpected behavior
- [ ] Update team/stakeholders that feature is live

## Rollback Plan (If Issues Found)

If critical issues are discovered:
- [ ] Revert the PR in GitHub
- [ ] Netlify will auto-deploy the previous version
- [ ] Document the issue
- [ ] Create a bug report with reproduction steps

## Success Criteria

All tests pass if:
- ✅ Loading indicator appears and disappears correctly
- ✅ Photos upload to Google Drive with correct filename format
- ✅ Photos are accessible in "Automation/Site Pictures" folder
- ✅ Google Sheets integration still works
- ✅ Error handling works gracefully
- ✅ No security vulnerabilities introduced
- ✅ Performance is acceptable (< 30 seconds per save)

## Post-Verification

- [ ] Mark this checklist as complete
- [ ] Inform users/team that feature is available
- [ ] Monitor error logs for the first 24 hours
- [ ] Gather user feedback
- [ ] Document any issues for future improvements

---

**Date Completed:** _____________

**Completed By:** _____________

**Notes/Issues:** _____________
