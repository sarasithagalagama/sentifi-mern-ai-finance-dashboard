import { Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Budgets = () => {
  const budgets = [
    { category: 'Food & Dining', limit: 600, spent: 450, color: '#4ade80' },
    { category: 'Transportation', limit: 400, spent: 380, color: '#f59e0b' },
    { category: 'Housing', limit: 1200, spent: 1200, color: '#ef4444' },
    { category: 'Entertainment', limit: 200, spent: 50, color: '#3b82f6' },
  ];

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
        <button className="btn-primary">
          <Plus size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Create Budget
        </button>
      </div>

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
                   stroke="none"
                 >
                   {budgets.map((bs, i) => <Cell key={i} fill={bs.color}/>)}
                 </Pie>
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div>
             <h3>Total Budget</h3>
             <h2 style={{ fontSize: '2rem' }}>$2,400</h2>
             <span className="text-mute">of $3,000 limit</span>
           </div>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
           <h3>Remaining Safe to Spend</h3>
           <h2 style={{ fontSize: '2rem', color: 'var(--success)' }}>$600.00</h2>
           <span className="text-mute">Daily average: $45.20</span>
        </div>
      </div>

      {/* Budget List */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {budgets.map((b) => {
          const percent = Math.min((b.spent / b.limit) * 100, 100);
          return (
            <div key={b.category} className="card">
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <div style={{ width: 10, height: 10, borderRadius: '50%', background: b.color }} />
                   <h3>{b.category}</h3>
                 </div>
                 <span className="badge" style={{ background: '#333' }}>
                   {percent >= 100 ? 'Exceeded' : percent > 80 ? 'Warning' : 'On Track'}
                 </span>
               </div>
               
               <div style={{ marginBottom: '0.5rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                   <span className="text-mute text-small">Spent</span>
                   <span style={{ fontWeight: 600 }}>${b.spent} / ${b.limit}</span>
                 </div>
                 <div style={{ width: '100%', height: 8, background: '#333', borderRadius: 4 }}>
                   <div style={{ width: `${percent}%`, height: '100%', background: b.color, borderRadius: 4 }} />
                 </div>
               </div>

               <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                 <span className="text-small text-mute">{100 - percent > 0 ? `${(100 - percent).toFixed(0)}% Left` : '0% Left'}</span>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Budgets;
