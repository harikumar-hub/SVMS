import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Shield,
  Award,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Car,
  ArrowRight,
  Plus,
  Wrench
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';

export const RemindersPage = () => {
  const { currentUser } = useAuth();
  const { reminders, vehicles } = useData();
  const [filterType, setFilterType] = useState('ALL');

  const myReminders = reminders.filter((r) => r.userId === currentUser?.id || !r.userId);

  const filteredReminders = myReminders.filter((r) => {
    if (filterType === 'NEXT_SERVICE') return r.type === 'NEXT_SERVICE';
    if (filterType === 'INSURANCE_EXPIRY') return r.type === 'INSURANCE_EXPIRY';
    if (filterType === 'PUC_EXPIRY') return r.type === 'PUC_EXPIRY';
    if (filterType === 'PERIODIC_MAINTENANCE') return r.type === 'PERIODIC_MAINTENANCE';
    return true;
  });

  const getReminderIcon = (type) => {
    switch (type) {
      case 'NEXT_SERVICE': return <Wrench size={22} style={{ color: 'var(--primary)' }} />;
      case 'INSURANCE_EXPIRY': return <Shield size={22} style={{ color: 'var(--accent-green)' }} />;
      case 'PUC_EXPIRY': return <Award size={22} style={{ color: 'var(--warning-text)' }} />;
      case 'PERIODIC_MAINTENANCE': return <Calendar size={22} style={{ color: 'var(--purple)' }} />;
      default: return <Clock size={22} style={{ color: 'var(--primary)' }} />;
    }
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

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'ALL', label: 'All Reminders' },
          { key: 'NEXT_SERVICE', label: 'Next Service Due' },
          { key: 'INSURANCE_EXPIRY', label: 'Insurance Expirations' },
          { key: 'PUC_EXPIRY', label: 'PUC / Emission' },
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {filteredReminders.map((rem) => {
          const isUrgent = rem.urgency === 'HIGH';

          return (
            <div
              key={rem.id}
              className="card card-hover"
              style={{
                backgroundColor: '#ffffff',
                borderTop: `4px solid ${
                  rem.type === 'PUC_EXPIRY'
                    ? 'var(--warning)'
                    : rem.type === 'NEXT_SERVICE'
                    ? 'var(--primary)'
                    : rem.type === 'INSURANCE_EXPIRY'
                    ? 'var(--accent-green)'
                    : 'var(--purple)'
                }`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getReminderIcon(rem.type)}
                  </div>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      backgroundColor: isUrgent ? 'var(--danger-light)' : 'var(--primary-light)',
                      color: isUrgent ? 'var(--danger-text)' : 'var(--primary)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    {rem.daysRemaining > 0 ? `${rem.daysRemaining} Days Left` : 'Due Today'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  {rem.title}
                </h3>

                <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Car size={15} /> {rem.vehicleName}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {rem.description}
                </p>
              </div>

              {/* Action Bar */}
              <div
                style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Due Date: <strong>{formatDate(rem.dueDate)}</strong>
                </div>

                <Link
                  to="/customer/book"
                  className="btn btn-primary btn-sm"
                >
                  {rem.actionRequired || 'Book Now'} &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
