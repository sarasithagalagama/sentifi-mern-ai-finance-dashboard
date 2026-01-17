import { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, MoreHorizontal, Loader, Trash2 } from 'lucide-react';
import { transactionApi } from '../api/transactionApi';
import TransactionModal from '../components/TransactionModal';
import toast from 'react-hot-toast';

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredTransactions.map(tx => tx._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} transaction(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);
      await transactionApi.bulkDeleteTransactions(selectedIds);
      toast.success(`Successfully deleted ${selectedIds.length} transaction(s)`);
      setSelectedIds([]);
      fetchTransactions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete transactions');
    } finally {
      setDeleting(false);
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
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {selectedIds.length > 0 && (
            <button 
              className="btn-primary" 
              onClick={handleBulkDelete}
              disabled={deleting}
              style={{ 
                background: 'var(--danger)', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Trash2 size={18} />
              {deleting ? 'Deleting...' : `Delete (${selectedIds.length})`}
            </button>
          )}
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
              <th style={{ padding: '16px', width: '40px' }}>
                <input 
                  type="checkbox" 
                  checked={selectedIds.length === filteredTransactions.length && filteredTransactions.length > 0}
                  onChange={handleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
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
                <td style={{ padding: '16px' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(tx._id)}
                    onChange={() => handleSelectOne(tx._id)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
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
                  <button className="btn-icon">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
                <tr><td colSpan={7} style={{padding:'2rem', textAlign:'center', color:'var(--text-secondary)'}}>No transactions found</td></tr>
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
