import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      input:-webkit-autofill,
      input:-webkit-autofill:hover, 
      input:-webkit-autofill:focus, 
      input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px #1E1E1E inset !important;
        -webkit-text-fill-color: white !important;
        transition: background-color 5000s ease-in-out 0s;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getInputBorderColor = (fieldName: string) => {
    if (focusedInput === fieldName) return 'var(--primary)';
    if (fieldName === 'email' && email) return 'var(--primary)';
    if (fieldName === 'password' && password) return 'var(--primary)';
    return 'var(--border)';
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      
      const googleUser = {
        name: result.user.displayName,
        email: result.user.email,
        googleId: result.user.uid
      };
      
      await loginWithGoogle(token, googleUser);
      navigate('/dashboard');
    } catch (error) {
       console.error("Google Login Error:", error);
    }
  };

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
    <div className="auth-page">
      <div className="auth-card" style={{
        background: '#1E1E1E',
        borderRadius: '24px',
        padding: '2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid #333',
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
      }}>
        {/* Glow Effects */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '200px',
          background: 'var(--primary)',
          opacity: '0.15',
          filter: 'blur(80px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
          <div style={{ 
             width: 64, height: 64, 
             background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(74, 222, 128, 0.05))', 
             borderRadius: '50%', 
             display: 'flex', alignItems: 'center', justifyContent: 'center',
             margin: '0 auto 1.5rem auto',
             color: 'var(--primary)',
             border: '1px solid rgba(74, 222, 128, 0.3)',
             boxShadow: '0 0 20px rgba(74, 222, 128, 0.2)'
          }}>
            <LogIn size={32} />
          </div>
          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 700, 
            letterSpacing: '-0.025em',
            marginBottom: '0.5rem',
            background: 'linear-gradient(to right, #fff, #a3a3a3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Welcome Back</h1>
          <p className="text-mute" style={{ fontSize: '0.95rem' }}>Enter your credentials to access your finance dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="email" style={{ 
                position: 'absolute', 
                left: '16px', 
                top: email || focusedInput === 'email' ? '-10px' : '16px',
                fontSize: email || focusedInput === 'email' ? '0.75rem' : '0.95rem',
                color: focusedInput === 'email' ? 'var(--primary)' : 'var(--text-secondary)',
                background: '#1E1E1E',
                padding: '0 6px',
                transition: 'all 0.2s',
                pointerEvents: 'none',
                zIndex: 10
            }}>Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              required
              style={{
                  width: '100%',
                  padding: '16px',
                  background: 'transparent',
                  border: `1px solid ${getInputBorderColor('email')}`,
                  borderRadius: '14px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s'
              }}
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="password" style={{ 
                position: 'absolute', 
                left: '16px', 
                top: password || focusedInput === 'password' ? '-10px' : '16px',
                fontSize: password || focusedInput === 'password' ? '0.75rem' : '0.95rem',
                color: focusedInput === 'password' ? 'var(--primary)' : 'var(--text-secondary)',
                background: '#1E1E1E',
                padding: '0 6px',
                transition: 'all 0.2s',
                pointerEvents: 'none',
                zIndex: 10
            }}>Password</label>
             <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              required
              style={{
                  width: '100%',
                  padding: '16px',
                  background: 'transparent',
                  border: `1px solid ${getInputBorderColor('password')}`,
                  borderRadius: '14px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s'
              }}
            />
          </div>
          
           <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px' }}>
              <Link to="#" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </Link>
          </div>

          <button 
            type="submit" 
            className="btn-submit" 
            disabled={loading}
             style={{
                marginTop: '10px',
                padding: '16px',
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                background: 'var(--primary)',
                color: '#000',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 12px rgba(74, 222, 128, 0.2)',
                transition: 'all 0.2s'
            }}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', opacity: 0.8 }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, var(--border), transparent)' }}></div>
          <span style={{ padding: '0 10px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>or continue with</span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, var(--border), transparent)' }}></div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          type="button"
          style={{
            width: '100%',
            padding: '14px',
            background: 'white',
            border: 'none',
            borderRadius: '14px',
            color: '#111',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
          onMouseEnter={(e) => {
             e.currentTarget.style.transform = 'translateY(-1px)';
             e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
             e.currentTarget.style.transform = 'translateY(0)';
             e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
        >
           <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
