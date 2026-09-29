import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Calendar,
  Wrench,
  Clock,
  History,
  Bell,
  User,
  Users,
  Building,
  HardHat,
  Boxes,
  ClipboardList,
  AlertTriangle,
  FileBarChart,
  Truck,
  PlusCircle,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const Sidebar = ({ isCollapsed, onCloseMobile }) => {
  const { role, currentUser } = useAuth();
  const { appointments = [], partsRequests = [], spareParts = [], reminders = [] } = useData();
  const location = useLocation();

  // Dynamic counts for badge indicators
  const pendingRequestsCount = appointments.filter((a) => a.status === 'PENDING').length;
  const activeServicesCount = appointments.filter(
    (a) => !['COMPLETED', 'VEHICLE_READY', 'REJECTED', 'CANCELLED'].includes(a.status)
  ).length;
  const pendingPartsCount = partsRequests.filter((p) => p.status === 'PENDING').length;
  const lowStockCount = spareParts.filter((p) => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK').length;
  const activeRemindersCount = reminders.filter((r) => r.status === 'ACTIVE').length;

  // Role Menus
  const getNavLinks = () => {
    switch (role) {
      case 'CUSTOMER':
        return [
          { to: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/customer/vehicles', label: 'My Vehicles', icon: Car },
          { to: '/customer/book', label: 'Book Service', icon: PlusCircle },
          { to: '/customer/appointments', label: 'My Appointments', icon: Calendar },
          { to: '/customer/tracking', label: 'Service Tracking', icon: Activity },
          { to: '/customer/history', label: 'Service History', icon: History },
          { to: '/customer/providers', label: 'Service Center', icon: Building },
          { to: '/customer/reminders', label: 'Reminders', icon: Clock, badge: activeRemindersCount },
          { to: '/customer/notifications', label: 'Notifications', icon: Bell },
          { to: '/customer/profile', label: 'Profile', icon: User }
        ];

      case 'SERVICE_PROVIDER':
        return [
          { to: '/provider/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/provider/requests', label: 'Service Requests', icon: ClipboardList, badge: pendingRequestsCount, badgeColor: 'var(--warning)' },
          { to: '/provider/appointments', label: 'Appointments', icon: Calendar },
          { to: '/provider/technicians', label: 'Technicians', icon: HardHat },
          { to: '/provider/active-services', label: 'Active Services', icon: Activity, badge: activeServicesCount },
          { to: '/provider/records', label: 'Service Records', icon: History },
          { to: '/provider/parts-requests', label: 'Parts Requests', icon: Boxes },
          { to: '/provider/reports', label: 'Reports & Analytics', icon: FileBarChart },
          { to: '/provider/profile', label: 'Workshop Profile', icon: Building }
        ];

      case 'TECHNICIAN':
        return [
          { to: '/technician/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/technician/assigned', label: 'Assigned Services', icon: Wrench, badge: 2 },
          { to: '/technician/request-parts', label: 'Request Parts', icon: PlusCircle },
          { to: '/technician/requests', label: 'Parts Status', icon: Boxes },
          { to: '/technician/completed', label: 'Completed Services', icon: CheckCircle2 },
          { to: '/technician/profile', label: 'My Profile', icon: User }
        ];

      case 'INVENTORY_MANAGER':
        return [
          { to: '/inventory/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/inventory/parts', label: 'Spare Parts Catalog', icon: Boxes },
          { to: '/inventory/stock', label: 'Stock Management', icon: Activity },
          { to: '/inventory/requests', label: 'Parts Requests', icon: ClipboardList, badge: pendingPartsCount, badgeColor: 'var(--danger)' },
          { to: '/inventory/low-stock', label: 'Low Stock Alerts', icon: AlertTriangle, badge: lowStockCount, badgeColor: 'var(--danger)' },
          { to: '/inventory/suppliers', label: 'Suppliers', icon: Truck },
          { to: '/inventory/reports', label: 'Inventory Reports', icon: FileBarChart },
          { to: '/inventory/profile', label: 'My Profile', icon: User }
        ];

      case 'ADMIN':
        return [
          { to: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
          { to: '/admin/users', label: 'User & Staff Management', icon: Users },
          { to: '/admin/vehicles', label: 'Vehicles Registry', icon: Car },
          { to: '/admin/appointments', label: 'All Appointments', icon: Calendar },
          { to: '/admin/services', label: 'Services Monitor', icon: Activity },
          { to: '/admin/inventory', label: 'Inventory Overview', icon: Boxes },
          { to: '/admin/reports', label: 'System Reports', icon: FileBarChart },
          { to: '/admin/notifications', label: 'Notifications', icon: Bell },
          { to: '/admin/profile', label: 'Admin Profile', icon: ShieldCheck }
        ];

      default:
        return [
          { to: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/customer/vehicles', label: 'My Vehicles', icon: Car },
          { to: '/customer/book', label: 'Book Service', icon: PlusCircle }
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside
      style={{
        width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        height: 'calc(100vh - var(--navbar-height))',
        position: 'sticky',
        top: 'var(--navbar-height)',
        transition: 'width 0.2s ease',
        zIndex: 40,
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {/* Role Badge Banner */}
      {!isCollapsed && (
        <div
          style={{
            padding: '1rem 1.25rem 0.5rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            Portal Mode
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-green)' }} />
            {role?.replace('_', ' ') || 'CUSTOMER'}
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav style={{ padding: '0.75rem 0.65rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                padding: isCollapsed ? '0.8rem' : '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '15px',
                fontFamily: 'var(--font-body)',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                borderLeft: isActive ? '3.5px solid var(--primary)' : '3.5px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
              title={isCollapsed ? item.label : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                <Icon size={20} style={{ flexShrink: 0, color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
                {!isCollapsed && (
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                )}
              </div>

              {!isCollapsed && item.badge > 0 && (
                <span
                  style={{
                    backgroundColor: item.badgeColor || 'var(--primary)',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    minWidth: '18px',
                    textAlign: 'center'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Status / Branding footer */}
      {!isCollapsed && (
        <div
          style={{
            padding: '0.85rem 1rem',
            margin: '0.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            fontSize: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            <Zap size={14} style={{ color: 'var(--accent-green)' }} />
            NexaCare VSMS
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', lineHeight: 1.3 }}>
            Smart Vehicle Service & Management
          </p>
        </div>
      )}
    </aside>
  );
};
