import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, X, ExternalLink, Calendar, Wrench, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { timeAgo } from '../../utils/formatters';
import { StatusBadge } from './StatusBadge';

export const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const { currentUser, role } = useAuth();

  if (!isOpen) return null;

  // Filter notifications for current user/role
  const userNotifications = notifications.filter(
    (n) => !n.role || n.role === role || n.userId === currentUser?.id
  );

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const getNotifIcon = (type) => {
    switch (type) {
      case 'SERVICE_PROGRESS': return <Wrench size={18} className="text-primary" />;
      case 'NEW_REQUEST': return <Calendar size={18} className="text-primary" />;
      case 'LOW_STOCK': return <AlertTriangle size={18} className="text-danger" />;
      case 'VEHICLE_READY': return <ShieldCheck size={18} className="text-success" />;
      default: return <Bell size={18} className="text-primary" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.35)',
        backdropFilter: 'blur(2px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.15s ease'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Notifications</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllNotificationsRead(role)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                title="Mark all as read"
              >
                <CheckCheck size={14} /> Mark Read
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '0.35rem',
                borderRadius: '6px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          {userNotifications.length > 0 ? (
            userNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${notif.read ? 'var(--border-subtle)' : 'var(--primary-border)'}`,
                  backgroundColor: notif.read ? '#ffffff' : 'var(--primary-light)',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {!notif.read && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)'
                    }}
                  />
                )}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ marginTop: '0.1rem' }}>{getNotifIcon(notif.type)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {notif.title}
                      </h4>
                    </div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                      {notif.message}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{timeAgo(notif.timestamp)}</span>
                      {notif.link && (
                        <Link
                          to={notif.link}
                          onClick={onClose}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            fontWeight: 600,
                            color: 'var(--primary)'
                          }}
                        >
                          View <ExternalLink size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Bell size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
              <p style={{ fontWeight: 600 }}>No notifications</p>
              <p style={{ fontSize: '0.8rem' }}>You are completely caught up!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid var(--border-default)',
            backgroundColor: '#f8fafc',
            textAlign: 'center'
          }}
        >
          <Link
            to="/notifications"
            onClick={onClose}
            style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}
          >
            Open Full Notification Center &rarr;
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
