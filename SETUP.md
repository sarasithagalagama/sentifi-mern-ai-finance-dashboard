# Quick Setup Guide - MERN Expense Tracker

## 🚀 Getting Started

### Step 1: Install Dependencies ✅ (Already Done)
```bash
npm install
cd frontend && npm install
```

### Step 2: Configure Environment Variables ⚠️ (REQUIRED)

Edit the `.env` file in the root directory with your actual credentials:

#### Required Configuration:

1. **MongoDB Connection**
   - Get a free MongoDB Atlas cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Replace this line:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   ```
   - With your actual connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority
   ```

2. **JWT Secrets** (Generate random strings)
   ```bash
   # Generate secure random strings in Node.js:
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   
   Update these:
   ```env
   JWT_ACCESS_SECRET=paste_generated_secret_here
   JWT_REFRESH_SECRET=paste_another_generated_secret_here
   ```

3. **Gemini API Key** (Free - Get from Google)
   - Visit: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
   - Click "Create API Key"
   - Copy and paste:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Exchange Rate API** (Free - No Credit Card)
   - Visit: [https://www.exchangerate-api.com/](https://www.exchangerate-api.com/)
   - Sign up for free account
   - Copy your API key:
   ```env
   EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key_here
   ```

#### Optional (Can skip for now):

5. **Cloudinary** (For receipt image uploads)
   - Visit: [https://cloudinary.com/](https://cloudinary.com/)
   - Sign up for free
   - Get credentials from Dashboard
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Step 3: Start the Application

#### Backend:
```bash
npm run dev
```
Server runs on: http://localhost:5000

#### Frontend (in another terminal):
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

### Step 4: Test the API

#### Health Check:
```bash
curl http://localhost:5000/api/health
```

#### Register a User:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## 📋 Minimum Required Configuration

To get started quickly, you **MUST** configure:

1. ✅ MongoDB URI (required for database)
2. ✅ JWT Secrets (required for auth)
3. ✅ Gemini API Key (required for AI features)
4. ✅ Exchange Rate API Key (required for multi-currency)

Cloudinary is optional - receipt upload will work without it for now.

---

## 🔧 Troubleshooting

### Error: "Cannot connect to MongoDB"
- Check your MongoDB URI is correct
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify internet connection

### Error: "Invalid API key"
- Double-check you copied the API keys correctly
- No extra spaces or quotes in .env file

### Port Already in Use
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 🎯 Current Status

✅ Backend server code ready
✅ Frontend foundation ready
✅ Dependencies installed
⏳ Need to configure .env file
⏳ Need to start both servers

Once .env is configured, the server will start successfully! 🚀
