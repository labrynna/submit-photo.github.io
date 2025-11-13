// Main application logic
class PhotoSubmissionApp {
    constructor() {
        this.photoFile = null;
        this.extractedData = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Photo upload
        const photoInput = document.getElementById('photo-input');
        photoInput.addEventListener('change', (e) => this.handlePhotoSelection(e));

        // Analyze button
        const analyzeBtn = document.getElementById('analyze-btn');
        analyzeBtn.addEventListener('click', () => this.analyzePhoto());

        // Form submission
        const dataForm = document.getElementById('data-form');
        dataForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Cancel button
        const cancelBtn = document.getElementById('cancel-btn');
        cancelBtn.addEventListener('click', () => this.resetForm());

        // New submission button
        const newSubmissionBtn = document.getElementById('new-submission-btn');
        newSubmissionBtn.addEventListener('click', () => this.resetForm());

        // Dismiss error button
        const dismissErrorBtn = document.getElementById('dismiss-error-btn');
        dismissErrorBtn.addEventListener('click', () => this.hideError());
    }

    handlePhotoSelection(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file.');
            return;
        }

        this.photoFile = file;
        this.displayPhotoPreview(file);
    }

    displayPhotoPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('photo-preview');
            preview.src = e.target.result;
            document.getElementById('preview-container').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    async analyzePhoto() {
        if (!this.photoFile) {
            this.showError('Please select a photo first.');
            return;
        }

        // Check if API key is configured
        if (!CONFIG.VISION_API_KEY || CONFIG.VISION_API_KEY === 'YOUR_GOOGLE_VISION_API_KEY_HERE') {
            this.showError('Google Vision API key is not configured. Please update config.js with your API key.');
            return;
        }

        this.showLoading(true);
        this.hideError();

        try {
            // Convert image to base64
            const base64Image = await this.fileToBase64(this.photoFile);
            
            // Call Google Vision API
            const visionResponse = await this.callVisionAPI(base64Image);
            
            // Extract text from response
            const extractedText = this.extractTextFromVisionResponse(visionResponse);
            
            // Parse the extracted text for specific information
            this.extractedData = this.parseExtractedText(extractedText);
            
            // Populate the form
            this.populateForm(this.extractedData);
            
            // Show the review section
            this.showReviewSection();
            
        } catch (error) {
            console.error('Error analyzing photo:', error);
            this.showError('Failed to analyze photo: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // Remove the data URL prefix to get just the base64 string
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async callVisionAPI(base64Image) {
        const requestBody = {
            requests: [{
                image: {
                    content: base64Image
                },
                features: [{
                    type: 'TEXT_DETECTION',
                    maxResults: 1
                }]
            }]
        };

        const response = await fetch(
            `${CONFIG.VISION_API_URL}?key=${CONFIG.VISION_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Vision API request failed');
        }

        return await response.json();
    }

    extractTextFromVisionResponse(response) {
        if (response.responses && 
            response.responses[0] && 
            response.responses[0].textAnnotations && 
            response.responses[0].textAnnotations.length > 0) {
            return response.responses[0].textAnnotations[0].description;
        }
        throw new Error('No text detected in the image');
    }

    parseExtractedText(text) {
        const data = {
            fullText: text,
            companyName: '',
            website: '',
            phone: '',
            address: ''
        };

        // Extract phone number (various formats)
        const phonePatterns = [
            /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
            /([0-9]{3})[-.\s]([0-9]{3})[-.\s]([0-9]{4})/,
            /\(([0-9]{3})\)\s*([0-9]{3})[-.\s]([0-9]{4})/
        ];

        for (const pattern of phonePatterns) {
            const phoneMatch = text.match(pattern);
            if (phoneMatch) {
                data.phone = phoneMatch[0].trim();
                break;
            }
        }

        // Extract website/URL
        const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(com|net|org|edu|gov|io|co)[^\s]*)/gi;
        const urlMatch = text.match(urlPattern);
        if (urlMatch) {
            data.website = urlMatch[0].trim();
            // Add https:// if not present
            if (!data.website.startsWith('http')) {
                data.website = 'https://' + data.website;
            }
        }

        // Extract address (look for street patterns)
        const addressPattern = /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Circle|Cir|Place|Pl)(?:\s+[A-Za-z\s,]+)?/i;
        const addressMatch = text.match(addressPattern);
        if (addressMatch) {
            data.address = addressMatch[0].trim();
        }

        // Extract company name (heuristic: look for lines with "LLC", "Inc", "Corporation", etc.)
        const companyPattern = /(.*?(?:LLC|L\.L\.C\.|Inc\.|Incorporated|Corp\.|Corporation|Company|Co\.|Limited|Ltd\.)[^\n]*)/i;
        const companyMatch = text.match(companyPattern);
        if (companyMatch) {
            data.companyName = companyMatch[0].trim();
        } else {
            // Fallback: use the first line that's not a phone or website
            const lines = text.split('\n').filter(line => line.trim());
            for (const line of lines) {
                if (!line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) && 
                    !line.match(/www\.|\.com|\.net|\.org/) &&
                    line.length > 3) {
                    data.companyName = line.trim();
                    break;
                }
            }
        }

        return data;
    }

    populateForm(data) {
        document.getElementById('address').value = data.address || '';
        document.getElementById('company-name').value = data.companyName || '';
        document.getElementById('website').value = data.website || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('extracted-text').value = data.fullText || '';
    }

    showReviewSection() {
        document.getElementById('upload-section').style.display = 'none';
        document.getElementById('review-section').style.display = 'block';
        document.getElementById('success-section').style.display = 'none';
    }

    async handleFormSubmit(event) {
        event.preventDefault();

        const formData = {
            address: document.getElementById('address').value.trim(),
            companyName: document.getElementById('company-name').value.trim(),
            website: document.getElementById('website').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            extractedText: document.getElementById('extracted-text').value.trim(),
            dateAdded: new Date().toISOString()
        };

        if (!formData.address || !formData.companyName) {
            this.showError('Please fill in required fields: Address and Company Name');
            return;
        }

        // Check if Sheets API is configured
        if (!CONFIG.SHEETS_API_KEY || CONFIG.SHEETS_API_KEY === 'YOUR_GOOGLE_SHEETS_API_KEY_HERE') {
            this.showError('Google Sheets API key is not configured. Please update config.js with your API key.');
            return;
        }

        if (!CONFIG.SHEET_ID || CONFIG.SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE') {
            this.showError('Google Sheet ID is not configured. Please update config.js with your Sheet ID.');
            return;
        }

        this.showLoading(true);
        this.hideError();

        try {
            // Check if site already exists by address
            const existingSite = await this.findSiteByAddress(formData.address);
            
            if (existingSite) {
                // Update existing site
                await this.updateSiteData(existingSite.row, formData);
                this.showSuccess(`Site updated successfully! (Row ${existingSite.row})`);
            } else {
                // Add new site
                await this.addNewSite(formData);
                this.showSuccess('New site added successfully!');
            }
            
        } catch (error) {
            console.error('Error saving to Google Sheets:', error);
            this.showError('Failed to save data: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async findSiteByAddress(address) {
        try {
            const url = `${CONFIG.SHEETS_API_URL}/${CONFIG.SHEET_ID}/values/${CONFIG.SHEET_NAME}?key=${CONFIG.SHEETS_API_KEY}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch sheet data');
            }
            
            const data = await response.json();
            
            if (!data.values || data.values.length === 0) {
                return null;
            }
            
            // Find matching address (case-insensitive)
            const normalizedAddress = address.toLowerCase().trim();
            for (let i = 1; i < data.values.length; i++) { // Skip header row
                const row = data.values[i];
                if (row[0] && row[0].toLowerCase().trim() === normalizedAddress) {
                    return {
                        row: i + 1, // Sheet rows are 1-indexed
                        data: row
                    };
                }
            }
            
            return null;
        } catch (error) {
            console.error('Error finding site:', error);
            return null;
        }
    }

    async addNewSite(formData) {
        const values = [[
            formData.address,
            formData.companyName,
            formData.website,
            formData.phone,
            new Date().toLocaleDateString(),
            formData.extractedText
        ]];

        const url = `${CONFIG.SHEETS_API_URL}/${CONFIG.SHEET_ID}/values/${CONFIG.SHEET_NAME}:append?valueInputOption=USER_ENTERED&key=${CONFIG.SHEETS_API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ values })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to add site to sheet');
        }

        return await response.json();
    }

    async updateSiteData(rowNumber, formData) {
        const range = `${CONFIG.SHEET_NAME}!A${rowNumber}:F${rowNumber}`;
        const values = [[
            formData.address,
            formData.companyName,
            formData.website,
            formData.phone,
            new Date().toLocaleDateString(),
            formData.extractedText
        ]];

        const url = `${CONFIG.SHEETS_API_URL}/${CONFIG.SHEET_ID}/values/${range}?valueInputOption=USER_ENTERED&key=${CONFIG.SHEETS_API_KEY}`;
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ values })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to update site in sheet');
        }

        return await response.json();
    }

    showSuccess(message) {
        document.getElementById('success-message').textContent = message;
        document.getElementById('upload-section').style.display = 'none';
        document.getElementById('review-section').style.display = 'none';
        document.getElementById('success-section').style.display = 'block';
    }

    showError(message) {
        document.getElementById('error-message').textContent = message;
        document.getElementById('error-section').style.display = 'block';
    }

    hideError() {
        document.getElementById('error-section').style.display = 'none';
    }

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
    }

    resetForm() {
        // Reset state
        this.photoFile = null;
        this.extractedData = null;

        // Clear form
        document.getElementById('data-form').reset();
        document.getElementById('photo-input').value = '';
        document.getElementById('preview-container').style.display = 'none';

        // Show upload section
        document.getElementById('upload-section').style.display = 'block';
        document.getElementById('review-section').style.display = 'none';
        document.getElementById('success-section').style.display = 'none';
        
        this.hideError();
    }
}

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PhotoSubmissionApp();
});
