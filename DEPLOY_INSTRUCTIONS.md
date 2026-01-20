# Deploy Instructions for Switch App

## Step 1: Create GitHub Repo

1. Go to https://github.com/new
2. Repository name: `Switch-app` (or any name you prefer)
3. Make it **Public** or **Private** (your choice)
4. **Don't** initialize with README, .gitignore, or license
5. Click "Create repository"

## Step 2: Push Code to GitHub

Run these commands:

```bash
cd /Users/alt/Switch-app
git remote add origin https://github.com/YOUR_USERNAME/Switch-app.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 3: Deploy on Netlify

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Authorize Netlify to access your GitHub
5. Select the `Switch-app` repository
6. Configure build settings:
   - **Base directory**: (leave empty)
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`
7. Click "Show advanced" and add environment variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-api.com` (replace with your actual backend URL)
8. Click "Deploy site"

## Step 4: Add Custom Domain (Optional)

1. After deployment, go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter: `app.switchlocally.com`
4. Follow DNS instructions

## Done! 🎉

Your app will be live at the Netlify URL or your custom domain.

