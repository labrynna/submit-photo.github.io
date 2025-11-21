# Netlify Environment Variables - Quick Reference

## 🚀 Required Setup

Set these 5 environment variables in your Netlify dashboard before deploying:

### Navigation Path
Netlify Dashboard → Site Settings → Build & deploy → Environment → Environment variables

---

## Environment Variables List

### 1. VISION_API_KEY ✅ REQUIRED
```
Variable name: VISION_API_KEY
Value: Your Google Cloud Vision API Key
Example: AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
**Where to get:** [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)

---

### 2. DEEPSEEK_API_KEY ✅ REQUIRED
```
Variable name: DEEPSEEK_API_KEY
Value: Your DeepSeek AI API Key
Example: sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
**Where to get:** [DeepSeek Platform](https://platform.deepseek.com/)

---

### 3. SHEETS_API_KEY ✅ REQUIRED
```
Variable name: SHEETS_API_KEY
Value: Your Google Sheets API Key
Example: AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
**Where to get:** [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)

---

### 4. SHEET_ID ✅ REQUIRED
```
Variable name: SHEET_ID
Value: Your Google Sheet ID
Example: 1A2B3C4D5E6F7G8H9I0J_KLMNOPQRSTUVWXYZabcdef
```
**Where to get:** From your Google Sheet URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

---

### 5. SHEET_NAME ⭕ OPTIONAL
```
Variable name: SHEET_NAME
Value: Name of the sheet tab (defaults to "Sites" if not set)
Example: Sites
```

---

### 6. GOOGLE_SERVICE_ACCOUNT_EMAIL ✅ REQUIRED
```
Variable name: GOOGLE_SERVICE_ACCOUNT_EMAIL
Value: Your Google Service Account email
Example: your-service-account@your-project.iam.gserviceaccount.com
```
**Where to get:** From your service account JSON key file (client_email field)
**See:** [SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md)

---

### 7. GOOGLE_PRIVATE_KEY ✅ REQUIRED
```
Variable name: GOOGLE_PRIVATE_KEY
Value: Your Google Service Account private key
Example: -----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n
```
**Where to get:** From your service account JSON key file (private_key field)
**See:** [SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md)

---

### 8. GOOGLE_OAUTH_CLIENT_ID ✅ REQUIRED (for Google Drive)
```
Variable name: GOOGLE_OAUTH_CLIENT_ID
Value: Your OAuth 2.0 Client ID
Example: 123456789-abc.apps.googleusercontent.com
```
**Where to get:** From Google Cloud Console - OAuth 2.0 Client ID
**See:** [OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md)

---

### 9. GOOGLE_OAUTH_CLIENT_SECRET ✅ REQUIRED (for Google Drive)
```
Variable name: GOOGLE_OAUTH_CLIENT_SECRET
Value: Your OAuth 2.0 Client Secret
Example: GOCSPX-abcdefghijklmnop
```
**Where to get:** From Google Cloud Console - OAuth 2.0 Client ID
**See:** [OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md)

---

### 10. GOOGLE_OAUTH_REFRESH_TOKEN ✅ REQUIRED (for Google Drive)
```
Variable name: GOOGLE_OAUTH_REFRESH_TOKEN
Value: Your OAuth 2.0 Refresh Token (obtained once via OAuth Playground)
Example: 1//0gPAbcDefGhiJkL...
```
**Where to get:** From Google OAuth 2.0 Playground (one-time setup)
**See:** [OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md)

---

### 11. GOOGLE_DRIVE_FOLDER_ID ⭕ OPTIONAL
```
Variable name: GOOGLE_DRIVE_FOLDER_ID
Value: Google Drive folder ID where photos should be uploaded
Example: 1A2B3C4D5E6F7G8H9I0J_KLMNOPQRSTUVWXYZabcdef
```
**Where to get:** From your Google Drive folder URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
**Note:** If not set, photos will upload to the root of your Google Drive

---

### ~~12. GOOGLE_IMPERSONATE_USER_EMAIL~~ ⚠️ DEPRECATED
```
This variable is no longer needed. Google Drive now uses OAuth 2.0 instead.
You can remove this variable if you added it previously.
```

---

## ✅ Setup Checklist

Copy this checklist and check off as you set up each variable:

```
☐ VISION_API_KEY set in Netlify
☐ DEEPSEEK_API_KEY set in Netlify
☐ SHEETS_API_KEY set in Netlify
☐ SHEET_ID set in Netlify
☐ SHEET_NAME set in Netlify (optional)
☐ GOOGLE_SERVICE_ACCOUNT_EMAIL set in Netlify
☐ GOOGLE_PRIVATE_KEY set in Netlify
☐ GOOGLE_OAUTH_CLIENT_ID set in Netlify (for Drive)
☐ GOOGLE_OAUTH_CLIENT_SECRET set in Netlify (for Drive)
☐ GOOGLE_OAUTH_REFRESH_TOKEN set in Netlify (for Drive)
☐ GOOGLE_DRIVE_FOLDER_ID set in Netlify (optional)
☐ Triggered new deployment
☐ Verified build succeeded
☐ Tested application works
```

---

## 📋 Quick Copy-Paste Template

When adding variables in Netlify, use this format:

```bash
# Required Variables
VISION_API_KEY=your_actual_vision_api_key_here
DEEPSEEK_API_KEY=your_actual_deepseek_api_key_here
SHEETS_API_KEY=your_actual_sheets_api_key_here
SHEET_ID=your_actual_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n

# Required for Google Drive (OAuth 2.0)
GOOGLE_OAUTH_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=GOCSPX-abcdefghijk
GOOGLE_OAUTH_REFRESH_TOKEN=1//0gPAbcDefGhiJkL...

# Optional Variables
SHEET_NAME=Sites
GOOGLE_DRIVE_FOLDER_ID=your_drive_folder_id_here
```

---

## 🔍 How to Verify

After setting up all variables:

1. Go to your Netlify site → Deploys
2. Click "Trigger deploy" → "Deploy site"
3. Watch the build logs for:
   ```
   ✓ config.js generated successfully from environment variables
   ```
4. If you see this, your setup is correct! ✅

---

## 📚 More Information

- Detailed setup guide: [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md)
- Full documentation: [NETLIFY_ENVIRONMENT_VARIABLES.md](NETLIFY_ENVIRONMENT_VARIABLES.md)
- Main README: [README.md](README.md)

---

## 🔒 Security Note

✅ These environment variables are stored securely in Netlify
✅ They are never committed to your Git repository
✅ They are only accessible during the build process
🔒 Recommended: Restrict your API keys in Google Cloud Console to your Netlify domain
