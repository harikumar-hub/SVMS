import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Clock, XCircle, LogOut, ArrowRight, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, currentUser, role, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 1. Check if user account is PENDING approval
  if (currentUser?.status === 'PENDING') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '65vh',
          textAlign: 'center',
          padding: '2rem'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#fef3c7',
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}
        >
          <Clock size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Staff Registration Pending Approval
        </h2>
        <p style={{ maxWidth: '480px', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Your staff account application for the <strong>{role?.replace('_', ' ')}</strong> position is currently under review by the NexaCare Administrator.
          Please check back once approval is granted.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="danger" icon={LogOut} onClick={logout}>
            Sign Out
          </Button>
          <Link to="/" className="btn btn-secondary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // 2. Check if user account was REJECTED
  if (currentUser?.status === 'REJECTED') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '65vh',
          textAlign: 'center',
          padding: '2rem'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}
        >
          <XCircle size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Registration Request Declined
        </h2>
        <p style={{ maxWidth: '480px', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Your application for the <strong>{role?.replace('_', ' ')}</strong> position was reviewed and declined by the NexaCare Administrator.
        </p>
        <Button variant="secondary" icon={LogOut} onClick={logout}>
          Sign Out & Return Home
        </Button>
      </div>
    );
  }

  // 3. Check Role Authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    const roleRoutes = {
      ADMIN: '/admin/dashboard',
      CUSTOMER: '/customer/dashboard',
      SERVICE_PROVIDER: '/provider/dashboard',
      TECHNICIAN: '/technician/dashboard',
      INVENTORY_MANAGER: '/inventory/dashboard'
    };
    const userDashboard = roleRoutes[role] || '/';

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '65vh',
          textAlign: 'center',
          padding: '2rem'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}
        >
          <ShieldAlert size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Access Restricted
        </h2>
        <p style={{ maxWidth: '450px', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Your account role (<strong>{role?.replace('_', ' ')}</strong>) does not have authorization to access this portal section.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to={userDashboard} className="btn btn-primary">
            Go to My {role?.replace('_', ' ')} Dashboard &rarr;
          </Link>
          <Link to="/" className="btn btn-secondary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return children;
};
