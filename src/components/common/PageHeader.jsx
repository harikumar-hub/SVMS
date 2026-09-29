import React from 'react';
import { Breadcrumb } from './Breadcrumb';

export const PageHeader = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  badge
}) => {
  return (
    <div
      style={{
        marginBottom: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
      }}
    >
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                lineHeight: 1.25,
                letterSpacing: '-0.015em'
              }}
            >
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p
              style={{
                fontSize: '15.5px',
                color: 'var(--text-muted)',
                marginTop: '0.35rem',
                lineHeight: 1.5,
                fontFamily: 'var(--font-body)'
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
