import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { dashboardApi } from '../api/dashboardApi';
import { Loader } from 'lucide-react';

const Statistics = () => {
  const [data, setData] = useState<{
      annualData: any[];
      overview: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const loadData = async () => {
          try {
              const res = await dashboardApi.getDashboardData();
              // res.data contains { overview, charts: { annualData, ... } }
              setData({
                  annualData: res.charts.annualData,
                  overview: res.overview
              });
          } catch (e) {
              console.error(e);
          } finally {
              setLoading(false);
          }
      }
      loadData();
  }, []);

  if (loading) return <div style={{display:'flex', justifyContent:'center', padding:'3rem'}}><Loader className="animate-spin"/></div>;
  if (!data) return <div>Failed to load data</div>;

  const { annualData, overview } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Header Stats */}
      <div className="overview-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card">
          <span className="text-mute">Total Balance</span>
          <h2>${overview.totalBalance.toLocaleString()}</h2>
        </div>
        <div className="card">
          <span className="text-mute">Net Worth</span>
          <h2>${overview.netWorth.toLocaleString()}</h2>
        </div>
        <div className="card">
          <span className="text-mute">Projected Savings (Goal %)</span>
          <h2 style={{ color: 'var(--primary)' }}>{overview.savingsPercentage}%</h2>
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
