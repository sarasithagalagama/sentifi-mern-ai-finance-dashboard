import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, MoreHorizontal, Loader } from 'lucide-react';
import { transactionApi } from '../api/transactionApi';
import TransactionModal from '../components/TransactionModal';

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionApi.getTransactions();
      setTransactions(data.transactions || []);
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => 
    (tx.description || tx.merchantName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tx.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{display:'flex', justifyContent:'center', padding:'2rem'}}><Loader className="animate-spin" /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTransactions}
      />

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 300 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
             <Filter size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Filter
          </button>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            + New Transaction
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {error ? (
            <div style={{padding: '1rem', color: 'var(--danger)'}}>{error}</div>
        ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
            <tr style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '16px' }}>Transaction</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: 40, height: 40, 
                    borderRadius: '50%', 
                    background: tx.type === 'income' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {tx.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <span style={{ fontWeight: 500 }}>{tx.description || tx.merchantName || 'Untitled'}</span>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{tx.category}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{new Date(tx.date).toLocaleDateString()}</td>
                <td style={{ fontWeight: 600, color: tx.type === 'income' ? 'var(--success)' : 'var(--text-primary)' }}>
                  {tx.type === 'income' ? '+' : '-'}{Math.abs(tx.amount).toFixed(2)}
                </td>
                <td>
                  <span className={`badge ${tx.status === 'Completed' ? 'badge-success' : 'badge-blue'}`} style={{background: tx.status === 'Pending' ? 'var(--bg-tertiary)' : undefined, color: tx.status === 'Pending' ? '#faad14' : undefined }}>
                    {tx.status || 'Completed'}
                  </span>
                </td>
                <td>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
                <tr><td colSpan={6} style={{padding:'2rem', textAlign:'center', color:'var(--text-secondary)'}}>No transactions found</td></tr>
            )}
          </tbody>
        </table>
        )}
        
        {/* Pagination mock (Functional if API supported query) */}
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '1rem', borderTop: '1px solid var(--border)' }}>
           <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Previous</button>
           <button style={{ background: 'var(--primary)', border: 'none', width: 24, height: 24, borderRadius: 4, cursor: 'pointer' }}>1</button>
           <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
