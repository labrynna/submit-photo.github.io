# Setup Guide

This guide will walk you through setting up the Construction Site Photo Submission application.

## Prerequisites

- A Google Account
- A GitHub account (for hosting on GitHub Pages)
- Basic understanding of API keys and configuration

## Step-by-Step Setup

### Part 1: Google Cloud Platform Setup

#### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Enter a project name (e.g., "construction-photo-app")
4. Click "Create"

#### 2. Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Cloud Vision API" and click on it
3. Click "Enable"
4. Go back to the API Library
5. Search for "Google Sheets API" and click on it
6. Click "Enable"

#### 3. Create API Keys

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key (this will be your VISION_API_KEY)
4. Click "Restrict Key" for security:
   - Under "API restrictions", select "Restrict key"
   - Check "Cloud Vision API"
   - Click "Save"
5. Create another API key by clicking "Create Credentials" → "API Key"
6. Copy this second key (this will be your SHEETS_API_KEY)
7. Click "Restrict Key":
   - Under "API restrictions", select "Restrict key"
   - Check "Google Sheets API"
   - Click "Save"

**Optional but Recommended**: Add HTTP referrer restrictions
- Under "Application restrictions", select "HTTP referrers"
- Add your GitHub Pages URL: `https://yourusername.github.io/*`

### Part 2: Google Sheets Setup

#### 1. Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Click "Blank" to create a new spreadsheet
3. Name it "Construction Sites" (or any name you prefer)

#### 2. Set Up Columns

In the first row, create these column headers (in this exact order):

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| Address | Company Name | Website | Phone | Date Added | Photo Text |

#### 3. Configure Sharing

1. Click the "Share" button in the top-right
2. Click "Change to anyone with the link"
3. Set permission to "Editor" (so the app can write data)
4. Click "Done"

**Note**: For better security in production, use a service account instead of public sharing.

#### 4. Get the Sheet ID

1. Look at the URL of your Google Sheet
2. The Sheet ID is the long string between `/d/` and `/edit`
3. Example: `https://docs.google.com/spreadsheets/d/1ABC123xyz.../edit`
   - Sheet ID = `1ABC123xyz...`

### Part 3: Application Configuration

#### 1. Configure the Application

1. In your project folder, open `config.js`
2. Replace the placeholder values:

```javascript
const CONFIG = {
    VISION_API_KEY: 'AIzaSy...', // Paste your Vision API key
    SHEETS_API_KEY: 'AIzaSy...', // Paste your Sheets API key
    SHEET_ID: '1ABC123...', // Paste your Sheet ID
    SHEET_NAME: 'Sheet1', // Or your custom sheet name
    VISION_API_URL: 'https://vision.googleapis.com/v1/images:annotate',
    SHEETS_API_URL: 'https://sheets.googleapis.com/v4/spreadsheets'
};
```

3. Save the file

**Important**: Never commit real API keys to a public repository!

### Part 4: Deploy to GitHub Pages

#### 1. Prepare Your Repository

1. Make sure `config.js` with real API keys is NOT in your repository
2. Only commit `config.template.js` as a reference
3. Add `config.js` to `.gitignore` (already done in this project)

#### 2. Deploy

1. Push all files to your GitHub repository:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. Go to your GitHub repository settings
3. Navigate to "Pages" in the left sidebar
4. Under "Source", select your main branch
5. Click "Save"

#### 3. Access Your Application

Your application will be available at:
`https://yourusername.github.io/submit-photo.github.io/`

Note: It may take a few minutes for GitHub Pages to build and deploy your site.

### Part 5: Configure Production API Keys

Since you can't commit API keys to a public repo, you have two options:

#### Option A: Client-Side Configuration (Simple but less secure)

1. After deploying, manually edit `config.js` on the GitHub Pages server
2. Use HTTP referrer restrictions in Google Cloud Console
3. This is suitable for low-security applications

#### Option B: Backend Proxy (Recommended for production)

1. Create a backend service (e.g., using Netlify Functions, Vercel, or AWS Lambda)
2. Store API keys in environment variables on the backend
3. Proxy API requests through your backend
4. This keeps API keys completely hidden from client-side code

## Testing Your Setup

1. Open your deployed application
2. Take or upload a test photo with visible text
3. Click "Analyze Photo"
4. Review the extracted information
5. Click "Save to Google Sheet"
6. Check your Google Sheet to confirm the data was added

## Troubleshooting

### "API key not configured" error
- Make sure you've replaced the placeholder API keys in `config.js`
- Ensure the file is being loaded (check browser console for errors)

### "No text detected" error
- Ensure the photo has clear, readable text
- Try a photo with better lighting
- Make sure the text is not too small

### "Failed to save data" error
- Verify the Sheet ID is correct
- Check that the Google Sheet is shared with "Anyone with the link can edit"
- Ensure the Sheets API is enabled in Google Cloud Console
- Check that the sheet name matches the SHEET_NAME in config.js

### CORS errors
- This should not happen with Google APIs, but if it does:
- Check that your API keys are properly restricted
- Try accessing from the deployed GitHub Pages URL instead of localhost

### API quota exceeded
- Google Cloud Vision API has a free tier limit
- Check your usage in Google Cloud Console
- Consider upgrading or adding billing for higher limits

## Security Best Practices

1. **Restrict API Keys**: Always use API restrictions in Google Cloud Console
2. **HTTP Referrers**: Limit API usage to your specific domain
3. **Monitor Usage**: Regularly check Google Cloud Console for unusual activity
4. **Rotate Keys**: Periodically create new API keys and delete old ones
5. **Service Accounts**: For production, use service accounts instead of API keys
6. **Backend Proxy**: Don't expose API keys in client-side code for production apps

## Next Steps

Once your application is running:

1. Test with multiple photos to ensure accuracy
2. Customize the styling in `styles.css` to match your brand
3. Add additional fields to the Google Sheet if needed
4. Implement user authentication for better security
5. Set up monitoring and error logging

## Support

For issues with:
- **Google APIs**: Check [Google Cloud Documentation](https://cloud.google.com/docs)
- **GitHub Pages**: See [GitHub Pages Documentation](https://docs.github.com/en/pages)
- **This Application**: Open an issue on the GitHub repository

## Cost Considerations

- **Google Cloud Vision API**: Free tier includes 1,000 requests/month
- **Google Sheets API**: Free tier includes 500 requests/100 seconds/user
- **GitHub Pages**: Free for public repositories

Monitor your usage to stay within free tiers or plan for costs accordingly.
