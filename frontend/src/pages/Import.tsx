import { useState, useRef } from 'react';
import { Upload, FileText, Download, CheckCircle, AlertCircle, X } from 'lucide-react';
import { importApi } from '../api/importApi';
import toast from 'react-hot-toast';

const Import = () => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a CSV or Excel file');
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const result = await importApi.uploadFile(file);
      setUploadResult(result.results);
      
      if (result.results.success > 0) {
        toast.success(`Successfully imported ${result.results.success} transactions!`);
      }
      
      if (result.results.failed > 0) {
        toast.error(`${result.results.failed} transactions failed to import`);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await importApi.downloadTemplate();
      toast.success('Template downloaded!');
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Upload Zone */}
      <div 
        className="card" 
        style={{ 
          height: 300, 
          border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border)'}`, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          background: dragActive ? 'rgba(74, 222, 128, 0.05)' : 'var(--card-accent)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          position: 'relative'
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        
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
        <h3>{uploading ? 'Uploading...' : 'Drop CSV or Excel file here'}</h3>
        <p className="text-mute" style={{ marginTop: '0.5rem' }}>or click to select</p>
        <button 
          className="btn-primary" 
          style={{ marginTop: '1.5rem', minWidth: 150 }}
          disabled={uploading}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          {uploading ? 'Uploading...' : 'Select File'}
        </button>
      </div>

      {/* Upload Results */}
      {uploadResult && (
        <div className="card" style={{ background: 'var(--card-accent)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Import Results</h3>
            <button 
              onClick={() => setUploadResult(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ 
              flex: 1, 
              padding: '1rem', 
              background: 'rgba(74, 222, 128, 0.1)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(74, 222, 128, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CheckCircle size={20} color="var(--primary)" />
                <span style={{ fontWeight: 600 }}>Success</span>
              </div>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                {uploadResult.success}
              </p>
            </div>
            
            {uploadResult.failed > 0 && (
              <div style={{ 
                flex: 1, 
                padding: '1rem', 
                background: 'rgba(239, 68, 68, 0.1)', 
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <AlertCircle size={20} color="#ef4444" />
                  <span style={{ fontWeight: 600 }}>Failed</span>
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>
                  {uploadResult.failed}
                </p>
              </div>
            )}
          </div>

          {uploadResult.errors && uploadResult.errors.length > 0 && (
            <div>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Errors:</h4>
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                {uploadResult.errors.slice(0, 5).map((err: any, idx: number) => (
                  <div key={idx} style={{ 
                    padding: '0.5rem', 
                    background: 'rgba(239, 68, 68, 0.05)', 
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem'
                  }}>
                    {err.error}
                  </div>
                ))}
                {uploadResult.errors.length > 5 && (
                  <p className="text-mute text-small">
                    ... and {uploadResult.errors.length - 5} more errors
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

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
           <button 
             onClick={handleDownloadTemplate}
             style={{ 
               display: 'flex', alignItems: 'center', gap: '0.5rem',
               background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)',
               padding: '8px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer'
             }}
           >
             <Download size={16} /> Download CSV Template
           </button>
         </div>

         {/* Recent Imports */}
          <div className="card">
            <h3>Recent Imports</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {uploadResult ? (
                <div style={{ 
                  padding: '1rem', 
                  background: 'var(--card-accent)', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>Latest Import</span>
                    <span className="text-mute text-small">Just now</span>
                  </div>
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                    <span className="text-small" style={{ color: 'var(--primary)' }}>
                      ✓ {uploadResult.success} imported
                    </span>
                    {uploadResult.failed > 0 && (
                      <span className="text-small" style={{ color: '#ef4444' }}>
                        ✗ {uploadResult.failed} failed
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)' }}>
                  No recent file imports
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default Import;
