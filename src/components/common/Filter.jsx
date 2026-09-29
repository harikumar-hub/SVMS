import React from 'react';
import { Filter as FilterIcon } from 'lucide-react';

export const Filter = ({
  options = [],
  value,
  onChange,
  label = 'Filter by',
  allLabel = 'All Statuses',
  className = ''
}) => {
  return (
    <div
      className={`filter-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '0.85rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none'
        }}
      >
        <FilterIcon size={16} />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-control"
        style={{
          paddingLeft: '2.3rem',
          paddingRight: '2.2rem',
          height: '42px',
          fontWeight: 500,
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1em',
          cursor: 'pointer'
        }}
      >
        <option value="">{allLabel}</option>
        {options.map((opt, idx) => {
          if (typeof opt === 'string') {
            return (
              <option key={idx} value={opt}>
                {opt.replace(/_/g, ' ')}
              </option>
            );
          }
          return (
            <option key={opt.value ?? idx} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};
