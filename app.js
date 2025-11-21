/**
 * Construction Site Photo Submission Application
 * 
 * This application allows users to:
 * 1. Upload photos from construction sites
 * 2. Extract text using Google Cloud Vision API
 * 3. Parse developer information using DeepSeek AI (company, website, phone, address)
 * 4. Save data to Google Sheets with automatic matching/updating
 * 
 * @requires Google Cloud Vision API key
 * @requires DeepSeek API key
 * @requires Google Sheets API key
 * @requires config.js with valid configuration
 */

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

        // Check file size (limit to 10MB for Vision API compatibility)
        const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSizeInBytes) {
            this.showError('Image file is too large. Please select an image smaller than 10MB.');
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

    /**
     * Analyzes the uploaded photo using Google Cloud Vision API
     * Extracts text and parses developer information using DeepSeek AI
     */
    async analyzePhoto() {
        if (!this.photoFile) {
            this.showError('Please select a photo first.');
            return;
        }

        // Check if API endpoints are configured
        if (!CONFIG.VISION_API_ENDPOINT) {
            this.showError('Vision API endpoint is not configured. Please check config.js');
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
            
            // Use DeepSeek AI to analyze and parse the extracted text
            const deepseekData = await this.callDeepSeekAPI(extractedText);
            
            // Combine extracted text with DeepSeek parsed data
            this.extractedData = {
                fullText: extractedText,
                companyName: deepseekData.companyName || '',
                contactName: deepseekData.contactName || '',
                email: deepseekData.email || '',
                website: deepseekData.website || '',
                phone: deepseekData.phone || '',
                address: deepseekData.address || ''
            };
            
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

    /**
     * Calls Google Cloud Vision API via Netlify Function to perform OCR on the image
     * @param {string} base64Image - Base64 encoded image data
     * @returns {Promise<Object>} Vision API response
     * 
     * @security API key is kept secure server-side in Netlify Functions.
     */
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

        let response;
        try {
            response = await fetch(
                CONFIG.VISION_API_ENDPOINT,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                }
            );
        } catch (networkError) {
            console.error('Network error calling Vision API:', networkError);
            throw new Error('Failed to connect to Google Vision API. Please check your internet connection and try again.');
        }

        if (!response.ok) {
            let errorMessage = 'Request failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error?.message || errorData.message || errorMessage;
                
                // Handle specific error cases
                if (response.status === 400 && errorMessage.includes('API key')) {
                    errorMessage = 'Invalid API key. Please check your Google Vision API key in config.js';
                } else if (response.status === 403) {
                    if (errorMessage.includes('expired')) {
                        errorMessage = 'API key expired. Please renew your Google Vision API key in Google Cloud Console.';
                    } else if (errorMessage.includes('not enabled')) {
                        errorMessage = 'Google Vision API is not enabled. Please enable it in Google Cloud Console.';
                    } else if (errorMessage.includes('quota')) {
                        errorMessage = 'API quota exceeded. Please check your usage limits in Google Cloud Console.';
                    } else {
                        errorMessage = 'Access denied. Please check API key restrictions in Google Cloud Console.';
                    }
                } else if (response.status === 429) {
                    errorMessage = 'Too many requests. Please wait a moment and try again.';
                }
            } catch (parseError) {
                console.error('Error parsing Vision API error response:', parseError);
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error('Google Vision API: ' + errorMessage);
        }

        return await response.json();
    }

    /**
     * Calls DeepSeek API via Netlify Function to analyze extracted text and identify structured information
     * @param {string} text - Raw text extracted from the image
     * @returns {Promise<Object>} Parsed data with identified fields
     * 
     * @security API key is kept secure server-side in Netlify Functions.
     */
    async callDeepSeekAPI(text) {
        if (!CONFIG.DEEPSEEK_API_ENDPOINT) {
            throw new Error('DeepSeek API endpoint is not configured. Please check config.js');
        }

        const prompt = `Analyze the following text extracted from a construction site photo and identify the following information:
- Company Name: The name of the developer/construction company
- Contact Name: The name of a person to contact (if mentioned)
- Email Address: Any email address found
- Website: Any website URL found
- Phone Number: Any phone number found
- Address: The site address or location (street address, city, state, zip code if available)

Return the information in JSON format with these exact keys: companyName, contactName, email, website, phone, address.
If any information is not found or cannot be determined with confidence, use an empty string "" for that field.
Do not make up or guess information that is not present in the text.

Text to analyze:
${text}

Return only valid JSON, no other text.`;

        const requestBody = {
            model: "deepseek-chat",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.1,
            max_tokens: 500
        };

        let response;
        try {
            response = await fetch(
                CONFIG.DEEPSEEK_API_ENDPOINT,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                }
            );
        } catch (networkError) {
            console.error('Network error calling DeepSeek API:', networkError);
            throw new Error('Failed to connect to DeepSeek API. Please check your internet connection and try again.');
        }

        if (!response.ok) {
            let errorMessage = 'Request failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error?.message || errorData.message || errorMessage;
                
                // Handle specific error cases
                if (response.status === 401) {
                    errorMessage = 'Invalid or expired API key. Please check your DeepSeek API key in config.js or renew it at platform.deepseek.com';
                } else if (response.status === 403) {
                    errorMessage = 'Access denied. Please verify your DeepSeek API key has the necessary permissions.';
                } else if (response.status === 429) {
                    errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
                } else if (response.status === 402) {
                    errorMessage = 'Insufficient credits. Please add credits to your DeepSeek account.';
                }
            } catch (parseError) {
                console.error('Error parsing DeepSeek API error response:', parseError);
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error('DeepSeek API: ' + errorMessage);
        }

        const data = await response.json();
        
        // Extract the text from DeepSeek's response
        if (data.choices && 
            data.choices[0] && 
            data.choices[0].message && 
            data.choices[0].message.content) {
            
            const responseText = data.choices[0].message.content;
            
            // Parse the JSON response
            try {
                // Remove markdown code blocks if present
                const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                const parsedData = JSON.parse(cleanedText);
                
                return {
                    companyName: parsedData.companyName || '',
                    contactName: parsedData.contactName || '',
                    email: parsedData.email || '',
                    website: parsedData.website || '',
                    phone: parsedData.phone || '',
                    address: parsedData.address || ''
                };
            } catch (parseError) {
                console.error('Error parsing DeepSeek response:', parseError);
                console.error('Response text:', responseText);
                throw new Error('DeepSeek API: Failed to parse API response');
            }
        }
        
        throw new Error('DeepSeek API: Invalid response format');
    }

    extractTextFromVisionResponse(response) {
        if (response.responses && 
            response.responses[0] && 
            response.responses[0].textAnnotations && 
            response.responses[0].textAnnotations.length > 0) {
            return response.responses[0].textAnnotations[0].description;
        }
        throw new Error('Google Vision API: No text detected in the image');
    }

    /**
     * Sanitizes text input to prevent XSS attacks
     * @param {string} text - Text to sanitize
     * @returns {string} Sanitized text
     */
    sanitizeInput(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Parses extracted text to identify structured developer information
     * Uses regex patterns to detect company names, websites, phones, and addresses
     * @param {string} text - Raw text extracted from the image
     * @returns {Object} Parsed data object with identified fields
     */
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
        document.getElementById('contact-name').value = data.contactName || '';
        document.getElementById('email').value = data.email || '';
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
            contactName: document.getElementById('contact-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            website: document.getElementById('website').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            extractedText: document.getElementById('extracted-text').value.trim(),
            dateAdded: new Date().toISOString()
        };

        if (!formData.address) {
            this.showError('Please fill in the required field: Address');
            return;
        }

        // Check if Sheets API endpoint is configured
        if (!CONFIG.SHEETS_API_ENDPOINT) {
            this.showError('Google Sheets API endpoint is not configured. Please check config.js');
            return;
        }

        // Show loading on the save button
        const saveBtn = document.getElementById('save-btn');
        const originalBtnText = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.innerHTML = 'Saving<span class="spinner-small"></span>';
        
        this.hideError();

        try {
            // Upload photo to Google Drive first
            let driveFileId = null;
            if (this.photoFile && CONFIG.DRIVE_API_ENDPOINT) {
                try {
                    driveFileId = await this.uploadPhotoToDrive(formData.address);
                } catch (driveError) {
                    console.error('Error uploading to Drive:', driveError);
                    // Continue even if Drive upload fails - don't block the Sheets save
                    this.showError('Warning: Failed to upload photo to Google Drive: ' + driveError.message + '. Data will still be saved to Sheets.');
                }
            }
            
            // Check if site already exists by address
            const existingSite = await this.findSiteByAddress(formData.address);
            
            if (existingSite) {
                // Update existing site, passing the headers and existing data
                await this.updateSiteData(existingSite.row, formData, existingSite.headers, existingSite.data);
                this.showSuccess(`Site updated successfully! (Row ${existingSite.row})${driveFileId ? ' Photo saved to Google Drive.' : ''}`);
            } else {
                // Add new site
                await this.addNewSite(formData);
                this.showSuccess(`New site added successfully!${driveFileId ? ' Photo saved to Google Drive.' : ''}`);
            }
            
        } catch (error) {
            console.error('Error saving to Google Sheets:', error);
            this.showError('Failed to save data: ' + error.message);
        } finally {
            // Restore button state
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalBtnText;
        }
    }

    /**
     * Uploads the photo to Google Drive under Automation/Site Pictures folder
     * @param {string} address - Site address to use in filename
     * @returns {Promise<string>} File ID of uploaded file
     */
    async uploadPhotoToDrive(address) {
        if (!this.photoFile) {
            throw new Error('No photo file available to upload');
        }

        if (!CONFIG.DRIVE_API_ENDPOINT) {
            throw new Error('Google Drive API endpoint is not configured');
        }

        // Create filename: DATE_ADDRESS
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const sanitizedAddress = address.replace(/[^a-zA-Z0-9]/g, '_'); // Replace non-alphanumeric with underscore
        const fileExtension = this.photoFile.name.split('.').pop() || 'jpg';
        const fileName = `${date}_${sanitizedAddress}.${fileExtension}`;

        // Convert file to base64
        const base64Data = await this.fileToBase64(this.photoFile);

        // Upload to Drive
        const response = await fetch(CONFIG.DRIVE_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileName: fileName,
                fileData: base64Data,
                mimeType: this.photoFile.type
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload photo to Google Drive');
        }

        const result = await response.json();
        return result.fileId;
    }

    /**
     * Reads the sheet data and returns both headers and rows
     * @returns {Promise<Object>} Object containing headers array and values array
     */
    async getSheetData() {
        const url = `${CONFIG.SHEETS_API_ENDPOINT}?action=read&range=${encodeURIComponent(CONFIG.SHEET_NAME)}`;
        let response;
        
        try {
            response = await fetch(url);
        } catch (networkError) {
            console.error('Network error fetching sheet data:', networkError);
            throw new Error('Failed to connect to Google Sheets. Please check your internet connection and try again.');
        }
        
        if (!response.ok) {
            let errorMessage = 'Failed to fetch sheet data';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error?.message || errorData.message || errorMessage;
                
                // Handle specific error cases
                if (response.status === 400) {
                    errorMessage = 'Invalid request. Please check your configuration.';
                } else if (response.status === 403) {
                    errorMessage = 'Access denied. Please check that your Sheet is shared properly.';
                } else if (response.status === 404) {
                    errorMessage = 'Sheet not found. Please verify your Sheet configuration.';
                }
            } catch (parseError) {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        
        if (!data.values || data.values.length === 0) {
            return { headers: [], values: [] };
        }
        
        return {
            headers: data.values[0] || [],
            values: data.values
        };
    }

    /**
     * Converts a column index (0-based) to a column letter (A, B, ..., Z, AA, AB, ..., ZZ, AAA, etc.)
     * @param {number} index - 0-based column index
     * @returns {string} Column letter(s)
     */
    columnIndexToLetter(index) {
        let letter = '';
        let num = index + 1; // Convert to 1-based
        
        while (num > 0) {
            let remainder = (num - 1) % 26;
            letter = String.fromCharCode(65 + remainder) + letter;
            num = Math.floor((num - 1) / 26);
        }
        
        return letter;
    }

    /**
     * Gets the column index for a given column name from headers
     * @param {Array} headers - Array of column headers
     * @param {string} columnName - Name of the column to find
     * @returns {number} Column index or -1 if not found
     */
    getColumnIndex(headers, columnName) {
        const normalizedName = columnName.toLowerCase().trim();
        return headers.findIndex(header => 
            header && header.toLowerCase().trim() === normalizedName
        );
    }

    async findSiteByAddress(address) {
        try {
            const sheetData = await this.getSheetData();
            
            if (sheetData.values.length === 0) {
                return null;
            }
            
            // Find the Address column index
            const addressColIndex = this.getColumnIndex(sheetData.headers, 'Address');
            
            if (addressColIndex === -1) {
                throw new Error('Address column not found in Google Sheet. Please ensure the first row contains an "Address" column.');
            }
            
            // Find matching address (case-insensitive)
            const normalizedAddress = address.toLowerCase().trim();
            for (let i = 1; i < sheetData.values.length; i++) { // Skip header row
                const row = sheetData.values[i];
                if (row[addressColIndex] && row[addressColIndex].toLowerCase().trim() === normalizedAddress) {
                    return {
                        row: i + 1, // Sheet rows are 1-indexed
                        data: row,
                        headers: sheetData.headers
                    };
                }
            }
            
            return null;
        } catch (error) {
            console.error('Error finding site:', error);
            throw error; // Re-throw to be handled by caller
        }
    }

    async addNewSite(formData) {
        // First, get the sheet headers to determine column order
        const sheetData = await this.getSheetData();
        
        if (sheetData.headers.length === 0) {
            throw new Error('Sheet headers not found. Please ensure the first row contains column names: Address, Picture Date, Builder, Website, Contact Name, Contact Number, Email, Picture taken');
        }
        
        // Create a mapping of form data to column names
        const dataMapping = {
            'Address': formData.address,
            'Picture Date': new Date().toLocaleDateString(),
            'Builder': formData.companyName,
            'Website': formData.website,
            'Contact Name': formData.contactName,
            'Contact Number': formData.phone,
            'Email': formData.email,
            'Picture taken': 'Yes'
        };
        
        // Build the row array based on the actual column order in the sheet
        const rowValues = [];
        for (let i = 0; i < sheetData.headers.length; i++) {
            const headerName = sheetData.headers[i];
            const normalizedHeader = headerName.toLowerCase().trim();
            
            // Find matching data (case-insensitive)
            let cellValue = '';
            for (const [key, value] of Object.entries(dataMapping)) {
                if (key.toLowerCase().trim() === normalizedHeader) {
                    cellValue = value || '';
                    break;
                }
            }
            
            rowValues.push(cellValue);
        }
        
        const values = [rowValues];

        // Determine the column range dynamically based on number of columns
        // This ensures data is appended to the correct columns (A through lastColumn)
        const lastColumn = this.columnIndexToLetter(sheetData.headers.length - 1);
        const range = `${CONFIG.SHEET_NAME}!A:${lastColumn}`;
        const url = `${CONFIG.SHEETS_API_ENDPOINT}?action=append&range=${encodeURIComponent(range)}`;
        
        let response;
        try {
            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ values })
            });
        } catch (networkError) {
            console.error('Network error adding site:', networkError);
            throw new Error('Failed to connect to Google Sheets. Please check your internet connection and try again.');
        }

        if (!response.ok) {
            let errorMessage = 'Failed to add site to sheet';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error?.message || errorData.message || errorMessage;
                
                // Handle specific error cases
                if (response.status === 403) {
                    errorMessage = 'Permission denied. Please ensure the Sheet is shared with "Anyone with the link can edit".';
                } else if (response.status === 404) {
                    errorMessage = 'Sheet not found. Please verify the SHEET_ID and SHEET_NAME in config.js.';
                }
            } catch (parseError) {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    }

    async updateSiteData(rowNumber, formData, headers, existingRowData) {
        // Create a mapping of form data to column names
        const dataMapping = {
            'Address': formData.address,
            'Picture Date': new Date().toLocaleDateString(),
            'Builder': formData.companyName,
            'Website': formData.website,
            'Contact Name': formData.contactName,
            'Contact Number': formData.phone,
            'Email': formData.email,
            'Picture taken': 'Yes'
        };
        
        // Build the row array based on the actual column order in the sheet
        // Preserve existing data for columns not in the form data mapping
        const rowValues = [];
        for (let i = 0; i < headers.length; i++) {
            const headerName = headers[i];
            const normalizedHeader = headerName.toLowerCase().trim();
            
            // Check if this column exists in our form data mapping
            let foundInMapping = false;
            let cellValue = '';
            for (const [key, value] of Object.entries(dataMapping)) {
                if (key.toLowerCase().trim() === normalizedHeader) {
                    // This column is in our form data mapping, use the new value
                    cellValue = value || '';
                    foundInMapping = true;
                    break;
                }
            }
            
            // If column is not in the form data mapping, keep the existing value
            if (!foundInMapping) {
                cellValue = (existingRowData && existingRowData[i]) || '';
            }
            
            rowValues.push(cellValue);
        }
        
        const values = [rowValues];
        
        // Determine the range dynamically based on number of columns
        const lastColumn = this.columnIndexToLetter(headers.length - 1);
        const range = `${CONFIG.SHEET_NAME}!A${rowNumber}:${lastColumn}${rowNumber}`;

        const url = `${CONFIG.SHEETS_API_ENDPOINT}?action=update&updateRange=${encodeURIComponent(range)}`;
        
        let response;
        try {
            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ values })
            });
        } catch (networkError) {
            console.error('Network error updating site:', networkError);
            throw new Error('Failed to connect to Google Sheets. Please check your internet connection and try again.');
        }

        if (!response.ok) {
            let errorMessage = 'Failed to update site in sheet';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error?.message || errorData.message || errorMessage;
                
                // Handle specific error cases
                if (response.status === 403) {
                    errorMessage = 'Permission denied. Please ensure the Sheet is shared with "Anyone with the link can edit".';
                } else if (response.status === 404) {
                    errorMessage = 'Sheet not found. Please verify the SHEET_ID and SHEET_NAME in config.js.';
                }
            } catch (parseError) {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
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
