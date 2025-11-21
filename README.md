# submit-photo.github.io

A web application that allows users to upload photos from construction sites, automatically extracts developer information using OCR, and saves the data to a Google Sheet.

## 🚀 Quick Start - Netlify Deployment (Recommended)

**Ready to deploy to Netlify?** See the [Netlify Deployment Guide](NETLIFY_DEPLOYMENT.md) for complete setup instructions.

This application is now configured to use Netlify environment variables for secure API key management.

## Alternative Deployment Options

- **GitHub Pages**: See the [GitHub Pages Deployment Guide](GITHUB_PAGES_DEPLOYMENT.md) (requires manual config.js setup)
- **Local Development**: See the "Local Development" section below

## Features

- 📷 Photo upload with camera support for mobile devices
- 🔍 Automatic text extraction using Google Cloud Vision API
- 🤖 Smart AI-powered parsing using DeepSeek to identify:
  - Company name
  - Contact name
  - Email address
  - Website
  - Phone number
  - Site address
- 💾 Automatic photo upload to Google Drive (Automation/Site Pictures folder)
- 📊 Google Sheets integration for data storage
- ✏️ User confirmation and editing of extracted data
- 🔄 Automatic matching and updating of existing sites by address
- ⏳ Loading indicator during save operation

## How It Works

1. **Upload Photo**: User takes or uploads a photo showing developer information at a construction site
2. **Extract Text**: Google Vision API extracts text from the photo using OCR
3. **AI Analysis**: DeepSeek analyzes the raw text and intelligently identifies company name, contact name, email, website, phone number, and address
4. **Match**: System searches Google Sheet for existing site by address
5. **Confirm/Edit**: User reviews and can edit the extracted information
6. **Save**: When user clicks "Save":
   - A loading indicator appears on the button
   - Photo is uploaded to Google Drive under "Automation/Site Pictures" with filename `DATE_ADDRESS`
   - Data is either added as a new site or updates an existing entry in Google Sheets
   - Success confirmation is displayed

## Setup Instructions

### 1. Google Cloud Platform Setup

1. Create a new project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Google Cloud Vision API
   - Google Sheets API
   - Google Drive API
3. Create API credentials:
   - **For Vision API**: Go to "Credentials" → "Create Credentials" → "API Key"
   - **For Sheets and Drive APIs**: Create a Service Account (see [SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md))
   - Restrict the keys to the specific APIs for security

**Note:** The same service account is used for both Google Sheets and Google Drive access. See [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md) for Drive-specific configuration.

**For Google Workspace Users:** If you're using Google Workspace (not personal Gmail) and experiencing permission issues, you can optionally enable domain-wide delegation to have the service account impersonate a specific user. See [DOMAIN_WIDE_DELEGATION_SETUP.md](DOMAIN_WIDE_DELEGATION_SETUP.md) for details.

### 2. DeepSeek API Setup

1. Visit [DeepSeek Platform](https://platform.deepseek.com/)
2. Create a new API key
3. Save this key for the configuration step

### 3. Google Sheets Setup

1. Create a new Google Sheet
2. Set up the following columns in the first row (column names are case-insensitive, but must match exactly):
   - Address
   - Picture Date
   - Builder
   - Website
   - Contact Name
   - Contact Number
   - Email
   - Picture taken
   
   **Note:** The columns can be in any order. The application will automatically match form data to the correct columns based on the column names in row 1.
   
3. Share the sheet with your Service Account:
   - Click "Share" button
   - Add the Service Account email (from your JSON key file)
   - Grant "Editor" permission
4. Copy the Sheet ID from the URL:
   - Format: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

**Important**: For Google Sheets write access, you MUST use Service Account authentication. See **[SERVICE_ACCOUNT_SETUP.md](SERVICE_ACCOUNT_SETUP.md)** for detailed instructions.

### 4. Application Configuration

**For Netlify (Recommended):**
Follow the [Netlify Deployment Guide](NETLIFY_DEPLOYMENT.md) and [Service Account Setup Guide](SERVICE_ACCOUNT_SETUP.md) to set up environment variables.

**For GitHub Pages or Local Development:**
1. Copy `config.template.js` to `config.js`
2. Replace the placeholder values with your actual API keys:
   ```javascript
   VISION_API_KEY: 'your-actual-vision-api-key',
   DEEPSEEK_API_KEY: 'your-actual-deepseek-api-key',
   SHEETS_API_KEY: 'your-actual-sheets-api-key',
   SHEET_ID: 'your-actual-sheet-id',
   SHEET_NAME: 'Sites' // or your sheet tab name
   ```
3. **IMPORTANT**: Do NOT commit `config.js` with real API keys to Git

### 5. Deploy

**Netlify (Recommended):**
See [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) for complete instructions.

**GitHub Pages:**
1. Make the repository public (Settings → Danger Zone → Change visibility)
2. Enable GitHub Pages (Settings → Pages → Select branch → Save)
3. Wait 1-3 minutes for deployment
4. Access your site at: `https://labrynna.github.io/submit-photo.github.io/`

**📖 For detailed GitHub Pages instructions, see [GITHUB_PAGES_DEPLOYMENT.md](GITHUB_PAGES_DEPLOYMENT.md)**

## Local Development

To run the application locally for development:

1. Copy `config.template.js` to `config.js` and fill in your API keys
2. Start a local web server:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Or using Node.js (if you have http-server installed)
   npx http-server
   ```
3. Open http://localhost:8000 in your browser

## Security Considerations

⚠️ **Important**: This implementation uses API keys in the frontend code. For production use:

**Netlify Deployment (Recommended):**
- ✅ API keys are stored securely in Netlify environment variables
- ✅ API keys are never committed to Git
- ✅ Build process generates `config.js` at deploy time
- 🔒 Still recommended: Restrict API keys in Google Cloud Console to your domain

**General Best Practices:**
- Restrict API keys to specific APIs in Google Cloud Console
- Restrict API keys to your domain (HTTP referrers)
- Regularly rotate API keys
- Monitor API usage and set up alerts
- Consider using OAuth 2.0 for Google Sheets (more complex but more secure)

## File Structure

```
submit-photo.github.io/
├── index.html                  # Main HTML structure
├── styles.css                  # Application styling
├── config.js                   # API configuration (auto-generated on Netlify)
├── config.template.js          # Template for local development
├── app.js                      # Main application logic
├── generate-config.js          # Build script for Netlify
├── netlify.toml                # Netlify configuration
├── NETLIFY_DEPLOYMENT.md       # Netlify deployment guide
├── GITHUB_PAGES_DEPLOYMENT.md  # GitHub Pages deployment guide
└── README.md                   # This file
```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers with camera support
- Requires JavaScript enabled

## Usage Tips

- Ensure photos clearly show developer information
- Good lighting improves OCR accuracy
- Always review extracted data before saving
- The address field is used for matching, so consistency is important

## Troubleshooting

For detailed troubleshooting help, see the **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** guide.

Common issues:

**"Failed to fetch" errors**: Check your internet connection and verify API keys are correct

**"API key expired" errors**: Renew your API keys in Google Cloud Console or DeepSeek Platform

**"No text detected"**: Ensure the photo is clear and text is readable

**"Access denied" errors**: Check API key restrictions and Sheet sharing permissions

**For comprehensive solutions to all error messages, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)**

## License

MIT License - Feel free to use and modify for your needs.
