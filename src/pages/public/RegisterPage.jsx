import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, User, Mail, Lock, Phone, MapPin, AlertCircle, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FormInput } from '../../components/common/FormInput';
import { Button } from '../../components/common/Button';

export const RegisterPage = () => {
  const { signupCustomer } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: 'Coimbatore'
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all mandatory customer details.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    const res = await signupCustomer({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: `${formData.address}${formData.city ? ', ' + formData.city : ''}`,
      city: formData.city || 'Coimbatore'
    });

    setLoading(false);

    if (res.success) {
      setSuccessMsg('Account created successfully! Redirecting to your dashboard...');
      setTimeout(() => {
        navigate('/customer/dashboard');
      }, 1000);
    } else {
      setError(res.message || 'Registration failed. Please check your credentials.');
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
      <div style={{ maxWidth: '560px', width: '100%' }}>
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
            Create Customer Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '0.35rem', fontFamily: 'var(--font-body)' }}>
            NexaCare — Smart Vehicle Service & Management
          </p>
        </div>

        {/* Form Card */}
        <div className="card" style={{ backgroundColor: '#ffffff', padding: '2.25rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
          {error && (
            <div
              style={{
                backgroundColor: 'var(--danger-light)',
                border: '1px solid var(--danger-border)',
                color: 'var(--danger-text)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1.5rem'
              }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                backgroundColor: 'var(--accent-green-light)',
                border: '1px solid #bbf7d0',
                color: 'var(--accent-green)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}
            >
              <CheckCircle size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <FormInput
                label="Full Name"
                name="name"
                icon={User}
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Hari Kumar"
                required
              />

              <FormInput
                label="Mobile Phone"
                name="phone"
                type="tel"
                icon={Phone}
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98432 55678"
                required
              />
            </div>

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. customer@example.com"
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <FormInput
                label="Password"
                name="password"
                type="password"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required
              />

              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <FormInput
                label="Address"
                name="address"
                icon={MapPin}
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. 12, Crosscut Road"
              />
              <FormInput
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Coimbatore"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
            >
              Sign Up as Customer &rarr;
            </Button>
          </form>

          {/* Navigation Links */}
          <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '15px', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Sign In to Account &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
