import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

const Statistics = () => {
  const annualData = [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Feb', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Apr', income: 2780, expense: 3908 },
    { name: 'May', income: 1890, expense: 4800 },
    { name: 'Jun', income: 2390, expense: 3800 },
    { name: 'Jul', income: 3490, expense: 4300 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Header Stats */}
      <div className="overview-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card">
          <span className="text-mute">Average Daily Spend</span>
          <h2>$124.50</h2>
        </div>
        <div className="card">
          <span className="text-mute">Highest Spend Category</span>
          <h2>Rent & Utilities</h2>
        </div>
        <div className="card">
          <span className="text-mute">Projected Savings</span>
          <h2 style={{ color: 'var(--primary)' }}>$2,450</h2>
        </div>
      </div>

      {/* Main Trends Chart */}
      <div className="card">
        <h3>Annual Income & Expense Trends</h3>
        <div style={{ height: 300, marginTop: 'var(--spacing-md)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={annualData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Area type="monotone" dataKey="income" stroke="var(--primary)" fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
