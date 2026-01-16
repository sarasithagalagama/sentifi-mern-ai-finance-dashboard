import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Statistics from './pages/Statistics';
import Investments from './pages/Investments';
import Import from './pages/Import';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes with Layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout title="Dashboard" subtitle="Finance & Investment">
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/statistics" element={
            <ProtectedRoute>
              <Layout title="Statistics" subtitle="Financial Analytics">
                <Statistics />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/transactions" element={
            <ProtectedRoute>
              <Layout title="Transactions" subtitle="Manage your spending">
                <Transactions />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/budgets" element={
            <ProtectedRoute>
              <Layout title="Budgeting" subtitle="Plan your finances">
                <Budgets />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/investments" element={
            <ProtectedRoute>
              <Layout title="Investments" subtitle="Portfolio Tracking">
                <Investments />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/import" element={
            <ProtectedRoute>
              <Layout title="Import" subtitle="Upload financial data">
                <Import />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
