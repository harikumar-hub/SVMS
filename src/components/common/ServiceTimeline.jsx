import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { getStatusConfig } from '../../utils/statusHelpers';

const SIMPLE_STEPS = [
  { key: 'PENDING', label: 'Booking' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'TECHNICIAN_ASSIGNED', label: 'Tech Assigned' },
  { key: 'INSPECTION', label: 'Inspection' },
  { key: 'IN_PROGRESS', label: 'Service' },
  { key: 'COMPLETED', label: 'Completed' }
];

export const ServiceTimeline = ({ currentStatus, className = '' }) => {
  const isRejected = currentStatus === 'REJECTED';
  const isCancelled = currentStatus === 'CANCELLED';

  const getStepIndex = () => {
    if (isRejected || isCancelled) return -1;
    if (currentStatus === 'PENDING') return 0;
    if (currentStatus === 'ACCEPTED') return 1;
    if (currentStatus === 'TECHNICIAN_ASSIGNED' || currentStatus === 'VEHICLE_RECEIVED') return 2;
    if (currentStatus === 'INSPECTION') return 3;
    if (currentStatus === 'IN_PROGRESS' || currentStatus === 'PARTS_REQUIRED' || currentStatus === 'QUALITY_CHECK') return 4;
    if (currentStatus === 'COMPLETED' || currentStatus === 'VEHICLE_READY') return 5;
    return 0;
  };

  const activeIndex = getStepIndex();

  if (isRejected || isCancelled) {
    return (
      <div
        style={{
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: isRejected ? 'var(--danger-light)' : 'var(--bg-subtle)',
          color: isRejected ? 'var(--danger-text)' : 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          fontWeight: 600
        }}
      >
        <AlertCircle size={18} />
        <span>Service {isRejected ? 'Declined by Workshop' : 'Cancelled'}</span>
      </div>
    );
  }

  return (
    <div className={className} style={{ width: '100%', padding: '0.5rem 0' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}
      >
        {SIMPLE_STEPS.map((step, idx) => {
          const isPassed = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div
              key={step.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                flex: 1,
                position: 'relative',
                minWidth: '60px'
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: isPassed
                    ? 'var(--success)'
                    : isCurrent
                    ? 'var(--primary)'
                    : 'var(--bg-subtle)',
                  color: isPassed || isCurrent ? '#ffffff' : 'var(--text-muted)',
                  border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border-default)',
                  zIndex: 2
                }}
              >
                {isPassed ? <Check size={14} /> : idx + 1}
              </div>

              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? 'var(--primary)' : isPassed ? 'var(--text-primary)' : 'var(--text-muted)',
                  marginTop: '0.35rem',
                  whiteSpace: 'nowrap'
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
