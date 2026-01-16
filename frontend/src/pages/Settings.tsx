import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authApi } from '../api/authApi';
import { User, Lock, Moon, Sun, Save, Loader, Check } from 'lucide-react';

const Settings = () => {
  const { user, setUser } = useAuth();
  const { theme, toggleTheme, preset, setPreset } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    defaultCurrency: 'USD',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        defaultCurrency: user.defaultCurrency || 'USD'
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        setLoading(false);
        return;
    }

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        defaultCurrency: formData.defaultCurrency
      };

      if (formData.newPassword) {
          if (!formData.currentPassword) {
               setMessage({ type: 'error', text: 'Current password is required to set a new password' });
               setLoading(false);
               return;
          }
          updateData.currentPassword = formData.currentPassword;
          updateData.newPassword = formData.newPassword;
      }

      const res = await authApi.updateProfile(updateData);
      
      setUser(res.user);
      localStorage.setItem('user', JSON.stringify(res.user));
      
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setFormData(prev => ({
          ...prev, 
          currentPassword: '', 
          newPassword: '', 
          confirmNewPassword: '' 
      }));

    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Settings Header */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2>Settings</h2>
        <p className="text-mute">Manage your account preferences</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        
        {/* Appearance Section */}
        <div className="card">
           <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
              <div style={{ padding: 8, background: 'var(--bg-tertiary)', borderRadius: '50%', color: 'var(--text-primary)' }}>
                 {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                  <h3>Appearance</h3>
                  <p className="text-small text-mute">Customize the look and feel</p>
              </div>
           </div>
           
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--card-accent)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '1rem' }}>
               <span>Interface Theme</span>
               <button 
                 onClick={toggleTheme}
                 style={{ 
                     background: 'var(--bg-tertiary)', 
                     border: '1px solid var(--border)',
                     color: 'var(--text-primary)',
                     padding: '0.5rem 1rem',
                     borderRadius: 'var(--radius-full)',
                     cursor: 'pointer',
                     display: 'flex', alignItems: 'center', gap: 8
                 }}
               >
                   {theme === 'dark' ? <><Moon size={16} /> Dark Mode</> : <><Sun size={16} /> Light Mode</>}
               </button>
           </div>

           <div style={{ padding: '1rem', background: 'var(--card-accent)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
             <div style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>Color Palette</div>
             <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <PaletteOption 
                  label="Emerald" 
                  color="#4ade80" 
                  active={preset === 'emerald'} 
                  onClick={() => setPreset('emerald')} 
                />
                <PaletteOption 
                  label="Neon" 
                  color="#DAFF01" 
                  active={preset === 'neon'} 
                  onClick={() => setPreset('neon')} 
                />
                <PaletteOption 
                  label="Amethyst" 
                  color="#d8b4fe" 
                  active={preset === 'amethyst'} 
                  onClick={() => setPreset('amethyst')} 
                />
                <PaletteOption 
                  label="Oceanic" 
                  color="#38bdf8" 
                  active={preset === 'oceanic'} 
                  onClick={() => setPreset('oceanic')} 
                />
             </div>
           </div>
        </div>

        {/* Profile Section */}
        <div className="card">
           <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
              <div style={{ padding: 8, background: 'var(--bg-tertiary)', borderRadius: '50%', color: 'var(--text-primary)' }}>
                 <User size={20} />
              </div>
              <div>
                  <h3>Profile Details</h3>
                  <p className="text-small text-mute">Update your personal information</p>
              </div>
           </div>

           <form onSubmit={handleSubmit}>
              {message && (
                  <div style={{ 
                      padding: '1rem', 
                      borderRadius: 'var(--radius-md)', 
                      marginBottom: '1rem',
                      background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
                      border: message.type === 'success' ? '1px solid var(--success)' : '1px solid var(--danger)'
                  }}>
                      {message.text}
                  </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                  <div>
                      <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
                       <input 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange}
                          style={{ color: 'var(--text-primary)' }}
                       />
                  </div>
                  <div>
                      <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
                       <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleChange}
                          style={{ color: 'var(--text-primary)' }}
                       />
                  </div>
              </div>

               <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Default Currency</label>
                  <select 
                      name="defaultCurrency"
                      value={formData.defaultCurrency}
                      onChange={handleChange}
                       style={{ 
                           width: '100%', 
                           padding: '1rem', 
                           background: 'var(--input-bg)', 
                           border: '1px solid var(--input-border)', 
                           borderRadius: 'var(--radius-md)',
                           color: 'var(--text-primary)'
                       }}
                  >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="LKR">LKR (Rs)</option>
                  </select>
               </div>
               
               <div style={{ borderTop: '1px solid var(--border)', margin: 'var(--spacing-lg) 0' }} />
               
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                   <div style={{ padding: 8, background: 'var(--bg-tertiary)', borderRadius: '50%', color: 'var(--text-primary)' }}>
                      <Lock size={20} />
                   </div>
                  <div>
                      <h3>Security</h3>
                      <p className="text-small text-mute">Change your password</p>
                  </div>
               </div>

               <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Current Password</label>
                   <input 
                       type="password" 
                       name="currentPassword" 
                       value={formData.currentPassword} 
                       onChange={handleChange}
                       placeholder="Required to set new password"
                       style={{ color: 'var(--text-primary)' }}
                   />
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                  <div>
                      <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>New Password</label>
                       <input 
                          type="password" 
                          name="newPassword" 
                          value={formData.newPassword} 
                          onChange={handleChange}
                          style={{ color: 'var(--text-primary)' }}
                       />
                  </div>
                  <div>
                      <label style={{ display: 'block', marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Confirm Password</label>
                       <input 
                          type="password" 
                          name="confirmNewPassword" 
                          value={formData.confirmNewPassword} 
                          onChange={handleChange}
                          style={{ color: 'var(--text-primary)' }}
                       />
                  </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                 <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loading}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}
                 >
                    {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Changes
                 </button>
              </div>

           </form>
        </div>

      </div>
    </div>
  );
};

const PaletteOption = ({ label, color, active, onClick }: { label: string, color: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '0.5rem 1rem',
      background: active ? 'var(--bg-tertiary)' : 'transparent',
      border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-full)',
      cursor: 'pointer',
      color: 'var(--text-primary)',
      transition: 'all 0.2s'
    }}
  >
    <div style={{ width: 16, height: 16, borderRadius: '50%', background: color }} />
    <span>{label}</span>
    {active && <Check size={14} style={{ color: 'var(--primary)' }} />}
  </button>
);

export default Settings;
