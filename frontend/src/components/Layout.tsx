import React from 'react';
import Sidebar from './Sidebar';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "Dashboard", subtitle = "Finance & Investment" }) => {
  const { user } = useAuth();
  
  return (
    <div className="app-container">
      <Sidebar />
      
      <div className="main-wrapper">
        {/* Top Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--spacing-xl)',
          paddingBottom: 0 // Space is handled by content-area
        }}>
          {/* Title Section */}
          <div>
            <h1>{title}</h1>
            <p className="text-mute">{subtitle}</p>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)' }}>
            {/* Search Bar */}
            <div style={{ position: 'relative', width: 300 }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Budgeting, Investments, etc..." 
                style={{ 
                  paddingLeft: 40, 
                  background: 'var(--bg-tertiary)', 
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* User Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600 }}>{user?.name || 'User'}</div>
                <div className="text-small text-mute">Personal Finance</div>
              </div>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#e5e5e5', // Placeholder avatar color
                border: '2px solid var(--border)'
              }}></div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
