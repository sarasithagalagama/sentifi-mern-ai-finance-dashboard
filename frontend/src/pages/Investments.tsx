import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, PieChart as PieIcon, Loader, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { investmentApi } from '../api/investmentApi';
import InvestmentModal from '../components/InvestmentModal';

const Investments = () => {
    const [portfolioData, setPortfolioData] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [portfolioRes, txRes] = await Promise.all([
                investmentApi.getPortfolio(),
                investmentApi.getTransactions()
            ]);
            setPortfolioData(portfolioRes.portfolio);
            setTransactions(txRes.transactions);
        } catch (error) {
            console.error("Failed to load investment data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalValue = portfolioData.reduce((acc, item) => acc + item.value, 0);

  if (loading) return <div style={{display:'flex', justifyContent:'center', padding:'2rem'}}><Loader className="animate-spin" /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <InvestmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />
       {/* Portfolio Summary */}
       <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) 1fr', gap: 'var(--spacing-lg)' }}>
         
         {/* Asset Allocation */}
         <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', position: 'relative' }}>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-primary" 
                style={{ position: 'absolute', top: 16, right: 16, padding: '8px 12px', fontSize: '0.9rem' }}
             >
                <Plus size={16} style={{marginRight: 4}} /> Add Asset
             </button>

            <div>
              <h3>Total Portfolio Value</h3>
              <h1 style={{ fontSize: '3rem', margin: '1rem 0' }}>${totalValue.toLocaleString()}</h1>
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
                      <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }} itemStyle={{ color: 'var(--text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Performers (Mocked for now as we need history to calc) */}
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
             <tr style={{textAlign: 'left', color: 'var(--text-secondary)'}}>
               <th style={{padding: '12px'}}>Asset</th>
               <th>Type</th>
               <th>Date</th>
               <th>Amount</th>
               <th>Status</th>
             </tr>
           </thead>
           <tbody>
             {transactions.map((tx, i) => (
               <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                 <td style={{padding: '16px 12px', fontWeight: 600}}>{tx.asset}</td>
                 <td>
                   <span className={tx.type === 'Buy' ? 'text-success' : 'text-primary'}>{tx.type}</span>
                 </td>
                 <td style={{color: 'var(--text-secondary)'}}>{new Date(tx.date).toLocaleDateString()}</td>
                 <td style={{fontWeight: 600}}>${tx.amount.toLocaleString()}</td>
                 <td><span className="badge badge-success">{tx.status}</span></td>
               </tr>
             ))}
             {transactions.length === 0 && (
                <tr><td colSpan={5} style={{textAlign:'center', padding:'2rem', color:'var(--text-secondary)'}}>No recent activity</td></tr>
             )}
           </tbody>
         </table>
       </div>
    </div>
  );
};

export default Investments;
