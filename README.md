# MERN Expense Tracker - Professional Grade Financial Management App

A sophisticated expense tracking application built with the MERN stack, featuring AI-powered insights, multi-currency support, budget management, and automated recurring transactions.

## 🌟 Features

### Core Functionality
- **💳 Transaction Management**: Full CRUD operations with advanced filtering and search
- **📊 Budget Tracking**: Set category-wise monthly limits with 80% and 100% notifications
- **💱 Multi-Currency Support**: Real-time exchange rate conversion via ExchangeRate API
- **🔄 Recurring Transactions**: Automated daily/weekly/monthly transaction creation via cron jobs
- **📈 Data Visualization**: Interactive charts and analytics with Recharts

### AI-Powered Features
- **🤖 AI Financial Coach**: Get personalized financial advice using Google Gemini API
- **📸 Receipt Scanner**: Upload receipts with client-side OCR (Tesseract.js)
- **🏷️ Smart Categorization**: Auto-categorize transactions based on merchant names

### Advanced Features
- **📥 CSV/Excel Import**: Bulk upload transactions from bank statements
- **🔐 Secure Authentication**: JWT with HttpOnly cookies and refresh tokens
- **🎨 Modern UI**: Rich, responsive design with smooth animations
- **📱 PWA Ready**: Installable progressive web app (to be implemented)

## 🛠️ Tech Stack

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication & authorization
- **Multer & Cloudinary** - File upload handling
- **node-cron** - Scheduled tasks
- **@google/generative-ai** - Gemini API for AI features
- **csv-parser & xlsx** - File parsing

### Frontend (To Be Completed)
- **React 18 & TypeScript** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Tesseract.js** - Client-side OCR
- **react-hot-toast** - Notifications

## 📁 Project Structure

```
mern-finance-dashboard/
├── backend/
│   ├── config/         # Database and service configurations
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Auth, upload, error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic layer
│   └── utils/          # Helper functions
├── frontend/          # React application (in progress)
├── server.js          # Express server entry point
├── .env              # Environment variables
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ installed
- MongoDB Atlas account (or local MongoDB)
- API Keys:
  - [Gemini API Key](https://aistudio.google.com/app/apikey) (free)
  - [ExchangeRate API Key](https://www.exchangerate-api.com/) (free tier)
  - [Cloudinary Account](https://cloudinary.com/) (optional, for receipt uploads)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd mern-finance-dashboard
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Configure environment variables**

Edit `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
NODE_ENV=development

JWT_ACCESS_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

GEMINI_API_KEY=your_gemini_api_key
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key

# Optional: For receipt uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

4. **Start the backend server**
```bash
npm run dev
```

The API server will run on `http://localhost:5000`

5. **Install frontend dependencies (in progress)**
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - Get all transactions (with filters)
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get single transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/analytics` - Get spending analytics

**Query Parameters:**
- `category` - Filter by category
- `type` - Filter by type (income/expense)
- `startDate` - Start date for range
- `endDate` - End date for range
- `search` - Search in description/merchant
- `limit` - Results per page
- `skip` - Pagination offset

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create/update budget
- `GET /api/budgets/:id` - Get single budget
- `DELETE /api/budgets/:id` - Delete budget
- `GET /api/budgets/notifications` - Get budget alerts

### AI Features
- `POST /api/ai/chat` - Get financial advice
  ```json
  { "query": "How can I save more on groceries?" }
  ```
- `POST /api/ai/categorize` - Auto-categorize transaction
  ```json
  { "merchantName": "Starbucks", "description": "Coffee" }
  ```
- `POST /api/ai/scan-receipt` - Upload receipt image
  - Send as multipart/form-data with `receipt` field

### Import
- `POST /api/import/csv` - Import transactions from CSV/Excel
- `GET /api/import/template` - Download CSV template

## 📊 CSV Import Format

Download the template from `/api/import/template` or use this format:

```csv
Date,Amount,Category,Description,Type,Currency
2024-01-01,50.00,Food & Dining,Grocery shopping,expense,USD
2024-01-02,3000.00,Income,Monthly salary,income,USD
```

## 🔐 Security Features

- **JWT Authentication**: Access tokens (15min) + Refresh tokens (7 days)
- **HttpOnly Cookies**: Tokens stored securely in cookies
- **Password Hashing**: bcrypt with salt
- **Rate Limiting**: 100 requests per 15 minutes
- **Helmet.js**: Security headers
- **CORS**: Configured for frontend origin

## 🎯 Architecture Highlights

### Clean Architecture
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Models**: Define data structure and validation
- **Utilities**: Reusable helper functions

### Features Implemented

✅ **JWT Authentication with Refresh Tokens**
- Secure HttpOnly cookie storage
- Automatic token refresh mechanism
- Role-based access control

✅ **Multi-Currency Transactions**
- Real-time exchange rate fetching
- Currency conversion with caching (1-hour TTL)
- Support for 150+ currencies

✅ **Budget Management**
- Category-wise monthly limits
- Automatic spending calculation
- Smart notifications at 80% and 100%

✅ **Recurring Transactions**
- Cron job runs daily at midnight
- Supports daily, weekly, monthly frequencies
- Auto-creates transactions based on templates

✅ **AI Integration**
- Gemini API for financial coaching
- Context-aware advice based on transaction history
- Auto-categorization using LLM

✅ **CSV/Excel Import**
- Supports both CSV and XLSX formats
- Flexible column name matching
- Batch processing with error handling

## 🧪 Testing the API

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Add a Transaction
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "amount": 50.00,
    "category": "Food & Dining",
    "description": "Lunch at restaurant",
    "type": "expense",
    "date": "2024-01-15"
  }'
```

### 3. Get Financial Advice
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "query": "How can I reduce my monthly expenses?"
  }'
```

## 📝 Default Categories

The system supports these default categories:
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Travel
- Personal Care
- Other (fallback)

## 🔮 Future Enhancements

- [ ] Complete React frontend implementation
- [ ] PWA with offline support
- [ ] Real-time notifications (Socket.io)
- [ ] Export reports to PDF
- [ ] Email notifications for budget alerts
- [ ] Two-factor authentication
- [ ] Social login (Google, GitHub)
- [ ] Mobile app (React Native)

## 📄 License

MIT License - feel free to use this project for learning or your portfolio!

## 🤝 Contributing

This is a portfolio/internship project. Feedback and suggestions are welcome!

## 📧 Contact

Created by [Your Name] - [your.email@example.com]

---

**Note**: This is an educational project demonstrating modern full-stack development practices suitable for a 2026 internship application.