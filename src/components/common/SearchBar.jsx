import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search records...',
  className = '',
  width = '100%'
}) => {
  return (
    <div
      className={`search-bar-container ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: width,
        maxWidth: '100%'
      }}
    >
      <Search
        size={18}
        style={{
          position: 'absolute',
          left: '0.9rem',
          color: 'var(--text-light)',
          pointerEvents: 'none'
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-control"
        style={{
          paddingLeft: '2.4rem',
          paddingRight: value ? '2.4rem' : '0.9rem',
          height: '42px'
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            if (onClear) onClear();
            else onChange('');
          }}
          style={{
            position: 'absolute',
            right: '0.75rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px'
          }}
          title="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
