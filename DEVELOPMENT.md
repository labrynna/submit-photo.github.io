# Development Notes

## Project Structure

```
submit-photo.github.io/
├── index.html          # Main application interface
├── app.js              # Application logic (17KB)
├── styles.css          # Styling (4.2KB)
├── config.js           # API configuration (template)
├── config.template.js  # Backup config template
├── demo.html           # Interactive demo page
├── test.html           # Test suite for parsing logic
├── README.md           # Project overview
├── SETUP.md            # Detailed setup instructions
└── .gitignore          # Git ignore rules
```

## Architecture

### Frontend-Only Design
This is a pure client-side application with no backend server. All processing happens in the browser.

**Advantages:**
- Simple deployment (static hosting)
- No server maintenance
- Fast and responsive

**Limitations:**
- API keys are exposed in client code
- No server-side validation
- Limited to browser capabilities

### API Integration

**Google Vision API:**
- Used for OCR text extraction
- Supports multiple image formats
- Rate limits apply (free tier: 1,000 requests/month)

**Google Sheets API:**
- Used as a database
- Simple read/write operations
- No complex queries needed

### Data Flow

1. User uploads photo → FileReader converts to base64
2. Base64 image → Google Vision API → Text extraction
3. Extracted text → Regex parsing → Structured data
4. Structured data → Google Sheets API query → Check for existing address
5. If exists → Update row, else → Append new row
6. User confirmation required before final save

## Key Features

### Text Extraction Patterns

**Phone Numbers:**
```javascript
/(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/
```
Matches: (555) 123-4567, 555-123-4567, 555.123.4567, +1-555-123-4567

**Websites:**
```javascript
/(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(com|net|org|edu|gov|io|co)[^\s]*)/gi
```
Matches: www.example.com, https://example.com, example.net

**Addresses:**
```javascript
/\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|...)[^\n]*/i
```
Matches: 123 Main Street, 456 Oak Avenue, etc.

**Company Names:**
- Looks for LLC, Inc., Corp., etc.
- Falls back to first non-phone/website line

### Security Considerations

1. **API Key Exposure:** Keys are in client code - use HTTP referrer restrictions
2. **XSS Prevention:** Use `.textContent` instead of `.innerHTML` for user data
3. **File Size Limits:** 10MB maximum to prevent API errors
4. **Input Validation:** All form fields validated before submission

## Testing

### Manual Testing Checklist
- [ ] Photo upload works on desktop
- [ ] Camera access works on mobile
- [ ] File size validation (try >10MB file)
- [ ] Invalid file type handling
- [ ] Text extraction accuracy
- [ ] Parsing logic for various formats
- [ ] Google Sheet integration
- [ ] Address matching (existing records)
- [ ] New record creation
- [ ] Form validation
- [ ] Error handling
- [ ] Loading states
- [ ] Success messages
- [ ] Responsive design (mobile/tablet/desktop)

### Automated Tests
Run `test.html` in a browser to validate parsing logic.

## Future Enhancements

### Security Improvements
- [ ] Implement backend proxy to hide API keys
- [ ] Add OAuth 2.0 for Google Sheets
- [ ] Use service accounts instead of API keys
- [ ] Add rate limiting
- [ ] Implement CAPTCHA to prevent abuse

### Feature Additions
- [ ] Batch upload (multiple photos)
- [ ] Photo compression before upload
- [ ] Export data to CSV
- [ ] Search/filter existing sites
- [ ] Map view of construction sites
- [ ] Photo gallery for each site
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Multi-language support
- [ ] Dark mode

### Technical Improvements
- [ ] Add build process (webpack/vite)
- [ ] Implement TypeScript
- [ ] Add unit tests (Jest)
- [ ] Add E2E tests (Playwright/Cypress)
- [ ] Progressive Web App (PWA)
- [ ] Offline support
- [ ] Image caching
- [ ] Better error recovery

### UX Enhancements
- [ ] Better parsing feedback (show confidence scores)
- [ ] Undo functionality
- [ ] Keyboard shortcuts
- [ ] Drag & drop upload
- [ ] Copy/paste image support
- [ ] Recent submissions history
- [ ] Tutorial/onboarding flow

## Common Issues & Solutions

### "No text detected"
- Check image quality
- Ensure good lighting in photo
- Try different photo angle
- Verify Vision API quota

### "Failed to save data"
- Check Sheet ID is correct
- Verify sheet permissions
- Check API key validity
- Ensure sheet has correct columns

### CORS Errors
- Should not occur with Google APIs
- If it does, check API key restrictions
- Verify HTTP referrers are set correctly

### Mobile Camera Not Working
- Check HTTPS (required for camera access)
- Verify browser permissions
- Try different browser

## Performance Notes

- Vision API response time: ~2-5 seconds
- Sheets API response time: ~1-3 seconds
- Total workflow: ~5-10 seconds
- No client-side caching (every request goes to APIs)

## Cost Estimates (Free Tier)

**Google Cloud Vision API:**
- Free: 1,000 units/month
- After: $1.50 per 1,000 units

**Google Sheets API:**
- Free: 500 requests/100 seconds/user
- Generally sufficient for this use case

**GitHub Pages:**
- Free for public repositories
- 100GB bandwidth/month

## Contributing

When adding new features:
1. Update this document
2. Add tests in `test.html`
3. Update README.md and SETUP.md
4. Test on mobile and desktop
5. Run CodeQL security scan
6. Update demo.html if UI changes

## License

MIT License - See LICENSE file for details
