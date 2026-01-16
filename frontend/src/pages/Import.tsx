import { Upload, FileText, Download, CheckCircle } from 'lucide-react';

const Import = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Upload Zone */}
      <div className="card" style={{ 
        height: 300, 
        border: '2px dashed var(--border)', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--card-accent)',
        cursor: 'pointer',
        transition: 'border-color 0.2s'
      }}>
        <div style={{ 
          width: 64, height: 64, 
          borderRadius: '50%', 
          background: 'rgba(74, 222, 128, 0.1)', 
          color: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          <Upload size={32} />
        </div>
        <h3>Drop CSV or Excel file here</h3>
        <p className="text-mute" style={{ marginTop: '0.5rem' }}>or click to separate</p>
        <button className="btn-primary" style={{ marginTop: '1.5rem', minWidth: 150 }}>
          Select File
        </button>
      </div>

      {/* Templates & History */}
      <div className="dashboard-grid">
         {/* Templates */}
         <div className="card">
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
             <FileText size={24} color="var(--primary)" />
             <h3>Templates</h3>
           </div>
           <p className="text-mute text-small" style={{ marginBottom: '1.5rem' }}>
             Download our standard template to ensure your data is imported correctly.
           </p>
           <button style={{ 
             display: 'flex', alignItems: 'center', gap: '0.5rem',
             background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)',
             padding: '8px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer'
           }}>
             <Download size={16} /> Download CSV Template
           </button>
         </div>

         {/* Recent Imports */}
          <div className="card">
            <h3>Recent Imports</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {/* Mock data removed. Future: Fetch from backend */}
               <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)' }}>
                 No recent file imports
               </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Import;

