import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  Target, 
  Landmark, 
  MoreHorizontal,
  Loader
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, Tooltip 
} from 'recharts';
import { dashboardApi } from '../api/dashboardApi';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardApi.getDashboardData();
        setData(res);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div style={{display:'flex', justifyContent:'center', padding:'2rem'}}><Loader className="animate-spin" /></div>;

  // Defaults if data is empty
  const expenseData = data?.charts?.expenseBreakdown || [];
  const incomeVsExpense = data?.charts?.incomeVsExpense || [];
  const goals = data?.goals || [];
  const upcomingBills = data?.upcomingBills || [];
  
  const overview = data?.overview || {
    totalBalance: 0,
    monthlyExpenses: 0,
    savingsPercentage: 0,
    netWorth: 0
  };

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

          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
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
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>${overview.totalBalance.toLocaleString()}</h2>
                <span style={{ fontWeight: 600, opacity: 0.8 }}>Total Balance</span>
              </div>
            </div>

            {/* Expenses */}
            <div className="card" style={{ 
                background: 'var(--card-accent)', 
                border: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                <CreditCard className="text-mute" size={24} />
              </div>
              <h2 style={{ marginBottom: 4 }}>${Math.abs(overview.monthlyExpenses).toLocaleString()}</h2>
              <span className="text-mute">Expenses (Month)</span>
            </div>

            {/* Savings Goal */}
            <div className="card" style={{ background: 'var(--card-accent)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <Target className="text-mute" size={24} />
              </div>
              <h2 style={{ marginBottom: 4 }}>{overview.savingsPercentage}%</h2>
              <span className="text-mute">Savings Goal</span>
            </div>

            {/* Net Worth */}
            <div className="card" style={{ background: 'var(--card-accent)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <Landmark className="text-mute" size={24} />
              </div>
              <h2 style={{ marginBottom: 4 }}>${overview.netWorth.toLocaleString()}</h2>
              <span className="text-mute">Net Worth</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Sidebar Widgets */}
      <div className="dashboard-grid">
        
        {/* Left Column: Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: 'var(--spacing-lg)' }}>
             {/* Expense Breakdown */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                <h3>Financial Graphs</h3>
                <MoreHorizontal className="text-mute" />
              </div>
              {expenseData.length > 0 ? (
                <>
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
                          {expenseData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ 
                      position: 'absolute', top: '50%', left: '50%', 
                      transform: 'translate(-50%, -50%)', textAlign: 'center' 
                    }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Expense</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Breakdown</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 'var(--spacing-md)' }}>
                    {expenseData.map((item: any) => (
                      <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                          <span className="text-small text-mute">{item.name}</span>
                        </div>
                        <span className="text-small" style={{ fontWeight: 600 }}>${Math.abs(item.value).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No expense data yet</div>
              )}
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
                       contentStyle={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 8 }}
                       itemStyle={{ color: 'var(--text-primary)' }}
                     />
                     <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {incomeVsExpense.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
              </div>
              {/* Optional footer summary */}
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
             
             {goals.length > 0 ? (
               <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  {goals.map((goal: any, i: number) => {
                    const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                    return (
                      <div key={goal._id || i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontWeight: 600 }}>{goal.title}</span>
                          <span className="text-small text-mute">{percent}%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888', marginBottom: 4 }}>
                          <span>${goal.currentAmount.toLocaleString()}</span>
                          <span>${goal.targetAmount.toLocaleString()}</span>
                        </div>
                        <div style={{ width: '100%', height: 6, background: 'var(--bg-tertiary)', borderRadius: 4 }}>
                          <div style={{ 
                            width: `${percent}%`, 
                            height: '100%', 
                            background: goal.color || 'var(--primary)',
                            borderRadius: 4
                          }} />
                        </div>
                      </div>
                    );
                  })}
               </div>
             ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>
                    <p>No goals set.</p>
                    {/* Could add a button to add goal here later */}
                </div>
             )}
          </div>

          {/* Upcoming Bills */}
          <div className="card">
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                <div>
                  <h3>Upcoming Recurring</h3>
                  <span className="text-mute text-small">Never miss a payment</span>
                </div>
                <MoreHorizontal className="text-mute" />
             </div>

             {upcomingBills.length > 0 ? (
               <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                 {upcomingBills.map((bill: any, i: number) => (
                   <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', background: 'var(--bg-tertiary)', padding: 12, borderRadius: 12 }}>
                      <div style={{ 
                        background: 'var(--card-accent)', padding: '6px 12px', borderRadius: 8, textAlign: 'center', minWidth: 50
                      }}>
                         <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{bill.date}</div>
                         <div style={{ fontSize: '0.7rem', color: '#aaa' }}>Due</div>
                      </div>
                      <div>
                         <div style={{ fontWeight: 600 }}>{bill.name}</div>
                         <div className="text-small text-mute">${Math.abs(bill.amount).toLocaleString()} • {bill.daysLeft} days left</div>
                      </div>
                   </div>
                 ))}
               </div>
             ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>No upcoming recurring bills</div>
             )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
