# GitHub Pages Deployment Checklist

Follow these steps to deploy your Construction Site Photo Submission application to GitHub Pages.

## ✅ Pre-Deployment Checklist

- [ ] All code files are committed to the repository
- [ ] `.nojekyll` file exists in the root directory
- [ ] `index.html` is in the root directory
- [ ] You have a GitHub account with access to this repository

## 📋 Deployment Steps

### Step 1: Make Repository Public

- [ ] Go to repository on GitHub: https://github.com/labrynna/submit-photo.github.io
- [ ] Click **Settings** (top navigation bar)
- [ ] Scroll to **Danger Zone** section at the bottom
- [ ] Click **Change visibility**
- [ ] Select **Make public**
- [ ] Type repository name to confirm: `submit-photo.github.io`
- [ ] Click **I understand, change repository visibility**

### Step 2: Enable GitHub Pages

- [ ] In **Settings**, find **Pages** in left sidebar (under "Code and automation")
- [ ] Under **Source**, click the dropdown
- [ ] Select branch: **main** (or **master** if that's your default)
- [ ] Keep folder as **/ (root)**
- [ ] Click **Save**
- [ ] Note the URL displayed (will be: https://labrynna.github.io/submit-photo.github.io/)

### Step 3: Wait for Deployment

- [ ] GitHub will show "Your site is ready to be published"
- [ ] Wait 1-3 minutes (refresh the Settings → Pages page to check status)
- [ ] Status will change to "Your site is live at..."
- [ ] You may also check the **Actions** tab to see the deployment workflow

### Step 4: Verify Deployment

- [ ] Click the URL or navigate to: https://labrynna.github.io/submit-photo.github.io/
- [ ] Confirm the page loads and shows "Construction Site Photo Submission"
- [ ] Open browser console (F12) and check for any errors
- [ ] Verify CSS styling is applied correctly
- [ ] Check that the camera icon and upload area are visible

## 🔧 Post-Deployment Configuration

### Configure APIs (Required for functionality)

- [ ] Read `SETUP.md` for detailed API setup instructions
- [ ] Create Google Cloud Project
- [ ] Enable Cloud Vision API
- [ ] Enable Google Sheets API
- [ ] Create API keys (Vision and Sheets)
- [ ] Restrict API keys to your GitHub Pages URL
- [ ] Create Google Sheet with required columns
- [ ] Share Google Sheet with "Anyone with link can edit"
- [ ] Get Sheet ID from the URL
- [ ] Update `config.js` with your API keys and Sheet ID

**⚠️ IMPORTANT**: Do NOT commit `config.js` with real API keys to the repository!

## 🎯 Testing

- [ ] Upload a test photo with visible text
- [ ] Verify OCR text extraction works
- [ ] Check that data is saved to Google Sheet
- [ ] Test on mobile device (if available)

## 🔍 Troubleshooting

If the site doesn't load:
- [ ] Check Settings → Pages for any error messages
- [ ] Verify repository is public
- [ ] Check Actions tab for failed deployments
- [ ] Try accessing in incognito/private mode
- [ ] Wait up to 10 minutes for first deployment

If API errors occur:
- [ ] This is expected until you configure API keys
- [ ] See `SETUP.md` for API configuration
- [ ] Check browser console for specific error messages

## 📚 Additional Resources

- [GITHUB_PAGES_DEPLOYMENT.md](GITHUB_PAGES_DEPLOYMENT.md) - Detailed deployment guide
- [SETUP.md](SETUP.md) - Complete API setup instructions
- [README.md](README.md) - Application overview and features

## ✨ Congratulations!

Once all checkboxes are complete, your application will be live and accessible to anyone with the link!

Your live site: **https://labrynna.github.io/submit-photo.github.io/**
