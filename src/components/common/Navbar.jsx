import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Car,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
  Shield,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { NotificationPanel } from './NotificationPanel';

export const Navbar = ({ onToggleSidebar }) => {
  const { currentUser, role, logout, isAuthenticated } = useAuth();
  const { notifications } = useData();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const userNotifications = notifications.filter(
    (n) => !n.role || n.role === role || n.userId === currentUser?.id
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabels = {
    ADMIN: 'Admin',
    CUSTOMER: 'Customer',
    SERVICE_PROVIDER: 'Service Provider',
    TECHNICIAN: 'Technician',
    INVENTORY_MANAGER: 'Inventory Manager'
  };

  return (
    <>
      <header
        style={{
          height: 'var(--navbar-height)',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-default)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem'
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="btn btn-secondary btn-icon"
              aria-label="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
          )}

          <Link
            to={
              isAuthenticated
                ? role === 'ADMIN'
                  ? '/admin/dashboard'
                  : role === 'SERVICE_PROVIDER'
                  ? '/provider/dashboard'
                  : role === 'TECHNICIAN'
                  ? '/technician/dashboard'
                  : role === 'INVENTORY_MANAGER'
                  ? '/inventory/dashboard'
                  : '/customer/dashboard'
                : '/'
            }
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '11px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 10px rgba(37,99,235,0.35)',
                flexShrink: 0
              }}
            >
              <Car size={22} />
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Poppins', var(--font-heading)", letterSpacing: '-0.03em' }}>
              NexaCare <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.04em' }}>VSMS</span>
            </span>
          </Link>
        </div>

        {/* Right Section: Role Badge + Notifications + User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {isAuthenticated && (
            <span
              className="badge"
              style={{
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                border: '1px solid var(--primary-border)',
                fontWeight: 600,
                fontSize: '13px',
                padding: '0.35rem 0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Shield size={13} />
              <span>{roleLabels[role] || 'Customer'}</span>
            </span>
          )}

          {/* Notifications */}
          {isAuthenticated && (
            <button
              onClick={() => setIsNotifOpen(true)}
              className="btn btn-secondary btn-icon"
              style={{ position: 'relative' }}
              aria-label="View notifications"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    backgroundColor: 'var(--danger)',
                    color: '#ffffff',
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.2rem 0.4rem',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div style={{ textAlign: 'left', display: 'none' }} className="d-md-block">
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {currentUser?.name || 'User'}
                  </div>
                </div>
                <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
              </button>

              {isProfileOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-default)',
                    width: '180px',
                    padding: '0.4rem',
                    zIndex: 100
                  }}
                >
                  <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.25rem' }}>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700 }}>{currentUser?.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{currentUser?.email}</div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '4px',
                      fontSize: '0.825rem',
                      color: 'var(--text-primary)',
                      textDecoration: 'none'
                    }}
                  >
                    <User size={15} /> My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '4px',
                      fontSize: '0.825rem',
                      color: 'var(--danger-text)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
