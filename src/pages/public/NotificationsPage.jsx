import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Filter, ExternalLink, Calendar, Wrench, AlertTriangle, ShieldCheck, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { timeAgo, formatDateTime } from '../../utils/formatters';

export const NotificationsPage = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const { currentUser, role } = useAuth();
  const [filterType, setFilterType] = useState('ALL');

  const userNotifications = notifications.filter(
    (n) => !n.role || n.role === role || n.userId === currentUser?.id
  );

  const filteredNotifications = userNotifications.filter((n) => {
    if (filterType === 'UNREAD') return !n.read;
    if (filterType === 'SERVICES') return n.type === 'SERVICE_PROGRESS' || n.type === 'NEW_REQUEST' || n.type === 'VEHICLE_READY';
    if (filterType === 'INVENTORY') return n.type === 'PARTS_REQUEST' || n.type === 'LOW_STOCK';
    return true;
  });

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const getNotifIcon = (type) => {
    switch (type) {
      case 'SERVICE_PROGRESS': return <Wrench size={20} style={{ color: 'var(--primary)' }} />;
      case 'NEW_REQUEST': return <Calendar size={20} style={{ color: 'var(--primary)' }} />;
      case 'LOW_STOCK': return <AlertTriangle size={20} style={{ color: 'var(--danger)' }} />;
      case 'VEHICLE_READY': return <ShieldCheck size={20} style={{ color: 'var(--accent-green)' }} />;
      default: return <Bell size={20} style={{ color: 'var(--primary)' }} />;
    }
  };

  return (
    <div>
      <PageHeader
        title="Notification Center"
        subtitle="Stay updated on service stages, appointments, parts approvals, and reminders"
        breadcrumbs={[{ label: 'Notifications' }]}
        actions={
          unreadCount > 0 && (
            <Button
              variant="secondary"
              icon={CheckCheck}
              onClick={() => markAllNotificationsRead(role)}
            >
              Mark All as Read ({unreadCount})
            </Button>
          )
        }
      />

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'ALL', label: `All Alerts (${userNotifications.length})` },
          { key: 'UNREAD', label: `Unread (${unreadCount})` },
          { key: 'SERVICES', label: 'Services & Workflows' },
          { key: 'INVENTORY', label: 'Inventory & Parts' }
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

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className="card card-hover"
              style={{
                backgroundColor: notif.read ? '#ffffff' : 'var(--primary-light)',
                border: `1px solid ${notif.read ? 'var(--border-default)' : 'var(--primary-border)'}`,
                padding: '1.25rem 1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-default)',
                    flexShrink: 0
                  }}
                >
                  {getNotifIcon(notif.type)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, backgroundColor: 'var(--primary)', color: '#ffffff', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                        NEW
                      </span>
                    )}
                    {notif.badge && <StatusBadge status={notif.badge} />}
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                    {notif.message}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>{formatDateTime(notif.timestamp)}</span>
                    <span>&bull;</span>
                    <span>{timeAgo(notif.timestamp)}</span>
                  </div>
                </div>
              </div>

              {notif.link && (
                <Link
                  to={notif.link}
                  className="btn btn-outline-primary btn-sm"
                  style={{ flexShrink: 0 }}
                >
                  View Details <ExternalLink size={14} />
                </Link>
              )}
            </div>
          ))
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', backgroundColor: '#ffffff' }}>
            <Bell size={40} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              No notifications found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              There are no notifications matching the selected filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
