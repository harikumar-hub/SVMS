import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, Lock, Mail, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FormInput } from '../../components/common/FormInput';
import { Button } from '../../components/common/Button';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success && res.user) {
      const roleRoutes = {
        ADMIN: '/admin/dashboard',
        CUSTOMER: '/customer/dashboard',
        SERVICE_PROVIDER: '/provider/dashboard',
        TECHNICIAN: '/technician/dashboard',
        INVENTORY_MANAGER: '/inventory/dashboard'
      };
      const destination = location.state?.from?.pathname || roleRoutes[res.user.role] || '/';
      navigate(destination, { replace: true });
    } else {
      setError(res.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - var(--navbar-height))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem',
        backgroundColor: 'var(--bg-app)'
      }}
    >
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.85rem',
              boxShadow: '0 4px 10px rgba(37,99,235,0.3)'
            }}
          >
            <Car size={26} />
          </div>
          <h1
            style={{
              fontSize: '30px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              lineHeight: 1.25
            }}
          >
            Sign In to NexaCare
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '0.35rem', fontFamily: 'var(--font-body)' }}>
            Smart Vehicle Service & Management System
          </p>
        </div>

        {/* Form Card */}
        <div className="card" style={{ backgroundColor: '#ffffff', padding: '2.25rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
          {error && (
            <div
              style={{
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger-text)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
                marginBottom: '1.5rem',
                lineHeight: 1.4,
                border: '1px solid var(--danger-border)'
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@example.com"
              required
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem', fontSize: '14px' }}>
              <Link to="/forgot-password" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Sign In to Account &rarr;
            </Button>
          </form>

          {/* Navigation Links */}
          <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '15px', color: 'var(--text-muted)' }}>
            New customer?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Create Customer Account &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
