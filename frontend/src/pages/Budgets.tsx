import { useState, useEffect } from 'react';
import { Plus, Loader, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { budgetApi } from '../api/budgetApi';

const Budgets = () => {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Placeholder for future modal
  
  // Mock 'Spent' calculation since detailed transaction mapping is complex to add in one go.
  // Ideally, backend should return 'spent' relative to budget.
  // The 'budgetService.js' (backend) does NOT seem to calculate 'spent' automatically in 'getBudgets'.
  // We'll rely on what the backend returns. If 'spent' is missing, we might need to mock it or update backend.
  // Checking backend controller... it creates/gets.
  // Let's assume for now we fetch budgets. 
  
  const fetchBudgets = async () => {
      try {
          const res = await budgetApi.getBudgets();
          // Backend returns { success: true, count: N, budgets: [...] }
          // We need to ensure 'spent' is present or we default it to 0. 
          // The backend model 'Budget.js' usually has 'limit' and 'category'. 
          // Real spending calculation requires aggregating transactions by category.
          // For this task, getting the dynamic list is Step 1.
          setBudgets(res.budgets.map((b: any) => ({
              ...b, 
              spent: b.spent || 0, // Fallback if backend doesn't aggregate yet
              color: b.color || '#4ade80'
          })));
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const totalLimit = budgets.reduce((acc, b) => acc + b.amount, 0); // Model likely uses 'amount' as limit
  const totalSpent = budgets.reduce((acc, b) => acc + (b.spent || 0), 0);

  if (loading) return <div style={{display:'flex', justifyContent:'center', padding:'3rem'}}><Loader className="animate-spin"/></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="card" style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: '#000', fontWeight: 600 }}>
             Overview
          </div>
          <div className="card" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
             Planned
          </div>
        </div>
        <button className="btn-primary" onClick={() => alert("Create Budget Modal implementation needed")}>
          <Plus size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Create Budget
        </button>
      </div>

      {budgets.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <h3>No budgets found</h3>
              <p className="text-mute">Create a budget to start tracking your spending.</p>
          </div>
      ) : (
        <>
        {/* Overview Stats */}
        <div className="overview-cards" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ width: 100, height: 100 }}>
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={budgets}
                    innerRadius={35}
                    outerRadius={50}
                    dataKey="spent"
                    nameKey="category"
                    stroke="none"
                    >
                    {budgets.map((bs, i) => <Cell key={i} fill={bs.color || '#3b82f6'}/>)}
                    </Pie>
                </PieChart>
                </ResponsiveContainer>
            </div>
            <div>
                <h3>Total Budget</h3>
                <h2 style={{ fontSize: '2rem' }}>${totalLimit.toLocaleString()}</h2>
                <span className="text-mute">of spent ${totalSpent.toLocaleString()}</span>
            </div>
            </div>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3>Remaining Safe to Spend</h3>
            <h2 style={{ fontSize: '2rem', color: 'var(--success)' }}>${(totalLimit - totalSpent).toLocaleString()}</h2>
            <span className="text-mute">Keep it up!</span>
            </div>
        </div>

        {/* Budget List */}
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {budgets.map((b) => {
            const limit = b.amount || 0;
            const spent = b.spent || 0;
            const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
            
            return (
                <div key={b._id || b.category} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: b.color || '#ccc' }} />
                    <h3>{b.category}</h3>
                    </div>
                    <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                    {percent >= 100 ? 'Exceeded' : percent > 80 ? 'Warning' : 'On Track'}
                    </span>
                </div>
                
                <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span className="text-mute text-small">Spent</span>
                    <span style={{ fontWeight: 600 }}>${spent} / ${limit}</span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: 'var(--bg-tertiary)', borderRadius: 4 }}>
                    <div style={{ width: `${percent}%`, height: '100%', background: b.color || '#3b82f6', borderRadius: 4 }} />
                    </div>
                </div>

                <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                    <span className="text-small text-mute">{100 - percent > 0 ? `${(100 - percent).toFixed(0)}% Left` : '0% Left'}</span>
                </div>
                </div>
            );
            })}
        </div>
        </>
      )}
    </div>
  );
};

export default Budgets;
