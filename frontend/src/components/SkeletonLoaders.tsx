// Skeleton loader components for better loading UX

export const CardSkeleton = () => (
  <div className="card" style={{ 
    background: 'var(--card-bg)',
    animation: 'pulse 1.5s ease-in-out infinite'
  }}>
    <div style={{ 
      height: '20px', 
      width: '60%', 
      background: 'var(--border)', 
      borderRadius: '4px',
      marginBottom: '1rem'
    }} />
    <div style={{ 
      height: '32px', 
      width: '40%', 
      background: 'var(--border)', 
      borderRadius: '4px'
    }} />
  </div>
);

export const TableRowSkeleton = () => (
  <tr>
    <td>
      <div style={{ 
        height: '16px', 
        width: '80%', 
        background: 'var(--border)', 
        borderRadius: '4px'
      }} />
    </td>
    <td>
      <div style={{ 
        height: '16px', 
        width: '60%', 
        background: 'var(--border)', 
        borderRadius: '4px'
      }} />
    </td>
    <td>
      <div style={{ 
        height: '16px', 
        width: '70%', 
        background: 'var(--border)', 
        borderRadius: '4px'
      }} />
    </td>
    <td>
      <div style={{ 
        height: '16px', 
        width: '50%', 
        background: 'var(--border)', 
        borderRadius: '4px'
      }} />
    </td>
  </tr>
);

export const ChartSkeleton = () => (
  <div style={{ 
    height: '300px', 
    background: 'var(--card-accent)', 
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'pulse 1.5s ease-in-out infinite'
  }}>
    <div style={{ color: 'var(--text-secondary)' }}>Loading chart...</div>
  </div>
);

export const ListSkeleton = ({ count = 3 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ 
        padding: '1rem',
        marginBottom: '0.5rem',
        background: 'var(--card-accent)',
        borderRadius: 'var(--radius-md)',
        animation: 'pulse 1.5s ease-in-out infinite',
        animationDelay: `${i * 0.1}s`
      }}>
        <div style={{ 
          height: '16px', 
          width: '70%', 
          background: 'var(--border)', 
          borderRadius: '4px',
          marginBottom: '0.5rem'
        }} />
        <div style={{ 
          height: '14px', 
          width: '40%', 
          background: 'var(--border)', 
          borderRadius: '4px'
        }} />
      </div>
    ))}
  </>
);
