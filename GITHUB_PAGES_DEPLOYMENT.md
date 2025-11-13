# GitHub Pages Deployment Guide

This guide will help you deploy the Construction Site Photo Submission application to GitHub Pages.

## Prerequisites

- GitHub account with access to this repository
- Repository must be public (or you must have GitHub Pro for private repo Pages)

## Deployment Steps

### Step 1: Make the Repository Public

1. Go to your repository on GitHub: `https://github.com/labrynna/submit-photo.github.io`
2. Click on **Settings** (top navigation)
3. Scroll down to the **Danger Zone** section
4. Click **Change visibility**
5. Select **Make public**
6. Confirm by typing the repository name when prompted

### Step 2: Enable GitHub Pages

1. In the repository **Settings**, find the **Pages** section in the left sidebar
2. Under **Source**, select the branch you want to deploy (usually `main` or `master`)
3. Keep the folder as `/ (root)`
4. Click **Save**

### Step 3: Wait for Deployment

- GitHub will automatically build and deploy your site
- This usually takes 1-3 minutes
- You can check the deployment status in the **Actions** tab

### Step 4: Access Your Site

Your site will be available at:
```
https://labrynna.github.io/submit-photo.github.io/
```

## Important Notes

### `.nojekyll` File

This repository includes a `.nojekyll` file in the root directory. This file tells GitHub Pages to skip Jekyll processing and serve the files as-is. This is crucial for static HTML/CSS/JS applications like this one.

**Do not delete this file!**

### API Configuration

Before your application will work, you need to configure the API keys:

1. **DO NOT commit real API keys** to the public repository
2. You have two options:

   **Option A: Manual Configuration (Quick but Less Secure)**
   - After deployment, you'll need to manually update `config.js` on your server
   - Use HTTP referrer restrictions in Google Cloud Console
   
   **Option B: Environment Variables (Recommended)**
   - Use a backend proxy service (Netlify Functions, Vercel, AWS Lambda)
   - Store API keys as environment variables
   - Proxy API requests through the backend

See `SETUP.md` for detailed API configuration instructions.

## Verifying Deployment

1. Navigate to your GitHub Pages URL
2. You should see the "Construction Site Photo Submission" interface
3. The page should load without errors (check browser console with F12)

## Troubleshooting

### Site Not Loading

- **Check GitHub Pages status**: Go to Settings → Pages to see deployment status
- **Check Actions tab**: Look for any failed deployments
- **Wait longer**: Initial deployment can take up to 10 minutes
- **Clear cache**: Try accessing in incognito/private mode

### 404 Not Found

- Ensure the branch is correct in Pages settings
- Verify `index.html` is in the root directory
- Check that the repository is public

### CSS/JS Not Loading

- Verify all file paths in `index.html` are relative (not absolute)
- Check browser console for CORS or 404 errors
- Ensure `.nojekyll` file exists

### API Errors

- This is expected if you haven't configured API keys yet
- See `SETUP.md` for API configuration
- Remember: Never commit real API keys to a public repository!

## Updating Your Site

To update your deployed site:

1. Make changes to your local files
2. Commit and push to the branch configured in GitHub Pages
3. GitHub will automatically rebuild and deploy
4. Changes typically appear within 1-3 minutes

```bash
git add .
git commit -m "Update site"
git push origin main
```

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the root with your domain name
2. Configure DNS settings with your domain provider
3. Update the custom domain in GitHub Pages settings

See [GitHub's custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for details.

## Security Considerations

- Never commit API keys or secrets to the repository
- Use API key restrictions in Google Cloud Console
- Restrict API keys to your GitHub Pages URL
- Monitor API usage regularly
- Consider implementing a backend proxy for production use

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Pages Quickstart](https://docs.github.com/en/pages/quickstart)
- [Troubleshooting GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-jekyll-build-errors-for-github-pages-sites)
