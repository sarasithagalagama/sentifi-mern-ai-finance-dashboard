import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Sparkles } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Force styles for autofill
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getInputBorderColor = (fieldName: string) => {
    if (focusedInput === fieldName) return 'var(--primary)';
    if (fieldName === 'name' && name) return 'var(--primary)';
    if (fieldName === 'email' && email) return 'var(--primary)';
    if (fieldName === 'password' && password) return 'var(--primary)';
    if (fieldName === 'confirmPassword' && confirmPassword) return 'var(--primary)';
    return 'var(--border)';
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{
        background: '#1E1E1E',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid #333',
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        overflow: 'hidden'
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
            <Sparkles size={32} />
          </div>
          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 700, 
            letterSpacing: '-0.025em',
            marginBottom: '0.5rem',
            background: 'linear-gradient(to right, #fff, #a3a3a3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Create Account</h1>
          <p className="text-mute" style={{ fontSize: '0.95rem' }}>Start your financial journey today</p>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '20px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            color: '#F87171',
            fontSize: '0.9rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
             <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="name" style={{ 
                position: 'absolute', 
                left: '16px', 
                top: name || focusedInput === 'name' ? '-10px' : '16px',
                fontSize: name || focusedInput === 'name' ? '0.75rem' : '0.95rem',
                color: focusedInput === 'name' ? 'var(--primary)' : 'var(--text-secondary)',
                background: '#1E1E1E',
                padding: '0 6px',
                transition: 'all 0.2s',
                pointerEvents: 'none',
                zIndex: 10
            }}>Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
              required
              style={{
                  width: '100%',
                  padding: '16px',
                  background: 'transparent',
                  border: `1px solid ${getInputBorderColor('name')}`,
                  borderRadius: '14px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s'
              }}
            />
          </div>

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

          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="confirmPassword" style={{ 
                position: 'absolute', 
                left: '16px', 
                top: confirmPassword || focusedInput === 'confirmPassword' ? '-10px' : '16px',
                fontSize: confirmPassword || focusedInput === 'confirmPassword' ? '0.75rem' : '0.95rem',
                color: focusedInput === 'confirmPassword' ? 'var(--primary)' : 'var(--text-secondary)',
                background: '#1E1E1E',
                padding: '0 6px',
                transition: 'all 0.2s',
                pointerEvents: 'none',
                zIndex: 10
            }}>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedInput('confirmPassword')}
              onBlur={() => setFocusedInput(null)}
              required
              style={{
                  width: '100%',
                  padding: '16px',
                  background: 'transparent',
                  border: `1px solid ${getInputBorderColor('confirmPassword')}`,
                  borderRadius: '14px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s'
              }}
            />
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer" style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', marginLeft: '6px' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
