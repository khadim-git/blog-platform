# Vercel Frontend Deployment Guide

## 🚀 Quick Deploy Steps

### 1. Prepare Repository
```bash
cd frontend
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 2. Deploy on Vercel

**Option A: Vercel CLI (Recommended)**
```bash
npm i -g vercel
cd frontend
vercel
```

**Option B: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` folder as root directory
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://blog-platform-production-efcf.up.railway.app`

### 3. Update Backend CORS

After getting your Vercel URL (e.g., `https://your-app.vercel.app`), update backend CORS:

```python
# In backend/app/main.py
allow_origins=[
    "http://localhost:3000",
    "https://your-app.vercel.app",  # Add your actual Vercel URL
    "https://*.vercel.app"
]
```

Then redeploy backend:
```bash
cd backend
git add .
git commit -m "Update CORS for Vercel"
git push
```

## 🔧 Configuration Files Created

- ✅ `.env.local` - Local environment variables
- ✅ `vercel.json` - Vercel configuration
- ✅ Updated `api.ts` - Dynamic API URL

## 🌐 URLs After Deployment

- **Backend (Railway)**: https://blog-platform-production-efcf.up.railway.app
- **Frontend (Vercel)**: https://your-app.vercel.app
- **API Docs**: https://blog-platform-production-efcf.up.railway.app/docs

## 🐛 Troubleshooting

### CORS Issues
If you get CORS errors, make sure:
1. Your Vercel URL is added to backend CORS settings
2. Backend is redeployed after CORS update

### API Connection Issues
1. Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
2. Verify Railway backend is running: visit `/health` endpoint

### Build Issues
```bash
cd frontend
npm install
npm run build
```

## 📝 Environment Variables for Vercel

Set these in Vercel dashboard or CLI:

```
NEXT_PUBLIC_API_URL=https://blog-platform-production-efcf.up.railway.app
```

## ✅ Deployment Checklist

- [ ] Frontend code committed and pushed
- [ ] Vercel project created
- [ ] Environment variables set in Vercel
- [ ] Backend CORS updated with Vercel URL
- [ ] Backend redeployed
- [ ] Test login/register functionality
- [ ] Test API endpoints