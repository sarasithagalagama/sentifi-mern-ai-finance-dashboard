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

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Google Gemini API key
- Firebase project (for Google login)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sentifi-mern-ai-finance-dashboard.git
   cd sentifi-mern-ai-finance-dashboard
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   GEMINI_API_KEY=your_gemini_api_key
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. **Configure Firebase**
   
   Edit `frontend/src/firebaseConfig.ts` with your Firebase credentials:
   ```typescript
   const firebaseConfig = {
     apiKey: "your_api_key",
     authDomain: "your_project.firebaseapp.com",
     projectId: "your_project_id",
     // ... other config
   };
   ```

5. **Run the application**
   ```bash
   # Start backend server (from root directory)
   npm run dev

   # In a new terminal, start frontend (from root directory)
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import repository on [Vercel](https://vercel.com/new)
3. Add environment variables
4. Deploy!

**Required Environment Variables:**
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `GEMINI_API_KEY`
- `CLIENT_URL`
- `NODE_ENV=production`

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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Google Gemini AI for intelligent financial insights
- Firebase for seamless authentication
- MongoDB Atlas for reliable cloud database
- Vercel for effortless deployment
- The open-source community for amazing tools and libraries

## 📧 Support

For support, email your-email@example.com or open an issue in the repository.

---

<div align="center">

**Built with ❤️ using the MERN Stack**

⭐ Star this repo if you find it helpful!

</div>