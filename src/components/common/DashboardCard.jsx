import React from 'react';

export const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'primary', // primary, success, warning, danger, info
  onClick,
  className = ''
}) => {
  const colorStyles = {
    primary: { bg: 'var(--primary-light)', text: 'var(--primary)' },
    success: { bg: 'var(--success-light)', text: 'var(--success)' },
    warning: { bg: 'var(--warning-light)', text: 'var(--warning-text)' },
    danger: { bg: 'var(--danger-light)', text: 'var(--danger-text)' },
    info: { bg: '#e0f2fe', text: '#0369a1' },
    purple: { bg: '#f5f3ff', text: '#6b21a8' }
  };

  const style = colorStyles[color] || colorStyles.primary;

  return (
    <div
      className={`card card-hover ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.35rem 1.5rem',
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)'
      }}
    >
      <div>
        <span
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            fontFamily: 'var(--font-heading)'
          }}
        >
          {title}
        </span>
        <h3
          style={{
            fontSize: '28px',
            fontWeight: 700,
            marginTop: '0.25rem',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            lineHeight: 1.15
          }}
        >
          {value}
        </h3>
        {subtitle && (
          <p
            style={{
              fontSize: '13.5px',
              color: 'var(--text-secondary)',
              marginTop: '0.25rem',
              fontWeight: 400
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {Icon && (
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: style.bg,
            color: style.text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: `1px solid ${style.bg}`
          }}
        >
          <Icon size={24} strokeWidth={2.2} />
        </div>
      )}
    </div>
  );
};
