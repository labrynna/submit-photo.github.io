# Domain-Wide Delegation Setup Guide

This guide explains how to configure domain-wide delegation for the Google Drive and Sheets integration. Domain-wide delegation allows the service account to impersonate a specific user in your Google Workspace organization, which can help resolve permission and access issues.

## When to Use Domain-Wide Delegation

**Use domain-wide delegation if:**
- You're using Google Workspace (formerly G Suite) for your organization
- You're experiencing permission issues with Google Drive uploads
- You want the service account to act on behalf of a specific user
- You need to access resources owned by a specific user in your organization

**You DON'T need domain-wide delegation if:**
- You're using a personal Google account (not Google Workspace)
- The current shared folder approach is working fine
- You haven't enabled Google Workspace in your organization

## Overview

Domain-wide delegation allows a service account to impersonate (act on behalf of) any user in your Google Workspace domain. When configured:
- The service account acts as if it were the specified user
- Files are created with that user as the owner
- Permissions and quotas are based on the impersonated user's account
- The service account needs domain-wide delegation enabled in the Google Workspace Admin Console

## Prerequisites

Before you begin, ensure you have:
1. **Google Workspace account** (not a free Gmail account)
2. **Super Administrator access** to your Google Workspace Admin Console
3. **Service account already created** (see [SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md))
4. The **Client ID** of your service account (found in the JSON key file or Google Cloud Console)

## Step 1: Enable Domain-Wide Delegation for Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **IAM & Admin** → **Service Accounts**
4. Find your service account and click on it
5. Click on **"Show Domain-Wide Delegation"** (or the **"Details"** tab)
6. Check the box **"Enable Google Workspace Domain-wide Delegation"**
7. If prompted, enter a **Product name** (e.g., "Construction Site Photo App")
8. Click **"Save"**
9. **Important:** Copy the **Client ID** shown on this page - you'll need it in the next step

## Step 2: Authorize API Scopes in Google Workspace Admin Console

Now you need to authorize the service account to access specific Google APIs on behalf of users in your domain.

1. Go to [Google Workspace Admin Console](https://admin.google.com/)
2. Navigate to **Security** → **Access and data control** → **API controls**
3. Scroll down to **Domain-wide delegation**
4. Click **"Manage Domain-Wide Delegation"**
5. Click **"Add new"**
6. Enter the **Client ID** of your service account (from Step 1)
7. In the **OAuth scopes** field, enter the following scopes (comma-separated):
   ```
   https://www.googleapis.com/auth/drive.file,https://www.googleapis.com/auth/spreadsheets
   ```
8. Click **"Authorize"**

### Required OAuth Scopes Explained

- `https://www.googleapis.com/auth/drive.file` - Allows the app to create and manage files in Google Drive
- `https://www.googleapis.com/auth/spreadsheets` - Allows the app to read and write to Google Sheets

**Note:** These are the same scopes the service account already uses, but now it can use them while impersonating users.

## Step 3: Configure Netlify Environment Variable

Add the following environment variable to your Netlify site:

1. Go to your Netlify dashboard
2. Navigate to **Site settings** → **Build & deploy** → **Environment**
3. Click **"Edit variables"** or **"Add variable"**
4. Add a new environment variable:

| Variable Name | Value | Example |
|---------------|-------|---------|
| `GOOGLE_IMPERSONATE_USER_EMAIL` | The email of the user to impersonate | `admin@yourdomain.com` |

**Important:** Choose a user email that:
- Exists in your Google Workspace domain
- Has appropriate permissions to create files in Google Drive
- Has access to the Google Sheet you're using
- Is an active account (not suspended or deleted)

### Which User Should I Impersonate?

**Recommended:** Use your own admin account or a dedicated service user account.

**Considerations:**
- **Storage quota:** Files created will count against the impersonated user's quota
- **Ownership:** Files will be owned by the impersonated user
- **Permissions:** The user must have access to shared resources (Drive folders, Sheets)
- **Security:** This user's permissions will be used for all API operations

**Example:** If you set `GOOGLE_IMPERSONATE_USER_EMAIL=admin@company.com`, then:
- All Google Drive uploads will be created as if `admin@company.com` uploaded them
- All Google Sheets operations will be performed as `admin@company.com`
- Files will count against `admin@company.com`'s storage quota

## Step 4: Deploy Your Application

1. After adding the environment variable, save your changes in Netlify
2. Trigger a new deployment (or just commit and push changes)
3. Wait for the build to complete
4. Your application will now use domain-wide delegation to impersonate the specified user

## Step 5: Verify It's Working

To verify domain-wide delegation is working:

1. Open your application
2. Upload a photo and click "Save"
3. Check the Netlify function logs:
   - Go to Netlify dashboard → **Functions**
   - Click on **drive-api** or **sheets-api**
   - Look for the log message: `Using domain-wide delegation to impersonate: user@yourdomain.com`
4. Check Google Drive:
   - Files should be created and owned by the impersonated user
   - Check the file's owner by right-clicking → "View details"

## Troubleshooting

### Error: "delegation denied for <service_account_email>"

**Cause:** The service account doesn't have domain-wide delegation authorized in the Admin Console.

**Solutions:**
1. Verify you completed Step 2 (Authorize API Scopes in Admin Console)
2. Double-check the Client ID matches your service account
3. Ensure you clicked "Authorize" and saved changes
4. Wait 5-10 minutes for changes to propagate
5. Try again

### Error: "Not Authorized to access this resource/api"

**Cause:** The OAuth scopes weren't properly authorized in the Admin Console.

**Solutions:**
1. Go back to Google Workspace Admin Console → Domain-wide delegation
2. Find your service account's Client ID
3. Verify the scopes include both:
   - `https://www.googleapis.com/auth/drive.file`
   - `https://www.googleapis.com/auth/spreadsheets`
4. If scopes are missing or incorrect, edit and update them
5. Click "Authorize" again
6. Wait a few minutes and retry

### Error: "User does not exist" or "Invalid impersonation"

**Cause:** The email address in `GOOGLE_IMPERSONATE_USER_EMAIL` doesn't exist or is invalid.

**Solutions:**
1. Verify the email address is correct and has no typos
2. Ensure the user exists in your Google Workspace domain
3. Check that the user account is active (not suspended)
4. Make sure you're using the full email (e.g., `user@yourdomain.com`, not just `user`)

### Error: "Insufficient permissions"

**Cause:** The impersonated user doesn't have necessary permissions.

**Solutions:**
1. Ensure the impersonated user has access to:
   - The Google Drive folder (if using `GOOGLE_DRIVE_FOLDER_ID`)
   - The Google Sheet (must be shared with the user)
2. Grant the user "Editor" permissions on these resources
3. Use an admin account if possible

### "Domain-wide delegation is not enabled for this service account"

**Cause:** You skipped Step 1 or the setting wasn't saved.

**Solutions:**
1. Go back to Google Cloud Console
2. Navigate to your service account
3. Click "Show Domain-Wide Delegation" or "Details"
4. Check the box "Enable Google Workspace Domain-wide Delegation"
5. Save changes
6. Wait 5 minutes and try again

## Security Considerations

⚠️ **Important Security Notes:**

1. **Powerful permission:** Domain-wide delegation gives the service account the ability to act as ANY user in your domain for the authorized scopes
2. **Protect credentials:** Keep your service account JSON key secure - anyone with it can impersonate users
3. **Limit scopes:** Only authorize the minimum required OAuth scopes
4. **Use dedicated account:** Consider creating a dedicated user account for the service account to impersonate
5. **Audit regularly:** Monitor the service account's activity in Google Workspace Admin Console
6. **Rotate keys:** Regularly rotate service account keys (every 90 days recommended)
7. **Restrict by IP:** If possible, restrict API access by IP address in Google Cloud Console

## Comparison: Shared Folder vs Domain-Wide Delegation

| Feature | Shared Folder Approach | Domain-Wide Delegation |
|---------|------------------------|------------------------|
| **Google Account Type** | Works with personal Gmail | Requires Google Workspace |
| **Setup Complexity** | Simple | More complex |
| **Admin Rights Needed** | No | Yes (Super Admin) |
| **File Ownership** | Service account or folder owner | Impersonated user |
| **Storage Quota** | Folder owner's quota | Impersonated user's quota |
| **Permission Model** | Share folder with service account | Service account acts as user |
| **Best For** | Personal/small teams | Enterprise/organizations |

## When to Switch Back

If domain-wide delegation doesn't solve your issue, you can switch back to the shared folder approach:

1. Remove the `GOOGLE_IMPERSONATE_USER_EMAIL` environment variable from Netlify
2. Redeploy your application
3. The app will revert to using the shared folder approach
4. Ensure you have `GOOGLE_DRIVE_FOLDER_ID` configured

## Summary Checklist

Use this checklist to ensure domain-wide delegation is properly configured:

```
☐ Have Google Workspace account (not personal Gmail)
☐ Have Super Admin access to Google Workspace Admin Console
☐ Service account created in Google Cloud Console
☐ Domain-wide delegation enabled for service account
☐ Copied the service account's Client ID
☐ Authorized Client ID in Google Workspace Admin Console
☐ Added required OAuth scopes (drive.file, spreadsheets)
☐ Added GOOGLE_IMPERSONATE_USER_EMAIL to Netlify environment variables
☐ Impersonated user email is correct and active
☐ Deployed application to Netlify
☐ Verified logs show "Using domain-wide delegation" message
☐ Tested photo upload successfully
☐ Verified file owner is the impersonated user
```

## Additional Resources

- [Google Workspace Domain-Wide Delegation Documentation](https://developers.google.com/identity/protocols/oauth2/service-account#delegatingauthority)
- [Google Cloud Service Accounts Guide](https://cloud.google.com/iam/docs/service-accounts)
- [OAuth 2.0 Scopes for Google APIs](https://developers.google.com/identity/protocols/oauth2/scopes)
- [SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md) - Basic service account setup
- [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md) - Google Drive configuration

## Need Help?

If you're still experiencing issues:

1. Check the Netlify function logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure you have Super Admin access to Google Workspace
4. Review the Google Workspace Admin Console audit logs
5. Check that all OAuth scopes are properly authorized
6. Try with a different user email to rule out user-specific issues
7. Consider reaching out to Google Workspace support if you suspect an organization-level issue

---

**Note:** Domain-wide delegation is an optional feature. The application will work without it using the shared folder approach. Only configure domain-wide delegation if you're experiencing specific permission issues with Google Workspace.
