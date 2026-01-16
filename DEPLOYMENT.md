# Deployment Guide - Sentifi Finance Dashboard

## Prerequisites

1. **MongoDB Atlas Account** (Free tier available)
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster
   - Get your connection string

2. **Vercel Account** (Free tier available)
   - Sign up at [vercel.com](https://vercel.com)

3. **Google Gemini API Key**
   - Get from [ai.google.dev](https://ai.google.dev)

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free M0 tier)
3. Create a database user (Database Access)
4. Whitelist all IPs: `0.0.0.0/0` (Network Access)
5. Get your connection string from "Connect" → "Connect your application"
6. Replace `<password>` with your database user password

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/sentifi?retryWrites=true&w=majority
```

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install`

4. Add Environment Variables (click "Environment Variables"):

**Required Variables:**
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/sentifi
JWT_SECRET=your_random_secret_key_min_32_characters
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

**Optional Variables (for email reports):**
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

5. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts and add environment variables when asked
```

### 4. Configure Firebase (for Google Login)

Your Firebase config is already in `frontend/src/firebaseConfig.ts`. The values are:
- Already configured and working
- These are public API keys (safe to expose)
- No additional Vercel env vars needed for Firebase

### 5. Post-Deployment Configuration

After deployment, update:

1. **Firebase Authorized Domains**:
   - Go to Firebase Console → Authentication → Settings
   - Add your Vercel domain: `your-app-name.vercel.app`

2. **MongoDB Network Access** (if needed):
   - Ensure `0.0.0.0/0` is whitelisted (allows Vercel's dynamic IPs)

### 6. Test Your Deployment

1. Visit your Vercel URL
2. Test registration/login
3. Test Google Login
4. Create a transaction
5. Test AI Chat
6. Test email report (if configured)

## Environment Variables Reference

### Required for Core Functionality

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens (min 32 chars) | `your_super_secret_key_here_min_32_chars` |
| `GEMINI_API_KEY` | Google Gemini AI API key | `AIzaSy...` |
| `CLIENT_URL` | Frontend URL | `https://your-app.vercel.app` |
| `NODE_ENV` | Environment | `production` |

### Optional (Email Reports)

| Variable | Description | How to Get |
|----------|-------------|------------|
| `EMAIL_USER` | Gmail address | Your Gmail |
| `EMAIL_PASS` | Gmail App Password | [Google Account → Security → App Passwords](https://myaccount.google.com/apppasswords) |

## Generating Secure Secrets

For `JWT_SECRET`, generate a random string:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use an online generator
# https://randomkeygen.com/
```

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure `frontend/package.json` has a `build` script
- Check Vercel build logs for specific errors

### Database Connection Fails
- Verify MongoDB connection string is correct
- Ensure password doesn't contain special characters (URL encode if needed)
- Check MongoDB Network Access allows `0.0.0.0/0`

### Google Login Doesn't Work
- Add Vercel domain to Firebase Authorized Domains
- Check Firebase config in `firebaseConfig.ts`

### Email Reports Don't Send
- Verify `EMAIL_USER` and `EMAIL_PASS` are set
- Use Gmail App Password, not regular password
- Enable "Less secure app access" if using regular Gmail

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `CLIENT_URL` environment variable
5. Update Firebase Authorized Domains

## Monitoring

- **Vercel Dashboard**: View deployments, logs, and analytics
- **MongoDB Atlas**: Monitor database usage and performance
- **Firebase Console**: Track authentication usage

## Cost Estimate

- **Vercel**: Free tier (100GB bandwidth, unlimited deployments)
- **MongoDB Atlas**: Free tier (512MB storage, shared cluster)
- **Firebase**: Free tier (10K authentications/month)
- **Gemini API**: Free tier available

**Total: $0/month** for small-scale usage

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Review environment variables
4. Test locally with production env vars

---

**Ready to deploy!** 🚀
