import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        marginBottom: '0.5rem'
      }}
    >
      <Link
        to="/"
        style={{
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem'
        }}
      >
        <Home size={14} />
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight size={13} style={{ color: 'var(--text-light)' }} />
          {item.link ? (
            <Link
              to={item.link}
              style={{
                color: 'var(--text-muted)',
                fontWeight: 500
              }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
