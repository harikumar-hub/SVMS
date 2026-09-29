import React from 'react';

export const Loading = ({ message = 'Loading details...', size = 'md' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        gap: '1rem',
        color: 'var(--text-muted)'
      }}
    >
      <div
        style={{
          width: size === 'sm' ? '24px' : size === 'lg' ? '48px' : '36px',
          height: size === 'sm' ? '24px' : size === 'lg' ? '48px' : '36px',
          border: '3px solid var(--border-default)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message}</span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
