import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Briefcase,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FormInput } from '../../components/common/FormInput';
import { SelectInput } from '../../components/common/SelectInput';
import { Button } from '../../components/common/Button';

export const StaffRequestPage = () => {
  const { submitStaffRequest } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'TECHNICIAN',
    password: '',
    confirmPassword: '',
    specialty: '',
    experienceYears: '2',
    qualifications: '',
    address: '',
    city: 'Coimbatore'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all mandatory contact and security fields.');
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

    const res = await submitStaffRequest({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: formData.role,
      specialty: formData.specialty || (formData.role === 'TECHNICIAN' ? 'General Diagnostics & Repair' : formData.role === 'SERVICE_PROVIDER' ? 'Workshop Floor Management' : 'Inventory & OEM Parts Catalog'),
      experienceYears: parseInt(formData.experienceYears, 10) || 1,
      qualifications: formData.qualifications,
      address: `${formData.address}${formData.city ? ', ' + formData.city : ''}`,
      city: formData.city || 'Coimbatore'
    });

    setLoading(false);

    if (res.success) {
      setIsSubmitted(true);
    } else {
      setError(res.message || 'Failed to submit staff registration request. Please check details.');
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
      <div style={{ maxWidth: '640px', width: '100%' }}>
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
            <Wrench size={26} />
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
            Staff Registration Request
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '0.35rem', fontFamily: 'var(--font-body)' }}>
            Technician • Service Provider • Inventory Manager Onboarding
          </p>
        </div>

        {/* Workflow Steps Indicator Card */}
        <div
          className="card"
          style={{
            backgroundColor: '#ffffff',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            border: '1px solid var(--border-default)'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            Staff Onboarding Workflow:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
            {[
              { step: '1', title: 'Submit Request', active: true },
              { step: '2', title: 'Admin Review', active: false },
              { step: '3', title: 'Approval', active: false },
              { step: '4', title: 'Login Access', active: false }
            ].map((s) => (
              <div
                key={s.step}
                style={{
                  padding: '0.5rem 0.25rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: s.active ? 'var(--primary-light)' : 'var(--bg-subtle)',
                  color: s.active ? 'var(--primary)' : 'var(--text-muted)',
                  border: s.active ? '1px solid var(--primary-border)' : '1px solid transparent'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>Step {s.step}</div>
                <div style={{ fontSize: '0.72rem', marginTop: '0.15rem' }}>{s.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Confirmation Card */}
        {isSubmitted ? (
          <div className="card" style={{ backgroundColor: '#ffffff', padding: '2.5rem 2rem', textAlign: 'center' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-green-light)',
                color: 'var(--accent-green)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Staff Registration Request Submitted!
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
              Your application to join NexaCare as a <strong>{formData.role.replace('_', ' ')}</strong> has been received with status <span style={{ color: '#d97706', fontWeight: 700 }}>PENDING</span>.
              The NexaCare System Administrator will review and approve your account shortly.
            </p>

            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.825rem',
                color: 'var(--text-muted)',
                marginBottom: '1.75rem',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                <Clock size={16} style={{ color: 'var(--primary)' }} /> What happens next?
              </div>
              <ul style={{ margin: '0.25rem 0 0 1.25rem', padding: 0 }}>
                <li>Admin inspects your application details and department requirements.</li>
                <li>Upon approval, your role profile and dashboard permissions are activated.</li>
                <li>You can then sign in directly with your email ({formData.email}) and password.</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-primary">
                Go to Sign In Page &rarr;
              </Link>
              <Link to="/" className="btn btn-secondary">
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          /* Application Form Card */
          <div className="card" style={{ backgroundColor: '#ffffff', padding: '2rem' }}>
            {error && (
              <div
                style={{
                  backgroundColor: 'var(--danger-light)',
                  border: '1px solid #fecaca',
                  color: 'var(--danger-text)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem'
                }}
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <SelectInput
                label="Requested Staff Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                options={[
                  { value: 'TECHNICIAN', label: 'Technician / Bay Mechanic' },
                  { value: 'SERVICE_PROVIDER', label: 'Service Provider / Workshop Floor Manager' },
                  { value: 'INVENTORY_MANAGER', label: 'Inventory / Parts Manager' }
                ]}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <FormInput
                  label="Full Name"
                  name="name"
                  icon={User}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Vignesh Kumar"
                  required
                />

                <FormInput
                  label="Contact Phone"
                  name="phone"
                  type="tel"
                  icon={Phone}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98421 55678"
                  required
                />
              </div>

              <FormInput
                label="Official / Work Email"
                name="email"
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. vignesh@nexacare.in"
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <FormInput
                  label="Specialty / Core Expertise"
                  name="specialty"
                  icon={Briefcase}
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder={
                    formData.role === 'TECHNICIAN'
                      ? 'e.g. Engine Diagnostics & Electricals'
                      : formData.role === 'SERVICE_PROVIDER'
                      ? 'e.g. Workshop Operations & Service Quality'
                      : 'e.g. Parts Catalog & Stock Management'
                  }
                  required
                />

                <SelectInput
                  label="Years of Experience"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  options={[
                    { value: '1', label: '1 - 2 Years' },
                    { value: '3', label: '3 - 5 Years' },
                    { value: '6', label: '6 - 10 Years' },
                    { value: '10', label: '10+ Years (Senior Lead)' }
                  ]}
                />
              </div>

              <FormInput
                label="Qualifications / Certifications (Optional)"
                name="qualifications"
                icon={Award}
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="e.g. ASE Certified Automobile Specialist, Diploma in Mechanical Engg"
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <FormInput
                  label="Password for Account"
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
                  label="Residential Address"
                  name="address"
                  icon={MapPin}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 45, Avinashi Road, Peelamedu"
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
                Submit {formData.role.replace('_', ' ')} Registration Request &rarr;
              </Button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Looking for Customer registration?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                Customer Sign Up
              </Link>
              {' • '}
              <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
