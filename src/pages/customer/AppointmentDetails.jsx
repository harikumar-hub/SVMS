import React, { useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Car,
  Building,
  Wrench,
  ShieldCheck,
  User,
  Phone,
  FileText,
  Boxes,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Play
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ServiceTimeline } from '../../components/common/ServiceTimeline';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate, formatDateTime, formatCurrency } from '../../utils/formatters';

export const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const { appointments, partsRequests, updateAppointmentStatus } = useData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const appointment = appointments.find((a) => a.id === appointmentId) || appointments[0];

  // Related parts requests
  const relatedParts = partsRequests.filter((p) => p.appointmentId === appointment?.id);

  // Simulation of next stage for viva evaluation
  const handleSimulateNextStage = () => {
    if (!appointment) return;
    const stages = [
      'PENDING',
      'ACCEPTED',
      'TECHNICIAN_ASSIGNED',
      'VEHICLE_RECEIVED',
      'INSPECTION',
      'IN_PROGRESS',
      'PARTS_REQUIRED',
      'QUALITY_CHECK',
      'COMPLETED',
      'VEHICLE_READY'
    ];
    const currentIndex = stages.indexOf(appointment.status);
    if (currentIndex >= 0 && currentIndex < stages.length - 1) {
      const nextStatus = stages[currentIndex + 1];
      updateAppointmentStatus(appointment.id, nextStatus, {
        technicianName: appointment.technicianName || 'Vignesh Kumar'
      });
    }
  };

  if (!appointment) {
    return (
      <EmptyState
        icon={Calendar}
        title="Appointment Not Found"
        description="The requested service appointment could not be located."
        actionLabel="Back to Appointments"
        onAction={() => navigate('/customer/appointments')}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={`Appointment #${appointment.id}`}
        subtitle="Live service tracking, workshop inspection findings, and parts allocation"
        breadcrumbs={[
          { label: 'Appointments', link: '/customer/appointments' },
          { label: appointment.id }
        ]}
        badge={<StatusBadge status={appointment.status} />}
        actions={
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <Button
              variant="outline-primary"
              size="sm"
              icon={Play}
              onClick={handleSimulateNextStage}
              title="Click to advance status for live testing / demo"
            >
              Simulate Next Service Stage &rarr;
            </Button>
            <Link to="/customer/book" className="btn btn-secondary btn-sm">
              New Booking
            </Link>
          </div>
        }
      />

      {searchParams.get('booked') && (
        <div
          style={{
            backgroundColor: 'var(--accent-green-light)',
            border: '1px solid var(--accent-green-border)',
            color: 'var(--accent-green)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 600
          }}
        >
          <CheckCircle2 size={20} />
          <div>
            Your service booking was placed successfully! The workshop will review and confirm your scheduled slot shortly.
          </div>
        </div>
      )}

      {/* 1. Live Step Progress Tracker */}
      <div className="card" style={{ backgroundColor: '#ffffff', marginBottom: '1.75rem', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Live Service Progression
        </h3>
        <ServiceTimeline currentStatus={appointment.status} />
      </div>

      {/* 2. Grid: Booking Details & Assigned Bay Info */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        {/* Left Column: Vehicle & Problem Details */}
        <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Car size={20} style={{ color: 'var(--primary)' }} /> Vehicle & Service Information
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Vehicle Model:</span>
              <strong>{appointment.vehicleName}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Registration Plate:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, backgroundColor: 'var(--bg-subtle)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                {appointment.registrationNumber}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Service Package:</span>
              <strong style={{ color: 'var(--primary)' }}>{appointment.serviceType}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Scheduled Date & Time:</span>
              <strong>{formatDate(appointment.scheduledDate)} at {appointment.scheduledTime}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Cost:</span>
              <strong style={{ color: 'var(--accent-green)', fontSize: '1rem' }}>{formatCurrency(appointment.estimatedCost)}</strong>
            </div>

            <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: 700 }}>
                Customer Problem Description:
              </span>
              <p style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                {appointment.problemDescription}
              </p>
            </div>

            {appointment.additionalNotes && (
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: 700 }}>
                  Special Customer Instructions:
                </span>
                <p style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                  {appointment.additionalNotes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Workshop & Inspection Findings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Workshop Center Card */}
          <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={20} style={{ color: 'var(--primary)' }} /> Workshop & Technician Allocation
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Service Center:</span>
                <strong>{appointment.providerName}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Technician:</span>
                <strong>{appointment.technicianName || 'Pending Bay Allocation'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Created Timestamp:</span>
                <span>{formatDateTime(appointment.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Inspection Checklist Findings (if inspected) */}
          {appointment.inspectionChecklist && (
            <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} style={{ color: 'var(--accent-green)' }} /> Digital Inspection Findings
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.825rem' }}>
                {Object.entries(appointment.inspectionChecklist).map(([k, val]) => (
                  <div
                    key={k}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ color: 'var(--text-muted)', textTransform: 'capitalize', fontSize: '0.72rem' }}>
                      {k.replace(/([A-Z])/g, ' $1')}
                    </div>
                    <strong style={{ color: val.includes('Replace') || val.includes('Worn') ? 'var(--danger-text)' : 'var(--accent-green)' }}>
                      {val}
                    </strong>
                  </div>
                ))}
              </div>

              {appointment.inspectionNotes && (
                <div style={{ marginTop: '0.85rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  <strong>Mechanic Remarks:</strong> {appointment.inspectionNotes}
                </div>
              )}
            </div>
          )}

          {/* Parts Requisition Status */}
          {relatedParts.length > 0 && (
            <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Boxes size={18} style={{ color: 'var(--primary)' }} /> Allocated Spare Parts
              </h3>
              {relatedParts.map((pr) => (
                <div
                  key={pr.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    marginBottom: '0.5rem',
                    fontSize: '0.825rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{pr.partName}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Part #{pr.partNumber} &bull; Qty: {pr.requestedQuantity}</div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      backgroundColor: pr.status === 'ISSUED' ? 'var(--accent-green-light)' : 'var(--warning-light)',
                      color: pr.status === 'ISSUED' ? 'var(--accent-green)' : 'var(--warning-text)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px'
                    }}
                  >
                    {pr.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
