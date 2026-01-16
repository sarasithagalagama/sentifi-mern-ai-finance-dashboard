import React, { useState } from 'react';
import { X } from 'lucide-react';
import { investmentApi } from '../api/investmentApi';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    value: '',
    color: '#3b82f6'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await investmentApi.createInvestment({
        ...formData,
        value: Number(formData.value)
      });
      onSuccess();
      onClose();
      setFormData({
         name: '',
         category: '',
         value: '',
         color: '#3b82f6'
      });
    } catch (error) {
      console.error(error);
      alert('Failed to create investment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'var(--modal-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', right: 16, top: 16, background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '1.5rem' }}>Add Asset</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Asset Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Bitcoin, Tesla, Gold"
              style={{ width: '100%', padding: '0.75rem', background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
             <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Category</label>
             <select
               required
               value={formData.category}
               onChange={e => setFormData({...formData, category: e.target.value})}
               style={{ width: '100%', padding: '0.75rem', background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
             >
               <option value="">Select Category</option>
               <option value="Stocks">Stocks</option>
               <option value="Crypto">Crypto</option>
               <option value="Bonds">Bonds</option>
               <option value="Real Estate">Real Estate</option>
               <option value="Commodities">Commodities</option>
               <option value="Cash">Cash</option>
             </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Current Value ($)</label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              value={formData.value}
              onChange={e => setFormData({...formData, value: e.target.value})}
              placeholder="0.00"
              style={{ width: '100%', padding: '0.75rem', background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Color</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#a855f7', '#ec4899', '#6366f1'].map(color => (
                <div 
                  key={color}
                  onClick={() => setFormData({...formData, color})}
                  style={{
                    width: 32, height: 32, borderRadius: '50%', background: color, cursor: 'pointer',
                    border: formData.color === color ? '2px solid var(--text-primary)' : '2px solid transparent'
                  }}
                />
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Saving...' : 'Add Asset'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvestmentModal;
