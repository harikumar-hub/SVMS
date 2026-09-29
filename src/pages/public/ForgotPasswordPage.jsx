import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, KeyRound, CheckCircle, ArrowLeft } from 'lucide-react';
import { FormInput } from '../../components/common/FormInput';
import { Button } from '../../components/common/Button';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 500);
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
      <div style={{ maxWidth: '460px', width: '100%' }}>
        <div className="card" style={{ backgroundColor: '#ffffff', padding: '2.25rem' }}>
          {!submitted ? (
            <>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <KeyRound size={22} />
              </div>

              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Reset Your Password
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Enter your registered email address and we will send a password reset verification link to your inbox.
              </p>

              <form onSubmit={handleSubmit}>
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. hari.kumar@example.com"
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-green-light)',
                  color: 'var(--accent-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}
              >
                <CheckCircle size={30} />
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Check Your Email
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                We have sent instructions and a temporary password reset code to <strong>{email}</strong>.
              </p>

              <Button
                variant="secondary"
                onClick={() => setSubmitted(false)}
                style={{ width: '100%' }}
              >
                Resend Email
              </Button>
            </div>
          )}

          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--primary)',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
