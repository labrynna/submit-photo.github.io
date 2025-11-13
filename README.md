# submit-photo.github.io

A web application that allows users to upload photos from construction sites, automatically extracts developer information using OCR, and saves the data to a Google Sheet.

## Features

- 📷 Photo upload with camera support for mobile devices
- 🔍 Automatic text extraction using Google Cloud Vision API
- 🏗️ Intelligent parsing of developer information (company name, website, phone number, address)
- 📊 Google Sheets integration for data storage
- ✏️ User confirmation and editing of extracted data
- 🔄 Automatic matching and updating of existing sites by address

## How It Works

1. **Upload Photo**: User takes or uploads a photo showing developer information at a construction site
2. **Analyze**: Google Vision API extracts text from the photo
3. **Parse**: Application intelligently identifies company name, website, phone number, and address
4. **Match**: System searches Google Sheet for existing site by address
5. **Confirm/Edit**: User reviews and can edit the extracted information
6. **Save**: Data is either added as a new site or updates an existing entry

## Setup Instructions

### 1. Google Cloud Platform Setup

1. Create a new project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Google Cloud Vision API
   - Google Sheets API
3. Create API credentials:
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Create two API keys (or use one for both services)
   - Restrict the keys to the specific APIs for security

### 2. Google Sheets Setup

1. Create a new Google Sheet
2. Set up the following columns (in order):
   - Address
   - Company Name
   - Website
   - Phone
   - Date Added
   - Photo Text
3. Share the sheet:
   - Click "Share" button
   - Change to "Anyone with the link can edit" (or use a service account for better security)
4. Copy the Sheet ID from the URL:
   - Format: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

### 3. Application Configuration

1. Open `config.js` in the project
2. Replace the placeholder values:
   ```javascript
   VISION_API_KEY: 'your-actual-vision-api-key',
   SHEETS_API_KEY: 'your-actual-sheets-api-key',
   SHEET_ID: 'your-actual-sheet-id',
   SHEET_NAME: 'Sites' // or your sheet tab name
   ```

### 4. Deploy to GitHub Pages

1. Push all files to your GitHub repository
2. Go to repository Settings → Pages
3. Set Source to "main" branch
4. Your site will be available at: `https://yourusername.github.io/submit-photo.github.io/`

## Security Considerations

⚠️ **Important**: This implementation uses API keys directly in the frontend code for simplicity. For production use, consider:

- Using a backend proxy to hide API keys
- Implementing OAuth 2.0 for Google Sheets access
- Using Google Cloud service accounts
- Setting up CORS and API key restrictions in Google Cloud Console
- Restricting API keys to specific HTTP referrers (your GitHub Pages URL)

## File Structure

```
submit-photo.github.io/
├── index.html          # Main HTML structure
├── styles.css          # Application styling
├── config.js           # API configuration (DO NOT commit with real keys)
├── app.js             # Main application logic
└── README.md          # This file
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

**No text detected**: Ensure the photo is clear and text is readable

**API errors**: Check that API keys are correct and APIs are enabled in Google Cloud Console

**Can't save to sheet**: Verify Sheet ID is correct and sheet permissions allow editing

## License

MIT License - Feel free to use and modify for your needs.
