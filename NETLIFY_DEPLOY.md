# 🚀 Netlify Deployment - Quick Steps

Your code is already on GitHub: **https://github.com/yednap868/Switch-app**

## Deploy Now (5 minutes)

### Step 1: Go to Netlify
1. Visit: https://app.netlify.com
2. Sign in (or sign up if needed)

### Step 2: Import Project
1. Click **"Add new site"** → **"Import an existing project"**
2. Click **"Deploy with GitHub"**
3. Authorize Netlify to access your GitHub (if first time)
4. Select repository: **`yednap868/Switch-app`**

### Step 3: Configure Build Settings
1. **Base directory**: (leave empty - default)
2. **Build command**: `npm install && npm run build`
3. **Publish directory**: `dist`

### Step 4: Add Environment Variable
1. Click **"Show advanced"** or **"New variable"**
2. Add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: Your backend API URL (e.g., `https://your-backend.railway.app` or `https://api.switchlocally.com`)

### Step 5: Deploy!
1. Click **"Deploy site"**
2. Wait 2-3 minutes for build to complete
3. Your app will be live! 🎉

---

## Add Custom Domain (Optional)

After deployment:

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter: `app.switchlocally.com`
4. Follow DNS instructions from Netlify
5. Update your DNS records

---

## Verify Deployment

1. Check build logs in Netlify dashboard
2. Visit your site URL (Netlify will give you one like `switch-app-xyz.netlify.app`)
3. Test the app - it should connect to your backend!

---

## Troubleshooting

**Build fails?**
- Check build logs in Netlify
- Make sure `VITE_API_BASE_URL` is set correctly
- Verify `package.json` has all dependencies

**App not loading?**
- Check browser console for errors
- Verify backend API URL is correct
- Check CORS settings on backend

---

## Done! ✅

Your Switch app is now deployed and ready to use!

