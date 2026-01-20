# Fix: "Backend server is not running" Error

## The Problem

The Switch frontend is trying to connect to `http://localhost:8000` because `VITE_API_BASE_URL` is not set in Netlify.

**This won't work because:**
- Frontend is deployed on Netlify (can't access localhost)
- Backend is on your server (different URL)

## ✅ Solution: Set Environment Variable in Netlify

### Step 1: Find Your Backend URL

Your backend is deployed on your server. Find the URL:
- If using a domain: `https://api.switchlocally.com` or `https://your-domain.com`
- If using IP: `http://your-server-ip:8000`
- Check your server/deployment for the actual URL

### Step 2: Set Environment Variable in Netlify

1. Go to Netlify Dashboard
2. Select your Switch-app site
3. Go to **Site settings** → **Environment variables**
4. Click **Add variable**
5. Add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: Your backend URL (e.g., `https://api.switchlocally.com` or `http://your-server-ip:8000`)
6. Click **Save**
7. **Redeploy** your site (Netlify → Deploys → Trigger deploy)

### Step 3: Verify

After redeploy, check:
1. Open your deployed site
2. Open browser console (F12)
3. Try to send OTP
4. Check Network tab - should see requests to your backend URL (not localhost)

## 🔍 How to Find Your Backend URL

### Option 1: Check Your Server
```bash
# SSH into your server
# Check what URL/port your backend is running on
ps aux | grep uvicorn
# Should show: uvicorn main:app --port 8000
```

### Option 2: Check Your Deployment
- If you deployed using `deploy.sh`, backend is on port 8000
- If you have a domain pointing to your server: `https://your-domain.com`
- If using reverse proxy (nginx): Check nginx config

### Option 3: Test Backend Directly
```bash
# Try accessing your backend
curl https://your-backend-url/api/docs
# OR
curl http://your-server-ip:8000/api/docs
```

## 🚨 Common Issues

### Issue 1: CORS Errors
If you see CORS errors, make sure your backend has CORS configured for your frontend domain.

**Fix:** Check `api/app.py` - should have your frontend domain in `origins` list.

### Issue 2: Backend Not Accessible
If backend URL doesn't work:
- Check if backend is actually running
- Check firewall/security groups allow port 8000
- Check if you need HTTPS (if frontend is HTTPS, backend should be too)

### Issue 3: Wrong URL Format
Make sure URL doesn't have trailing slash:
- ✅ `https://api.switchlocally.com`
- ❌ `https://api.switchlocally.com/`

## 📋 Quick Checklist

- [ ] Backend is running on your server
- [ ] Backend URL is accessible (test with curl)
- [ ] `VITE_API_BASE_URL` is set in Netlify
- [ ] Netlify site is redeployed after setting variable
- [ ] Browser console shows requests to correct backend URL

## 🎯 Example

If your backend is at `https://api.switchlocally.com`:

1. Netlify → Environment variables
2. Add: `VITE_API_BASE_URL` = `https://api.switchlocally.com`
3. Redeploy
4. Done!

