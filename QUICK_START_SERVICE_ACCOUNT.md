# Quick Start: Setting Up Service Account for Google Sheets

This is a simplified guide to help you set up Service Account authentication quickly. For detailed instructions, see [SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md).

## What You Need

You mentioned you can provide a Service Account to access Google Sheets but don't have a JSON file. Here's what you need:

### Required Information from Your Service Account:
1. **Service Account Email**: Looks like `name@project-id.iam.gserviceaccount.com`
2. **Private Key**: A long text string that starts with `-----BEGIN PRIVATE KEY-----`

## Where to Get This Information

If you already have a Service Account but no JSON file, you need to create a new key:

### Step 1: Create a New Key for Your Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **IAM & Admin** → **Service Accounts**
3. Find your existing service account
4. Click on the service account email
5. Go to the **Keys** tab
6. Click **Add Key** → **Create new key**
7. Choose **JSON** format
8. Click **Create**
9. A JSON file will download - **SAVE THIS FILE SECURELY**

### Step 2: Open the JSON File
The file will look like this:
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

You need TWO values:
1. **`client_email`** - Copy the entire email address
2. **`private_key`** - Copy the entire key including BEGIN and END lines

## Setting Up in Netlify

### Step 3: Add Environment Variables in Netlify

1. Log in to [Netlify](https://app.netlify.com/)
2. Select your site
3. Go to **Site settings** → **Build & deploy** → **Environment**
4. Click **"Edit variables"**
5. Add these two new variables:

| Variable Name | Value | Notes |
|---------------|-------|-------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `your-service-account@project.iam.gserviceaccount.com` | Paste from `client_email` in JSON |
| `GOOGLE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n` | Paste from `private_key` in JSON |

**Important for `GOOGLE_PRIVATE_KEY`:**
- Copy the ENTIRE value including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- The newlines should be `\n` (backslash-n), not actual line breaks
- Just copy and paste exactly as it appears in the JSON file

6. Click **"Save"**

### Step 4: Share Your Google Sheet

1. Open your Google Sheet
2. Click the **"Share"** button
3. In the "Add people and groups" field, paste the Service Account email:
   ```
   your-service-account@your-project-id.iam.gserviceaccount.com
   ```
4. Set permission to **"Editor"**
5. **Uncheck** "Notify people" (it's a service account, not a person)
6. Click **"Send"**

### Step 5: Deploy

1. In Netlify, trigger a new deployment (or just push a commit)
2. Wait for the build to complete
3. Test the application!

## Troubleshooting

### "API keys are not supported by this API"
This means you haven't set up the Service Account yet. Follow the steps above.

### "Permission denied"
Make sure you shared the Google Sheet with the Service Account email (Step 4).

### "Failed to obtain access token"
Check that both environment variables are set correctly in Netlify. The private key should include the BEGIN and END lines.

### "Missing required environment variables"
You need to set both `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` in Netlify.

## What About the Other Environment Variables?

You still need these for the other APIs:

| Variable Name | Purpose | Where to Get |
|---------------|---------|--------------|
| `VISION_API_KEY` | Google Cloud Vision API | [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials) |
| `DEEPSEEK_API_KEY` | DeepSeek AI API | [DeepSeek Platform](https://platform.deepseek.com/) |
| `SHEET_ID` | Google Sheet ID | From your Sheet URL |
| `SHEET_NAME` | Sheet tab name | Default is "Sites" |

## Complete Environment Variables List

Here's the complete list of what you need in Netlify:

```bash
# For Google Sheets (Service Account)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n
SHEET_ID=1A2B3C4D5E6F7G8H9I0J
SHEET_NAME=Sites

# For other APIs  
VISION_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
DEEPSEEK_API_KEY=sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Do NOT Set These (They're Deprecated)

- ~~`SHEETS_API_KEY`~~ ❌ No longer used, removed

## Need More Help?

See the detailed guide: [SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md)

## Summary

**What changed:**
1. Form validation now only requires Address field (all other fields are optional)
2. Google Sheets now uses Service Account instead of API key

**What you need to do:**
1. Create/download Service Account JSON key
2. Add `GOOGLE_SERVICE_ACCOUNT_EMAIL` to Netlify
3. Add `GOOGLE_PRIVATE_KEY` to Netlify
4. Share your Google Sheet with the Service Account email
5. Deploy

That's it! The application should now work correctly for saving data to Google Sheets.
