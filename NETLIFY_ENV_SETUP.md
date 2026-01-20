# Netlify Environment Variable Setup

## ✅ Backend URL Configured

The Switch app now uses **`https://api.relayy.world`** as the default backend URL.

This is the same backend used by Vance-1, so all Switch endpoints will work!

## Netlify Setup (Optional Override)

If you want to override the backend URL in Netlify:

1. Go to Netlify Dashboard → Your Switch-app site
2. **Site settings** → **Environment variables**
3. Add (optional):
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://api.relayy.world`
4. **Save** and **Redeploy**

**Note:** This is optional since the code already defaults to `https://api.relayy.world`

## ✅ What's Working Now

- ✅ Frontend defaults to `https://api.relayy.world`
- ✅ Backend is already deployed and running
- ✅ All Switch routes are in the backend
- ✅ CORS is configured for switchlocally.com domains

## 🧪 Test It

1. Deploy/redeploy your frontend on Netlify
2. Open your site
3. Try sending OTP
4. Check browser console - should connect to `https://api.relayy.world`

## 🎯 Summary

**Backend:** `https://api.relayy.world` (Vance-1 backend)
**Frontend:** Your Netlify deployment
**Status:** Ready to use! 🚀

