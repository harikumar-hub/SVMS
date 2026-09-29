import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  Car,
  ShieldCheck,
  Boxes,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Play
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DashboardCard } from '../../components/common/DashboardCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { RequestSparePartsModal } from './RequestSparePartsModal';
import { formatDate } from '../../utils/formatters';

export const TechnicianDashboard = () => {
  const { currentUser } = useAuth();
  const { appointments, partsRequests, updateAppointmentStatus } = useData();
  const navigate = useNavigate();
  const [isPartsModalOpen, setIsPartsModalOpen] = useState(false);

  // Filter jobs for this technician
  const assignedJobs = appointments.filter(
    (a) => a.technicianId === currentUser?.id || a.technicianName?.includes('Vignesh') || !a.technicianId
  );

  const activeJobs = assignedJobs.filter(
    (a) => !['COMPLETED', 'VEHICLE_READY', 'CANCELLED', 'REJECTED'].includes(a.status)
  );

  const completedJobs = assignedJobs.filter(
    (a) => a.status === 'COMPLETED' || a.status === 'VEHICLE_READY'
  );

  const myPartsRequests = partsRequests.filter(
    (p) => p.technicianId === currentUser?.id || p.technicianName?.includes('Vignesh')
  );

  const activeJob = activeJobs[0];

  const handleAdvanceStatus = (job) => {
    const workflow = [
      'TECHNICIAN_ASSIGNED',
      'VEHICLE_RECEIVED',
      'INSPECTION',
      'IN_PROGRESS',
      'QUALITY_CHECK',
      'COMPLETED'
    ];
    const currentIndex = workflow.indexOf(job.status);
    if (currentIndex >= 0 && currentIndex < workflow.length - 1) {
      updateAppointmentStatus(job.id, workflow[currentIndex + 1]);
    }
  };

  return (
    <div>
      <PageHeader
        title={`Technician Bay Portal • ${currentUser?.name || 'Technician'}`}
        subtitle="Active workshop service jobs, digital inspection checklists, and parts requisitions"
        breadcrumbs={[{ label: 'Technician Bay' }]}
        actions={
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setIsPartsModalOpen(true)}
            >
              Request Spare Parts
            </Button>
            <Link to="/technician/assigned" className="btn btn-secondary">
              View All Assigned Jobs
            </Link>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        <DashboardCard
          title="Assigned Jobs"
          value={activeJobs.length}
          subtitle="Vehicles in bay"
          icon={Wrench}
          color="primary"
          onClick={() => navigate('/technician/assigned')}
        />
        <DashboardCard
          title="Under Inspection"
          value={assignedJobs.filter((a) => a.status === 'INSPECTION' || a.status === 'VEHICLE_RECEIVED').length}
          subtitle="Multi-point diagnostic"
          icon={ShieldCheck}
          color="purple"
        />
        <DashboardCard
          title="Parts Pending"
          value={myPartsRequests.filter((p) => p.status === 'PENDING').length}
          subtitle="Awaiting store issuance"
          icon={Boxes}
          color="warning"
          onClick={() => navigate('/technician/requests')}
        />
        <DashboardCard
          title="Completed Services"
          value={completedJobs.length}
          subtitle="Quality tested"
          icon={CheckCircle2}
          color="success"
          onClick={() => navigate('/technician/completed')}
        />
      </div>

      {/* Active Work Bay Highlight */}
      {activeJob && (
        <div
          className="card"
          style={{
            marginBottom: '1.75rem',
            borderLeft: '5px solid var(--primary)',
            backgroundColor: '#ffffff',
            padding: '1.75rem'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>
                  ACTIVE JOB #{activeJob.id}
                </span>
                <StatusBadge status={activeJob.status} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeJob.vehicleName} &bull; {activeJob.serviceType}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Customer: <strong>{activeJob.customerName}</strong> ({activeJob.customerPhone}) &bull; Scheduled: {formatDate(activeJob.scheduledDate)}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <Link
                to={`/technician/service/${activeJob.id}`}
                className="btn btn-secondary"
              >
                Digital Inspection & Work Log &rarr;
              </Link>
              <Button
                variant="primary"
                icon={Play}
                onClick={() => handleAdvanceStatus(activeJob)}
              >
                Advance Stage &rarr;
              </Button>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
            <strong>Customer Reported Issue:</strong> {activeJob.problemDescription}
          </div>
        </div>
      )}

      {/* Assigned Services List Card */}
      <div className="card" style={{ backgroundColor: '#ffffff', marginBottom: '1.75rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Wrench size={20} style={{ color: 'var(--primary)' }} /> Assigned Work Queue
            </h3>
            <p className="card-subtitle">Manage service progress step by step</p>
          </div>
          <Link to="/technician/assigned" className="btn btn-secondary btn-sm">
            View All ({activeJobs.length})
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {activeJobs.map((job) => (
            <div
              key={job.id}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-default)',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--primary)' }}>
                    #{job.id}
                  </span>
                  <strong style={{ fontSize: '0.95rem' }}>{job.vehicleName}</strong>
                  <StatusBadge status={job.status} />
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Package: <strong>{job.serviceType}</strong> &bull; Plate: {job.registrationNumber} &bull; Scheduled: {formatDate(job.scheduledDate)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Link
                  to={`/technician/service/${job.id}`}
                  className="btn btn-secondary btn-sm"
                >
                  Inspection & Log
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAdvanceStatus(job)}
                >
                  Next Step &rarr;
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spare Parts Modal */}
      <RequestSparePartsModal
        isOpen={isPartsModalOpen}
        onClose={() => setIsPartsModalOpen(false)}
        appointmentId={activeJob?.id}
        vehicleInfo={activeJob?.vehicleName}
        technicianId={currentUser?.id}
        technicianName={currentUser?.name}
      />
    </div>
  );
};
