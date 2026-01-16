import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowRightLeft, 
  PiggyBank, 
  LineChart, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: LineChart, label: 'Statistics', path: '/statistics' }, // Placeholder path
    { icon: ArrowRightLeft, label: 'Transactions', path: '/transactions' },
    { icon: Wallet, label: 'Budgeting', path: '/budgets' },
    { icon: PiggyBank, label: 'Investments', path: '/investments' }, // Placeholder path
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'var(--spacing-sm)', 
        marginBottom: 'var(--spacing-2xl)',
        cursor: 'pointer'
      }} onClick={() => navigate('/')}>
        <div style={{
          width: 32,
          height: 32,
          background: 'var(--primary)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#000'
        }}>%</div>
        <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>Yanz</span>
      </div>

      {/* Main Menu */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? '#000' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                transition: 'var(--transition)'
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Bottom Menu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
          padding: '12px 16px',
          cursor: 'pointer',
          color: 'var(--text-secondary)'
        }}>
          <Settings size={20} />
          <span>Settings</span>
        </div>
        
        <div onClick={handleLogout} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
          padding: '12px 16px',
          cursor: 'pointer',
          color: 'var(--text-secondary)'
        }}>
          <LogOut size={20} />
          <span>Log Out</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
