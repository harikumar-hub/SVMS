import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  ShieldCheck,
  Car,
  Calendar,
  CheckCircle2,
  Boxes,
  Play,
  FileText,
  AlertTriangle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ServiceTimeline } from '../../components/common/ServiceTimeline';
import { Button } from '../../components/common/Button';
import { FormInput } from '../../components/common/FormInput';
import { SelectInput } from '../../components/common/SelectInput';
import { RequestSparePartsModal } from './RequestSparePartsModal';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';

export const TechnicianServiceDetails = () => {
  const { appointmentId } = useParams();
  const { appointments, partsRequests, updateAppointmentStatus } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const appointment = appointments.find((a) => a.id === appointmentId) || appointments[0];
  const [isPartsModalOpen, setIsPartsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Digital Inspection Checklist State
  const [checklist, setChecklist] = useState({
    engineOil: appointment?.inspectionChecklist?.engineOil || 'Optimal',
    brakePads: appointment?.inspectionChecklist?.brakePads || 'Good (6mm)',
    batteryHealth: appointment?.inspectionChecklist?.batteryHealth || '95% Healthy',
    tyrePressure: appointment?.inspectionChecklist?.tyrePressure || '32 PSI',
    coolantLevel: appointment?.inspectionChecklist?.coolantLevel || 'Full',
    airFilter: appointment?.inspectionChecklist?.airFilter || 'Clean'
  });

  const [inspectionNotes, setInspectionNotes] = useState(
    appointment?.inspectionNotes || 'Completed multi-point diagnostic. All primary systems operational.'
  );

  const [workPerformed, setWorkPerformed] = useState(
    'Replaced engine oil with 5W-30 synthetic, replaced oil filter, and checked brake pad wear.'
  );

  // Parts associated with this job
  const relatedParts = partsRequests.filter((p) => p.appointmentId === appointment?.id);

  const handleSaveInspection = (e) => {
    e.preventDefault();
    updateAppointmentStatus(appointment.id, appointment.status, {
      inspectionChecklist: checklist,
      inspectionNotes: inspectionNotes
    });
    setFeedback('Digital inspection checklist saved successfully.');
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleAdvance = (nextStatus) => {
    updateAppointmentStatus(appointment.id, nextStatus, {
      inspectionChecklist: checklist,
      inspectionNotes: inspectionNotes
    });
    setFeedback(`Service transitioned to ${nextStatus.replace('_', ' ')}.`);
    setTimeout(() => setFeedback(''), 4000);
  };

  if (!appointment) {
    return (
      <EmptyState
        icon={Wrench}
        title="Job Card Not Found"
        description="The requested service assignment could not be located."
        actionLabel="Back to Assigned Jobs"
        onAction={() => navigate('/technician/assigned')}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={`Service Job #${appointment.id}`}
        subtitle={`${appointment.vehicleName} • ${appointment.serviceType}`}
        breadcrumbs={[
          { label: 'Assigned Services', link: '/technician/assigned' },
          { label: `Job #${appointment.id}` }
        ]}
        badge={<StatusBadge status={appointment.status} />}
        actions={
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button
              variant="outline-primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsPartsModalOpen(true)}
            >
              Request Parts
            </Button>
            {appointment.status !== 'COMPLETED' && (
              <Button
                variant="success"
                size="sm"
                icon={CheckCircle2}
                onClick={() => handleAdvance('COMPLETED')}
              >
                Mark Job Completed
              </Button>
            )}
          </div>
        }
      />

      {feedback && (
        <div
          style={{
            backgroundColor: 'var(--accent-green-light)',
            border: '1px solid var(--accent-green-border)',
            color: 'var(--accent-green)',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 600
          }}
        >
          <CheckCircle2 size={18} />
          <span>{feedback}</span>
        </div>
      )}

      {/* Stepper Progression Card */}
      <div className="card" style={{ backgroundColor: '#ffffff', marginBottom: '1.75rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Service Stage Progression
          </h3>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleAdvance('VEHICLE_RECEIVED')}
            >
              Received In Bay
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleAdvance('INSPECTION')}
            >
              Under Inspection
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleAdvance('IN_PROGRESS')}
            >
              In Progress
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleAdvance('QUALITY_CHECK')}
            >
              Quality Check
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => handleAdvance('COMPLETED')}
            >
              Completed
            </Button>
          </div>
        </div>
        <ServiceTimeline currentStatus={appointment.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
        {/* Left Column: Digital Inspection Form */}
        <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} style={{ color: 'var(--accent-green)' }} /> Digital Multi-Point Inspection
          </h3>

          <form onSubmit={handleSaveInspection}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <SelectInput
                label="Engine Oil Level & Quality"
                name="engineOil"
                value={checklist.engineOil}
                onChange={(e) => setChecklist({ ...checklist, engineOil: e.target.value })}
                options={['Optimal', 'Low Level', 'Degraded / Black', 'Replace Required']}
              />

              <SelectInput
                label="Brake Pads & Disc Wear"
                name="brakePads"
                value={checklist.brakePads}
                onChange={(e) => setChecklist({ ...checklist, brakePads: e.target.value })}
                options={['Good (8mm+)', 'Fair (4-6mm)', 'Worn Out - Replace Required', 'Part Requested']}
              />

              <SelectInput
                label="12V Battery Health"
                name="batteryHealth"
                value={checklist.batteryHealth}
                onChange={(e) => setChecklist({ ...checklist, batteryHealth: e.target.value })}
                options={['95% Healthy', '85% Good', 'Weak Charge', 'Replace Required']}
              />

              <SelectInput
                label="Tyre Pressure & Alignment"
                name="tyrePressure"
                value={checklist.tyrePressure}
                onChange={(e) => setChecklist({ ...checklist, tyrePressure: e.target.value })}
                options={['32 PSI (Optimal)', 'Low Pressure (Adjusted)', 'Uneven Wear', 'Wheel Alignment Required']}
              />

              <SelectInput
                label="Coolant & Radiator Fluid"
                name="coolantLevel"
                value={checklist.coolantLevel}
                onChange={(e) => setChecklist({ ...checklist, coolantLevel: e.target.value })}
                options={['Full / Normal', 'Topped Up', 'Leak Suspected', 'Flush Recommended']}
              />

              <SelectInput
                label="Cabin & Air Filter"
                name="airFilter"
                value={checklist.airFilter}
                onChange={(e) => setChecklist({ ...checklist, airFilter: e.target.value })}
                options={['Clean', 'Clogged - Cleaned', 'Replace Required']}
              />
            </div>

            <FormInput
              label="Diagnostic Identification & Mechanic Findings"
              name="inspectionNotes"
              type="textarea"
              rows={3}
              value={inspectionNotes}
              onChange={(e) => setInspectionNotes(e.target.value)}
              placeholder="e.g. Scanned OBD-II error codes. Brake pads worn on front axle."
            />

            <Button type="submit" variant="primary" style={{ width: '100%' }}>
              Save Inspection Findings
            </Button>
          </form>
        </div>

        {/* Right Column: Work Performed & Requisitioned Parts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Work Performed Recorder */}
          <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} style={{ color: 'var(--primary)' }} /> Record Work Performed
            </h3>

            <FormInput
              label="Completed Tasks & Mechanical Steps"
              name="workPerformed"
              type="textarea"
              rows={4}
              value={workPerformed}
              onChange={(e) => setWorkPerformed(e.target.value)}
              placeholder="e.g. Drained old oil, fitted fresh Bosch filter, installed new ceramic pads, performed road test."
            />

            <Button
              variant="secondary"
              onClick={() => {
                setFeedback('Work performed log updated.');
                setTimeout(() => setFeedback(''), 4000);
              }}
              style={{ width: '100%' }}
            >
              Update Work Performed Log
            </Button>
          </div>

          {/* Allocated Spare Parts */}
          <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Boxes size={18} style={{ color: 'var(--primary)' }} /> Requisitioned Parts
              </h3>
              <Button
                variant="outline-primary"
                size="sm"
                icon={Plus}
                onClick={() => setIsPartsModalOpen(true)}
              >
                Request Part
              </Button>
            </div>

            {relatedParts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {relatedParts.map((pr) => (
                  <div
                    key={pr.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-default)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{pr.partName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Qty: {pr.requestedQuantity} &bull; Urgency: {pr.urgency}
                      </div>
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
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No spare parts requested for this job yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spare Parts Modal */}
      <RequestSparePartsModal
        isOpen={isPartsModalOpen}
        onClose={() => setIsPartsModalOpen(false)}
        appointmentId={appointment.id}
        vehicleInfo={appointment.vehicleName}
        technicianId={currentUser?.id}
        technicianName={currentUser?.name}
      />
    </div>
  );
};
