import { 
  DollarSign, 
  CreditCard, 
  Target, 
  Landmark, 
  MoreHorizontal 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, Tooltip 
} from 'recharts';

const Dashboard = () => {
  // Mock Data (Replace with API data later)
  const expenseData = [
    { name: 'Food & Dining', value: 500, color: '#4ade80' },
    { name: 'Transportation', value: 300, color: '#22c55e' },
    { name: 'Rent & Utilities', value: 1200, color: '#86efac' },
    { name: 'Others', value: 200, color: '#ffffff' },
  ];

  const incomeVsExpense = [
    { name: 'Income', value: 8000, fill: '#22c55e' },
    { name: 'Expenses', value: 6000, fill: '#86efac' },
  ];

  return (
    <div>
      {/* 1. Quick Financial Overview */}
      <div className="card overview-cards-container" style={{ padding: 0, border: 'none', background: 'transparent' }}>
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
            <div>
              <h3>Quick Financial Overview</h3>
              <p className="text-mute text-small">Stay on Top of Your Finances</p>
            </div>
            <button className="badge" style={{ background: '#333', color: '#fff', border: 'none' }}>
              Sort by <span style={{ color: 'var(--primary)' }}>This Month ▼</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-md)' }}>
            {/* Total Balance */}
            <div style={{ 
              background: 'var(--primary)', 
              borderRadius: 'var(--radius-lg)', 
              padding: 'var(--spacing-lg)',
              color: '#000',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 160
            }}>
              <div style={{ 
                width: 40, height: 40, 
                background: 'rgba(0,0,0,0.1)', 
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 'var(--spacing-md)'
              }}>
                <DollarSign size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>$17,100</h2>
                <span style={{ fontWeight: 600, opacity: 0.8 }}>Total Balance</span>
              </div>
            </div>

            {/* Expenses */}
            <div className="card" style={{ 
                background: '#18181b', 
                border: '1px solid #333',
                display: 'flex', flexDirection: 'column', justifyContent: 'center' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                <CreditCard className="text-mute" size={24} />
              </div>
              <h2 style={{ marginBottom: 4 }}>$2,300</h2>
              <span className="text-mute">Expenses</span>
            </div>

            {/* Savings Goal */}
            <div className="card" style={{ background: '#18181b', border: '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <Target className="text-mute" size={24} />
              </div>
              <h2 style={{ marginBottom: 4 }}>+ 75%</h2>
              <span className="text-mute">Savings Goal</span>
            </div>

            {/* Net Worth */}
            <div className="card" style={{ background: '#18181b', border: '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <Landmark className="text-mute" size={24} />
              </div>
              <h2 style={{ marginBottom: 4 }}>$9,000</h2>
              <span className="text-mute">Net Worth</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Sidebar Widgets */}
      <div className="dashboard-grid">
        
        {/* Left Column: Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
             {/* Expense Breakdown */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                <h3>Financial Graphs</h3>
                <MoreHorizontal className="text-mute" />
              </div>
              <div style={{ height: 200, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div style={{ 
                  position: 'absolute', top: '50%', left: '50%', 
                  transform: 'translate(-50%, -50%)', textAlign: 'center' 
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 'bold' }}>Expense</div>
                  <div style={{ fontSize: '0.7rem', color: '#888' }}>Breakdown</div>
                </div>
              </div>
              <div style={{ marginTop: 'var(--spacing-md)' }}>
                {expenseData.map((item) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                       <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                       <span className="text-small text-mute">{item.name}</span>
                     </div>
                     <span className="text-small" style={{ fontWeight: 600 }}>${item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Income vs Expenses */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                <h3>Income vs Expenses</h3>
                <MoreHorizontal className="text-mute" />
              </div>
              <div style={{ height: 200 }}>
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={incomeVsExpense} barSize={40}>
                     <XAxis dataKey="name" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                     <Tooltip 
                       contentStyle={{ background: '#333', border: 'none', borderRadius: 8 }}
                       itemStyle={{ color: '#fff' }}
                     />
                     <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {incomeVsExpense.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
              </div>
              <div style={{ marginTop: 'var(--spacing-md)', fontSize: '0.8rem', color: '#aaa', textAlign: 'center' }}>
                You saved <span style={{ color: 'var(--primary)' }}>42%</span> of your income this month!
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Goals & Bills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          
          {/* Financial Goals */}
          <div className="card">
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                <div>
                  <h3>Financial Goals</h3>
                  <span className="text-mute text-small">Stay on track</span>
                </div>
                <MoreHorizontal className="text-mute" />
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {['Buy a House', 'New Car Fund', 'Vacation Trip'].map((goal, i) => (
                  <div key={goal}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                       <span style={{ fontWeight: 600 }}>{goal}</span>
                       <span className="text-small text-mute">{[65, 30, 85][i]}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888', marginBottom: 4 }}>
                       <span>${['13,000', '3,000', '1,700'][i]}</span>
                       <span>${['20,000', '10,000', '2,000'][i]}</span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: '#333', borderRadius: 4 }}>
                       <div style={{ 
                         width: `${[65, 30, 85][i]}%`, 
                         height: '100%', 
                         background: i === 0 ? 'var(--primary)' : i === 1 ? '#ef4444' : '#f59e0b',
                         borderRadius: 4
                       }} />
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Upcoming Bills */}
          <div className="card">
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                <div>
                  <h3>Upcoming Bills</h3>
                  <span className="text-mute text-small">Never miss a payment</span>
                </div>
                <MoreHorizontal className="text-mute" />
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
               {['Electricity Bill', 'Internet Subs'].map((bill, i) => (
                 <div key={bill} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', background: '#1c1c1c', padding: 12, borderRadius: 12 }}>
                    <div style={{ 
                      background: '#333', padding: '6px 12px', borderRadius: 8, textAlign: 'center'
                    }}>
                       <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{[29, 30][i]}</div>
                       <div style={{ fontSize: '0.7rem', color: '#aaa' }}>Agst</div>
                    </div>
                    <div>
                       <div style={{ fontWeight: 600 }}>{bill}</div>
                       <div className="text-small text-mute">${[75, 40][i]} • {[3, 4][i]} Days Left</div>
                    </div>
                 </div>
               ))}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
