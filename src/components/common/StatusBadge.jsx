import React from 'react';
import { getStatusConfig } from '../../utils/statusHelpers';

export const StatusBadge = ({ status, className = '' }) => {
  const config = getStatusConfig(status);

  return (
    <span
      className={`badge ${config.badgeClass} ${className}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        borderColor: `${config.color}33`
      }}
    >
      <span
        className="badge-dot"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
};
