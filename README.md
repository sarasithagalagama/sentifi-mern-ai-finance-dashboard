# 💰 Sentifi - AI-Powered Finance Dashboard

<div align="center">

![Sentifi Logo](https://img.shields.io/badge/Sentifi-Finance%20Dashboard-4ade80?style=for-the-badge&logo=sparkles)

**A modern, full-stack financial management platform with AI-powered insights**

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Deployment](#-deployment) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 Overview

Sentifi is a comprehensive financial management platform that combines traditional expense tracking with cutting-edge AI technology. Built with the MERN stack, it offers real-time insights, intelligent financial advice, and seamless user experience across all devices.

## ✨ Features

### 💳 Core Financial Management
- **Transaction Tracking** - Record income and expenses with detailed categorization
- **Budget Management** - Set and monitor budgets by category with visual progress tracking
- **Investment Portfolio** - Track stocks, crypto, and other assets with real-time values
- **Recurring Transactions** - Automate regular income and expenses
- **Multi-Currency Support** - Handle transactions in different currencies

### 🤖 AI-Powered Features
- **AI Financial Advisor** - Chat with an intelligent assistant powered by Google Gemini
- **Custom Questions** - Personalize AI suggestions with your own financial queries
- **Smart Categorization** - Automatic transaction categorization using AI
- **Receipt Scanning** - Extract transaction details from receipt images
- **Financial Insights** - Get personalized advice based on your spending patterns

### 📊 Analytics & Reporting
- **Interactive Dashboards** - Beautiful charts and graphs for data visualization
- **Spending Analysis** - Detailed breakdowns by category, time period, and trends
- **Email Reports** - Receive monthly financial summaries via email
- **Goal Tracking** - Set and monitor financial goals with progress indicators
- **Statistics Page** - Comprehensive financial metrics and trends

### 🔐 Authentication & Security
- **Email/Password Authentication** - Secure user registration and login
- **Google OAuth** - One-click sign-in with Google via Firebase
- **JWT Tokens** - Secure session management with access and refresh tokens
- **Password Encryption** - Industry-standard bcrypt hashing
- **Protected Routes** - Role-based access control

### 🎨 User Experience
- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Dark/Light Themes** - Multiple color schemes (Green, Purple, Blue, Orange)
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Floating AI Chat** - Quick access to AI assistant from any page
- **Real-time Updates** - Instant data synchronization

## 🎯 Demo

### Screenshots

**Dashboard**
- Real-time financial overview
- Interactive charts and graphs
- Quick access to key metrics

**AI Chat Assistant**
- Natural language financial queries
- Personalized suggestions
- Custom question management

**Transaction Management**
- Easy transaction creation
- Advanced filtering and search
- Category-based organization

**Budget Tracking**
- Visual progress indicators
- Spending vs. budget comparison
- Category-wise breakdowns

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Google Gemini AI** - AI integration
- **Nodemailer** - Email service
- **Node-cron** - Scheduled tasks

### Authentication
- **Firebase Auth** - Google OAuth
- **JWT** - Session management
- **bcrypt** - Password encryption

### DevOps & Tools
- **Vercel** - Hosting platform
- **MongoDB Atlas** - Cloud database
- **Git** - Version control
- **ESLint** - Code linting

## 📂 Project Structure

```
sentifi-mern-ai-finance-dashboard/
├── backend/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth, error handling, etc.
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── utils/           # Helper functions
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── api/         # API client functions
│       ├── components/  # React components
│       ├── context/     # React context providers
│       ├── pages/       # Page components
│       ├── index.css    # Global styles
│       └── main.tsx     # App entry point
├── .env.example         # Environment variables template
├── DEPLOYMENT.md        # Deployment guide
├── server.js            # Express server entry point
├── vercel.json          # Vercel configuration
└── README.md            # This file
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### AI Features
- `POST /api/ai/chat` - Chat with AI advisor
- `POST /api/ai/categorize` - Auto-categorize transaction
- `POST /api/ai/receipt` - Scan receipt

### Dashboard & Reports
- `GET /api/dashboard` - Get dashboard data
- `POST /api/reports/send` - Send email report
