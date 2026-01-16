import { TrendingUp, TrendingDown, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Investments = () => {
  const portfolioData = [
    { name: 'Stocks', value: 45000, color: '#4ade80' },
    { name: 'Crypto', value: 15000, color: '#f59e0b' },
    { name: 'Bonds', value: 20000, color: '#3b82f6' },
    { name: 'Real Estate', value: 80000, color: '#a855f7' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
       {/* Portfolio Summary */}
       <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-lg)' }}>
         
         {/* Asset Allocation */}
         <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3>Total Portfolio Value</h3>
              <h1 style={{ fontSize: '3rem', margin: '1rem 0' }}>$160,000</h1>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span className="badge badge-success" style={{ fontSize: '1rem', padding: '8px 16px' }}>
                  <TrendingUp size={16} style={{ display: 'inline', marginRight: 8 }} />
                  +12.5% YTD
                </span>
              </div>
            </div>
            <div style={{ width: 200, height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#333', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Performers */}
         <div className="card">
            <h3>Top Performers</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span>NVDA</span>
                 <span style={{ color: 'var(--success)' }}>+154%</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span>BTC</span>
                 <span style={{ color: 'var(--success)' }}>+89%</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span>AAPL</span>
                 <span style={{ color: 'var(--success)' }}>+22%</span>
               </div>
            </div>
         </div>
       </div>

       {/* Recent Activity */}
       <div className="card">
         <h3>Investment Activity</h3>
         <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
           <thead>
             <tr style={{textAlign: 'left', color: '#888'}}>
               <th style={{padding: '12px'}}>Asset</th>
               <th>Type</th>
               <th>Date</th>
               <th>Amount</th>
               <th>Status</th>
             </tr>
           </thead>
           <tbody>
             {[
               { asset: 'Tesla Inc.', type: 'Buy', date: '2024-03-15', amount: '$2,500', status: 'Completed' },
               { asset: 'Bitcoin', type: 'Buy', date: '2024-03-12', amount: '$500', status: 'Completed' },
               { asset: 'Vanguard ETF', type: 'Dividend', date: '2024-03-01', amount: '$125', status: 'Received' },
             ].map((tx, i) => (
               <tr key={i} style={{ borderTop: '1px solid #333' }}>
                 <td style={{padding: '16px 12px', fontWeight: 600}}>{tx.asset}</td>
                 <td>
                   <span className={tx.type === 'Buy' ? 'text-success' : 'text-primary'}>{tx.type}</span>
                 </td>
                 <td style={{color: '#888'}}>{tx.date}</td>
                 <td style={{fontWeight: 600}}>{tx.amount}</td>
                 <td><span className="badge badge-success">{tx.status}</span></td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );
};

export default Investments;
