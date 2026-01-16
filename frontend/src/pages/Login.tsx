import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ 
      background: 'radial-gradient(circle at 50% 50%, #1e1e1e 0%, #121212 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="auth-card" style={{ 
        background: 'rgba(30, 30, 30, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid #333',
        maxWidth: 420
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
             width: 48, height: 48, 
             background: 'var(--primary)', 
             borderRadius: 12, 
             display: 'flex', alignItems: 'center', justifyContent: 'center',
             margin: '0 auto 1rem auto',
             color: '#000'
          }}>
            <LogIn size={24} />
          </div>
          <h1>Welcome Back</h1>
          <p className="text-mute">Enter your credentials to access your finance dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              style={{ background: '#121212', borderColor: '#333' }}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label htmlFor="password">Password</label>
              <Link to="#" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Forgot password?</Link>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{ background: '#121212', borderColor: '#333' }}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading} style={{ 
            marginTop: '1rem', 
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary)',
            color: '#000',
            fontWeight: 700
          }}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer" style={{ marginTop: '2rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
