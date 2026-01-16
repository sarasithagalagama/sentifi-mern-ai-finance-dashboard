import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          💰 Expense Tracker
        </Link>

        {isAuthenticated ? (
          <>
            <ul className="nav-menu">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/transactions">Transactions</Link></li>
              <li><Link to="/budgets">Budgets</Link></li>
              <li><Link to="/import">Import</Link></li>
            </ul>
            <div className="nav-user">
              <span>Hi, {user?.name}!</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          </>
        ) : (
          <div className="nav-auth">
            <Link to="/login" className="btn-link">Login</Link>
            <Link to="/register" className="btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
