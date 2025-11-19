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

## ✅ Setup Checklist

Copy this checklist and check off as you set up each variable:

```
☐ VISION_API_KEY set in Netlify
☐ DEEPSEEK_API_KEY set in Netlify
☐ SHEETS_API_KEY set in Netlify
☐ SHEET_ID set in Netlify
☐ SHEET_NAME set in Netlify (optional)
☐ Triggered new deployment
☐ Verified build succeeded
☐ Tested application works
```

---

## 📋 Quick Copy-Paste Template

When adding variables in Netlify, use this format:

```bash
VISION_API_KEY=your_actual_vision_api_key_here
DEEPSEEK_API_KEY=your_actual_deepseek_api_key_here
SHEETS_API_KEY=your_actual_sheets_api_key_here
SHEET_ID=your_actual_sheet_id_here
SHEET_NAME=Sites
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
