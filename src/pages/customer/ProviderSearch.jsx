import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  MapPin,
  Star,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle,
  Wrench,
  Award,
  Plus
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';

export const ProviderSearch = () => {
  const { providers } = useData();
  const rawProvider = providers?.[0];
  const provider = (rawProvider && rawProvider.name?.includes('NexaCare'))
    ? rawProvider
    : {
        id: 'usr-prov-1',
        name: 'NexaCare Service Center',
        address: '142, Avinashi Road, Peelamedu, Coimbatore',
        phone: '+91 98432 55000',
        email: 'service@nexacare.in',
        rating: 4.9,
        reviewsCount: 285,
        tagline: 'Smart Vehicle Service & Multi-Brand Maintenance Hub',
        openHours: 'Mon - Sat: 8:30 AM - 7:00 PM',
        image: '/workshop_banner.jpg',
        bannerImage: '/workshop_banner.jpg',
        specialties: [
          'Comprehensive Multi-Brand Servicing',
          'Computerized Diagnostics & OBD-II',
          'Engine & Transmission Overhaul',
          'Brake & Suspension Works',
          'AC & Climate Control',
          'OEM Parts Replacement'
        ],
        servicesOffered: [
          'General Service',
          'Oil Change',
          'Brake Service',
          'Engine Service',
          'Battery Service',
          'AC Service',
          'Tyre Service',
          'Periodic Maintenance',
          'Other'
        ]
      };

  return (
    <div>
      <PageHeader
        title="NexaCare Service Center"
        subtitle="Authorized service facility • 142, Avinashi Road, Peelamedu, Coimbatore"
        breadcrumbs={[{ label: 'Service Center' }]}
        actions={
          <Link to="/customer/book" className="btn btn-primary">
            <Plus size={16} /> Book Service at NexaCare
          </Link>
        }
      />

      {/* Workshop Hero Profile Card */}
      <div
        className="card"
        style={{
          padding: 0,
          overflow: 'hidden',
          backgroundColor: '#0f172a',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{ height: '240px', position: 'relative' }}>
          <img
            src={provider.bannerImage || provider.image || '/workshop_banner.jpg'}
            alt={provider.name}
            onError={(e) => {
              e.currentTarget.src = '/workshop_banner.jpg';
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.25) 60%)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.5rem',
              right: '1.5rem',
              color: '#ffffff',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <div
                  style={{
                    backgroundColor: '#d97706',
                    color: '#ffffff',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.8rem',
                    fontWeight: 800
                  }}
                >
                  <Star size={14} fill="#ffffff" /> {provider.rating} Rating
                </div>
                <span style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
                  ({provider.reviewsCount || 285} Customer Reviews)
                </span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
                {provider.name}
              </h2>
            </div>

            <Link
              to="/customer/book"
              className="btn btn-lg"
              style={{ backgroundColor: '#ffffff', color: 'var(--primary)', fontWeight: 700 }}
            >
              Book Service Now &rarr;
            </Link>
          </div>
        </div>

        {/* Contact Info Strip */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: '#ffffff',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.875rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MapPin size={18} style={{ color: 'var(--primary)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location</div>
              <strong>{provider.address}, Coimbatore</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Clock size={18} style={{ color: 'var(--primary)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Working Hours</div>
              <strong>{provider.openHours}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Phone size={18} style={{ color: 'var(--primary)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Direct Contact</div>
              <strong>{provider.phone}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Mail size={18} style={{ color: 'var(--primary)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</div>
              <strong>{provider.email}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Services Offered & Diagnostic Specialties */}
      <div className="grid-2">
        {/* Services Offered Card */}
        <div className="card" style={{ backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={18} style={{ color: 'var(--primary)' }} /> Services Offered at NexaCare
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
            {(provider.servicesOffered || []).map((svc, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <CheckCircle size={15} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
                <span>{svc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Workshop Credentials & Specialties */}
        <div className="card" style={{ backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} style={{ color: 'var(--accent-green)' }} /> Engineering Specialties & Equipment
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(provider.specialties || []).map((spec, sIdx) => (
              <div
                key={sIdx}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-light)',
                  border: '1px solid var(--primary-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem'
                }}
              >
                <ShieldCheck size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {spec}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
