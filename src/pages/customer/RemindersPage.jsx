import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Shield,
  Award,
  Calendar,
  AlertTriangle,
  Car,
  Wrench
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { formatDate } from '../../utils/formatters';

// Auto-calculate days remaining from dueDate vs today
const calcDaysRemaining = (dueDate) => {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.round((due - today) / (1000 * 60 * 60 * 24));
};

// Auto-set urgency based on days remaining
const calcUrgency = (days) => {
  if (days === null) return 'LOW';
  if (days <= 0)  return 'OVERDUE';
  if (days <= 30) return 'HIGH';
  if (days <= 60) return 'MEDIUM';
  return 'LOW';
};

export const RemindersPage = () => {
  const { currentUser } = useAuth();
  const { reminders } = useData();
  const [filterType, setFilterType] = useState('ALL');

  // Enrich each reminder with live-calculated days & urgency
  const myReminders = (reminders || [])
    .filter((r) => !r.userId || r.userId === currentUser?.id || r.userId === 'usr-cust-1' || !currentUser)
    .map((r) => {
      const days = calcDaysRemaining(r.dueDate);
      const urgency = calcUrgency(days);
      return { ...r, daysRemaining: days, urgency };
    })
    // Sort: overdue first, then closest due date
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const filteredReminders = myReminders.filter((r) => {
    if (filterType === 'ALL') return true;
    return r.type === filterType;
  });

  const getReminderIcon = (type) => {
    switch (type) {
      case 'NEXT_SERVICE':        return <Wrench size={22} style={{ color: 'var(--primary)' }} />;
      case 'INSURANCE_EXPIRY':   return <Shield size={22} style={{ color: 'var(--accent-green)' }} />;
      case 'PUC_EXPIRY':         return <Award size={22} style={{ color: 'var(--warning-text)' }} />;
      case 'PERIODIC_MAINTENANCE': return <Calendar size={22} style={{ color: 'var(--purple)' }} />;
      default:                   return <Clock size={22} style={{ color: 'var(--primary)' }} />;
    }
  };

  const getBorderColor = (type) => {
    if (type === 'PUC_EXPIRY')          return 'var(--warning)';
    if (type === 'NEXT_SERVICE')        return 'var(--primary)';
    if (type === 'INSURANCE_EXPIRY')    return 'var(--accent-green)';
    return 'var(--purple)';
  };

  const getDaysBadge = (days, urgency) => {
    if (urgency === 'OVERDUE')
      return { label: 'Overdue', bg: 'var(--danger-light)', color: 'var(--danger-text)' };
    if (days === 0)
      return { label: 'Due Today', bg: 'var(--danger-light)', color: 'var(--danger-text)' };
    if (urgency === 'HIGH')
      return { label: `${days} Days Left`, bg: '#fef3c7', color: '#92400e' };
    if (urgency === 'MEDIUM')
      return { label: `${days} Days Left`, bg: 'var(--primary-light)', color: 'var(--primary)' };
    return { label: `${days} Days Left`, bg: 'var(--bg-subtle)', color: 'var(--text-secondary)' };
  };

  return (
    <div>
      <PageHeader
        title="Vehicle Reminders & Compliance"
        subtitle="Automated alerts for periodic maintenance, insurance renewals, and mandatory PUC emission compliance"
        breadcrumbs={[{ label: 'Reminders' }]}
        actions={
          <Link to="/customer/book" className="btn btn-primary">
            Schedule Maintenance &rarr;
          </Link>
        }
      />

      {/* Summary Counts */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Overdue',   count: myReminders.filter(r => r.urgency === 'OVERDUE').length,  color: 'var(--danger)',        bg: 'var(--danger-light)' },
          { label: 'Urgent',    count: myReminders.filter(r => r.urgency === 'HIGH').length,     color: '#92400e',              bg: '#fef3c7' },
          { label: 'Upcoming',  count: myReminders.filter(r => r.urgency === 'MEDIUM').length,   color: 'var(--primary)',       bg: 'var(--primary-light)' },
          { label: 'Low Risk',  count: myReminders.filter(r => r.urgency === 'LOW').length,      color: 'var(--text-secondary)', bg: 'var(--bg-subtle)' },
        ].map((s) => (
          <div key={s.label} style={{ backgroundColor: s.bg, borderRadius: 'var(--radius-lg)', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.count}</span>
            <span style={{ fontSize: '0.85rem', color: s.color, fontWeight: 600 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'ALL',                  label: 'All Reminders' },
          { key: 'NEXT_SERVICE',         label: 'Next Service Due' },
          { key: 'INSURANCE_EXPIRY',     label: 'Insurance' },
          { key: 'PUC_EXPIRY',           label: 'PUC / Emission' },
          { key: 'PERIODIC_MAINTENANCE', label: 'Periodic Maintenance' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key)}
            className={`btn btn-sm ${filterType === tab.key ? 'btn-primary' : 'btn-secondary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reminders Grid */}
      {filteredReminders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <AlertTriangle size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
          <p>No reminders found for this category.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filteredReminders.map((rem) => {
            const badge = getDaysBadge(rem.daysRemaining, rem.urgency);
            return (
              <div
                key={rem.id}
                className="card card-hover"
                style={{
                  backgroundColor: '#ffffff',
                  borderTop: `4px solid ${getBorderColor(rem.type)}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.5rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '10px',
                      backgroundColor: 'var(--bg-subtle)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {getReminderIcon(rem.type)}
                    </div>

                    <span style={{
                      fontSize: '0.75rem', fontWeight: 800,
                      backgroundColor: badge.bg, color: badge.color,
                      padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)'
                    }}>
                      {badge.label}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    {rem.title}
                  </h3>

                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Car size={14} /> {rem.vehicleName}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1rem' }}>
                    {rem.description}
                  </p>
                </div>

                {/* Footer */}
                <div style={{
                  paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Due: <strong>{formatDate(rem.dueDate)}</strong>
                  </div>
                  <Link to="/customer/book" className="btn btn-primary btn-sm">
                    {rem.actionRequired || 'Book Now'} &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

