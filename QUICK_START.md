# Quick Start Guide

## 🚀 Run Both Servers with One Command

From the project root directory:

```bash
npm run dev
```

This will start **both** servers:
- ✅ Backend API on http://localhost:5000
- ✅ Frontend UI on http://localhost:5173

## 📋 Available Scripts

### Development (Recommended)
```bash
npm run dev          # Run both frontend + backend together
```

### Individual Servers
```bash
npm run server       # Backend only (port 5000)
npm run client       # Frontend only (port 5173)
```

### Production
```bash
npm start            # Production backend server
```

## 🔧 First Time Setup

1. **Install Dependencies**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

2. **Configure `.env`** (see SETUP.md for details)
   - MongoDB URI
   - JWT secrets
   - Gemini API key
   - Exchange Rate API key

3. **Run Development Servers**
   ```bash
   npm run dev
   ```

4. **Access the App**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## ✅ That's It!

Both servers will run in one terminal window with colored output to distinguish between them. Press `Ctrl+C` to stop both servers.
