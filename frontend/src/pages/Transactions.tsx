import React, { useState } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, MoreHorizontal } from 'lucide-react';

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Data
  const transactions = [
    { id: 1, name: 'Spotify Premium', category: 'Entertainment', date: '2024-03-24', amount: -14.99, type: 'expense', status: 'Completed' },
    { id: 2, name: 'Freelance Payment', category: 'Income', date: '2024-03-23', amount: 1250.00, type: 'income', status: 'Completed' },
    { id: 3, name: 'Grocery Store', category: 'Food', date: '2024-03-22', amount: -85.50, type: 'expense', status: 'Completed' },
    { id: 4, name: 'Uber Ride', category: 'Transport', date: '2024-03-22', amount: -24.00, type: 'expense', status: 'Pending' },
    { id: 5, name: 'Electricity Bill', category: 'Utilities', date: '2024-03-20', amount: -145.00, type: 'expense', status: 'Completed' },
    { id: 6, name: 'Coffee Shop', category: 'Food', date: '2024-03-20', amount: -4.50, type: 'expense', status: 'Completed' },
    { id: 7, name: 'Client Bonus', category: 'Income', date: '2024-03-19', amount: 500.00, type: 'income', status: 'Completed' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 300 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#888' }} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" style={{ background: '#333', color: '#fff' }}>
             <Filter size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Filter
          </button>
          <button className="btn-primary">
            + New Transaction
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#262626', borderBottom: '1px solid #333' }}>
            <tr style={{ textAlign: 'left', color: '#888' }}>
              <th style={{ padding: '16px' }}>Transaction</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} style={{ borderBottom: '1px solid #333' }}>
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
                  <span style={{ fontWeight: 500 }}>{tx.name}</span>
                </td>
                <td style={{ color: '#aaa' }}>{tx.category}</td>
                <td style={{ color: '#aaa' }}>{tx.date}</td>
                <td style={{ fontWeight: 600, color: tx.type === 'income' ? 'var(--success)' : '#fff' }}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                </td>
                <td>
                  <span className={`badge ${tx.status === 'Completed' ? 'badge-success' : 'badge-blue'}`} style={{background: tx.status === 'Pending' ? '#333' : undefined, color: tx.status === 'Pending' ? '#faad14' : undefined }}>
                    {tx.status}
                  </span>
                </td>
                <td>
                  <button style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination mock */}
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '1rem', borderTop: '1px solid #333' }}>
           <button style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>Previous</button>
           <button style={{ background: 'var(--primary)', border: 'none', width: 24, height: 24, borderRadius: 4, cursor: 'pointer' }}>1</button>
           <button style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>2</button>
           <button style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>3</button>
           <button style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
