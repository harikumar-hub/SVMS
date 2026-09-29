import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Car, Calendar, Wrench, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ServiceTimeline } from '../../components/common/ServiceTimeline';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate, formatCurrency } from '../../utils/formatters';

export const ServiceTracking = () => {
  const { currentUser } = useAuth();
  const { appointments } = useData();

  const myAppointments = appointments.filter(
    (a) => a.customerId === currentUser?.id || a.customerName === currentUser?.name
  );

  // Active services
  const activeServices = myAppointments.filter(
    (a) => !['COMPLETED', 'VEHICLE_READY', 'REJECTED', 'CANCELLED'].includes(a.status)
  );

  return (
    <div>
      <PageHeader
        title="Live Vehicle Service Tracking"
        subtitle="Real-time status progression from arrival, multi-point inspection to final vehicle handover"
        breadcrumbs={[{ label: 'Service Tracking' }]}
      />

      {activeServices.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {activeServices.map((service) => (
            <div
              key={service.id}
              className="card"
              style={{
                backgroundColor: '#ffffff',
                borderLeft: '5px solid var(--primary)',
                padding: '1.75rem'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' }}>
                      JOB #{service.id}
                    </span>
                    <StatusBadge status={service.status} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {service.vehicleName}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Package: <strong>{service.serviceType}</strong> &bull; Workshop: <strong>{service.providerName}</strong>
                  </p>
                </div>

                <Link
                  to={`/customer/appointments/${service.id}`}
                  className="btn btn-primary"
                >
                  Full Job Details &rarr;
                </Link>
              </div>

              {/* Stepper */}
              <div style={{ padding: '0.5rem 0' }}>
                <ServiceTimeline currentStatus={service.status} />
              </div>

              {/* Progress & Quick Stats Footer */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '0.85rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  marginTop: '1rem',
                  fontSize: '0.825rem'
                }}
              >
                <div>
                  Technician in Charge: <strong>{service.technicianName || 'Bay Technician Assigning...'}</strong>
                </div>
                <div>
                  Scheduled: <strong>{formatDate(service.scheduledDate)} ({service.scheduledTime})</strong>
                </div>
                <div>
                  Estimated Cost: <strong style={{ color: 'var(--accent-green)' }}>{formatCurrency(service.estimatedCost)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Activity}
          title="No Active Services Currently in Bay"
          description="All your vehicle services have been completed, or you have not scheduled a new service yet."
          actionLabel="Book a Service Now"
          onAction={() => window.location.href = '/customer/book'}
        />
      )}
    </div>
  );
};
