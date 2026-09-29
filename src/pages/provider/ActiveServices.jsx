import React, { useState } from 'react';
import {
  Activity,
  Car,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter as FilterIcon,
  Play
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { SelectInput } from '../../components/common/SelectInput';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';

export const ActiveServices = () => {
  const { appointments, updateAppointmentStatus } = useData();
  const [selectedStatusChangeApt, setSelectedStatusChangeApt] = useState(null);
  const [targetStatus, setTargetStatus] = useState('');

  // Active services in workshop
  const activeServices = appointments.filter(
    (a) => !['COMPLETED', 'VEHICLE_READY', 'REJECTED', 'CANCELLED'].includes(a.status)
  );

  const handleUpdateStatus = () => {
    if (selectedStatusChangeApt && targetStatus) {
      updateAppointmentStatus(selectedStatusChangeApt.id, targetStatus);
      setSelectedStatusChangeApt(null);
    }
  };

  const handleFastTransition = (apt, nextStatus) => {
    updateAppointmentStatus(apt.id, nextStatus);
  };

  return (
    <div>
      <PageHeader
        title="Workshop Floor & Active Service Bays"
        subtitle="Live monitoring of vehicle status transitions across diagnostic, repair, and inspection stations"
        breadcrumbs={[{ label: 'Active Services' }]}
      />

      {activeServices.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {activeServices.map((service) => (
            <div
              key={service.id}
              className="card card-hover"
              style={{
                backgroundColor: '#ffffff',
                borderTop: '4px solid var(--primary)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>
                      JOB #{service.id}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                      {service.vehicleName}
                    </h3>
                  </div>
                  <StatusBadge status={service.status} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <div><strong>Package:</strong> {service.serviceType}</div>
                  <div><strong>Customer:</strong> {service.customerName} ({service.customerPhone})</div>
                  <div><strong>Assigned Tech:</strong> {service.technicianName || 'Vignesh Kumar'}</div>
                  <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', marginTop: '0.35rem', fontSize: '0.8rem' }}>
                    <strong>Reported Issue:</strong> {service.problemDescription}
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    <span>Floor Completion</span>
                    <span>{service.progressPercentage || 50}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${service.progressPercentage || 50}%`,
                        backgroundColor: 'var(--primary)',
                        borderRadius: '999px'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.4rem',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {service.status === 'ACCEPTED' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleFastTransition(service, 'VEHICLE_RECEIVED')}
                  >
                    Vehicle In Bay &rarr;
                  </Button>
                )}
                {service.status === 'VEHICLE_RECEIVED' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleFastTransition(service, 'INSPECTION')}
                  >
                    Begin Inspection &rarr;
                  </Button>
                )}
                {service.status === 'INSPECTION' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleFastTransition(service, 'IN_PROGRESS')}
                  >
                    Start Servicing &rarr;
                  </Button>
                )}
                {service.status === 'IN_PROGRESS' && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleFastTransition(service, 'QUALITY_CHECK')}
                  >
                    Send to Quality Check &rarr;
                  </Button>
                )}
                {service.status === 'QUALITY_CHECK' && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleFastTransition(service, 'VEHICLE_READY')}
                  >
                    Mark Vehicle Ready &rarr;
                  </Button>
                )}

                <button
                  onClick={() => {
                    setSelectedStatusChangeApt(service);
                    setTargetStatus(service.status);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  Change Status...
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Activity}
          title="No Active Vehicles in Workshop Floor"
          description="All vehicles have completed servicing and quality checks."
        />
      )}

      {/* Manual Status Change Modal */}
      {selectedStatusChangeApt && (
        <Modal
          isOpen={!!selectedStatusChangeApt}
          onClose={() => setSelectedStatusChangeApt(null)}
          title="Update Service Progress Stage"
          subtitle={`Manually override status for Job #${selectedStatusChangeApt.id}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setSelectedStatusChangeApt(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateStatus}>
                Update Stage
              </Button>
            </>
          }
        >
          <SelectInput
            label="Target Service Lifecycle Stage"
            name="targetStatus"
            value={targetStatus}
            onChange={(e) => setTargetStatus(e.target.value)}
            options={[
              'PENDING',
              'ACCEPTED',
              'TECHNICIAN_ASSIGNED',
              'VEHICLE_RECEIVED',
              'INSPECTION',
              'IN_PROGRESS',
              'PARTS_REQUIRED',
              'QUALITY_CHECK',
              'COMPLETED',
              'VEHICLE_READY',
              'REJECTED',
              'CANCELLED'
            ]}
          />
        </Modal>
      )}
    </div>
  );
};
