import React from 'react';
import { Star, Wrench, Phone, Mail, Award, CheckCircle2, Shield } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';

export const TechniciansManagement = () => {
  const { technicians } = useData();

  return (
    <div>
      <PageHeader
        title="Workshop Technicians & Specialists"
        subtitle="Overview of certified bay technicians, workload allocation, and technical skill matrices (Managed by Admin)"
        breadcrumbs={[{ label: 'Technicians' }]}
      />

      {/* Technicians Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {technicians.map((tech) => {
          const initials = tech.name
            ? tech.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()
            : 'TC';

          return (
            <div
              key={tech.id}
              className="card card-hover"
              style={{
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  {/* Clean Initials Avatar Badge */}
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      border: '1px solid var(--primary-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.15rem',
                      flexShrink: 0
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {tech.name}
                    </h3>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#d97706',
                        marginTop: '0.2rem'
                      }}
                    >
                      <Star size={13} fill="#d97706" /> {tech.rating || 4.9} Rating
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Wrench size={15} style={{ color: 'var(--primary)' }} />
                    <span><strong>Specialty:</strong> {tech.specialty || 'General Diagnostics & Repair'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={15} style={{ color: 'var(--text-muted)' }} />
                    <span>{tech.phone || '+91 98421 98765'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={15} style={{ color: 'var(--text-muted)' }} />
                    <span>{tech.email}</span>
                  </div>
                </div>

                {tech.certifications && (
                  <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>Certifications:</div>
                    {Array.isArray(tech.certifications) ? tech.certifications.join(', ') : tech.certifications}
                  </div>
                )}
              </div>

              {/* Workload Status Bar */}
              <div
                style={{
                  marginTop: '1.25rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem'
                }}
              >
                <div>
                  Active Load: <strong>{tech.activeJobsCount || 0} Vehicle(s)</strong>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    backgroundColor: (tech.activeJobsCount || 0) > 2 ? 'var(--warning-light)' : 'var(--accent-green-light)',
                    color: (tech.activeJobsCount || 0) > 2 ? 'var(--warning-text)' : 'var(--accent-green)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px'
                  }}
                >
                  {(tech.activeJobsCount || 0) > 2 ? 'High Load' : 'Available for Jobs'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
