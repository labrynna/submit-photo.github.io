# Quick Start: OAuth 2.0 for Google Drive

## What Changed?

Google Drive uploads now use **OAuth 2.0** instead of Service Account. This works with your personal Gmail account!

---

## What You Need to Do

### Step 1: Get OAuth Credentials (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth client ID"**
5. If needed, configure consent screen:
   - Type: External
   - App name: "Photo Upload App"
   - Add your email as test user
6. Create Web Application OAuth client
7. **Save the Client ID and Client Secret**

### Step 2: Get Refresh Token (5 minutes)

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click gear icon ⚙️, check "Use your own OAuth credentials"
3. Enter your Client ID and Client Secret from Step 1
4. On the left, select: `Drive API v3` → `https://www.googleapis.com/auth/drive.file`
5. Click "Authorize APIs" and sign in with your Google account
6. Click "Allow" to grant permissions
7. Click "Exchange authorization code for tokens"
8. **Copy the refresh_token** (starts with `1//`)

### Step 3: Add to Netlify (2 minutes)

Go to Netlify → Site settings → Environment → Add these 3 variables:

```bash
GOOGLE_OAUTH_CLIENT_ID=<your-client-id>
GOOGLE_OAUTH_CLIENT_SECRET=<your-client-secret>
GOOGLE_OAUTH_REFRESH_TOKEN=<your-refresh-token>
```

### Step 4: Deploy & Test

1. Deploy your site (Netlify will auto-deploy after env var changes)
2. Upload a photo to test
3. Check your Google Drive - photo should be there!

---

## Full Documentation

For detailed instructions with screenshots and troubleshooting, see:
📖 **[OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md)**

---

## Questions?

**Q: Do I need to reauthorize periodically?**
A: No! The refresh token doesn't expire (unless you revoke it).

**Q: What about Google Sheets?**
A: Still uses Service Account. No changes needed - keeps working as before.

**Q: Is this secure?**
A: Yes! Credentials are stored securely in Netlify environment variables.

**Q: What if I need help?**
A: See the detailed [OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md) with troubleshooting section.

---

**Estimated total time:** ~15 minutes for complete setup
