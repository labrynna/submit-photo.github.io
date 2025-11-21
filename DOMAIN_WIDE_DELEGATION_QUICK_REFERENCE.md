# Domain-Wide Delegation Quick Reference

## Summary

I've implemented support for domain-wide delegation with user impersonation to help fix Google Drive upload issues. This feature allows the service account to act on behalf of a specific user in your Google Workspace organization.

## Do I Need This?

**You NEED domain-wide delegation if:**
- ✅ You're using Google Workspace (not personal Gmail)
- ✅ Google Drive uploads are failing with permission errors
- ✅ You have Super Admin access to Google Workspace Admin Console

**You DON'T need domain-wide delegation if:**
- ❌ You're using a personal Gmail account (not Google Workspace)
- ❌ Google Drive uploads are working fine with the shared folder approach
- ❌ You haven't set up Google Workspace for your organization

## What Information Do You Need from Me?

### Required from You (if using domain-wide delegation):

1. **Service Account Client ID**
   - Location: Google Cloud Console → IAM & Admin → Service Accounts → Click on your service account
   - Looks like: `123456789012345678901`
   - You'll need this to authorize in Google Workspace Admin Console

2. **User Email to Impersonate**
   - This should be an email address from your Google Workspace domain
   - Example: `admin@yourdomain.com` or `your-email@yourdomain.com`
   - This user should have:
     - Access to your Google Drive folder
     - Access to your Google Sheet
     - Sufficient storage quota for uploaded photos
   - This will be set as the `GOOGLE_IMPERSONATE_USER_EMAIL` environment variable

## What Do You Need to Add to Netlify Environment Variables?

Add this ONE new environment variable in Netlify:

```
GOOGLE_IMPERSONATE_USER_EMAIL=admin@yourdomain.com
```

**Where to add it:**
1. Go to Netlify dashboard
2. Navigate to: Site settings → Build & deploy → Environment → Environment variables
3. Click "Add variable"
4. Enter:
   - **Key**: `GOOGLE_IMPERSONATE_USER_EMAIL`
   - **Value**: Your chosen user email (e.g., `admin@yourdomain.com`)
5. Save and redeploy

## Setup Steps Overview

### Step 1: Enable Domain-Wide Delegation in Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to IAM & Admin → Service Accounts
3. Click on your service account
4. Enable "Google Workspace Domain-wide Delegation"
5. Copy the Client ID shown

### Step 2: Authorize in Google Workspace Admin Console
1. Go to [Google Workspace Admin Console](https://admin.google.com/) (requires Super Admin)
2. Navigate to Security → API controls → Domain-wide delegation
3. Click "Add new"
4. Enter your service account's Client ID
5. Add these OAuth scopes:
   ```
   https://www.googleapis.com/auth/drive.file,https://www.googleapis.com/auth/spreadsheets
   ```
6. Click "Authorize"

### Step 3: Add Environment Variable in Netlify
1. Add `GOOGLE_IMPERSONATE_USER_EMAIL` with your chosen user email
2. Redeploy your application

### Step 4: Verify It's Working
1. Upload a photo in your application
2. Check Netlify function logs for: "Using domain-wide delegation to impersonate: your-email@yourdomain.com"
3. Check Google Drive - files should be owned by the impersonated user

## Complete Documentation

For detailed step-by-step instructions with screenshots and troubleshooting, see:
- **[DOMAIN_WIDE_DELEGATION_SETUP.md](DOMAIN_WIDE_DELEGATION_SETUP.md)** - Complete setup guide
- **[ENVIRONMENT_VARIABLES_LIST.md](ENVIRONMENT_VARIABLES_LIST.md)** - All environment variables
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

## Key Points

✅ **Backward Compatible**: Existing setups will continue to work without changes
✅ **Optional Feature**: Only needed for Google Workspace users with permission issues
✅ **No Code Changes Needed**: Just add the environment variable and configure Google Workspace
✅ **Works for Both**: Supports both Google Drive and Google Sheets APIs

## Questions to Ask Yourself

1. **Am I using Google Workspace or personal Gmail?**
   - Google Workspace → Consider using domain-wide delegation
   - Personal Gmail → Use the shared folder approach (no impersonation needed)

2. **Do I have Super Admin access to Google Workspace Admin Console?**
   - Yes → You can set this up yourself
   - No → You'll need help from your Google Workspace administrator

3. **Is the current setup working?**
   - Yes → You don't need to change anything
   - No, getting permission errors → Try domain-wide delegation

4. **Which user should I impersonate?**
   - Recommendation: Your own admin account or a dedicated service user
   - Requirements: Must exist in your domain, must have access to Drive/Sheets

## Example Scenario

**Company:** Acme Construction (using Google Workspace at acme.com)
**Admin:** john@acme.com
**Issue:** Service account can't upload to Google Drive

**Solution:**
1. Enable domain-wide delegation for service account
2. Authorize in Google Workspace Admin Console (John does this as Super Admin)
3. Add environment variable: `GOOGLE_IMPERSONATE_USER_EMAIL=john@acme.com`
4. Deploy
5. Now uploads work - files are created as if john@acme.com uploaded them

## Need Help?

1. Start with [DOMAIN_WIDE_DELEGATION_SETUP.md](DOMAIN_WIDE_DELEGATION_SETUP.md) for complete instructions
2. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
3. Verify your Google Workspace Admin Console settings
4. Check Netlify function logs for error messages

---

**Remember:** This is an optional feature. If your current setup is working, you don't need to enable domain-wide delegation. This is specifically for Google Workspace users experiencing permission issues with Google Drive uploads.
