import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Activity,
  HardHat,
  CheckCircle2,
  Check,
  X,
  UserCheck,
  Wrench
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DashboardCard } from '../../components/common/DashboardCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { SelectInput } from '../../components/common/SelectInput';
import { formatDate } from '../../utils/formatters';

export const ProviderDashboard = () => {
  const { currentUser } = useAuth();
  const { appointments, technicians, updateAppointmentStatus, assignTechnician } = useData();
  const navigate = useNavigate();

  const [selectedAptForAssign, setSelectedAptForAssign] = useState(null);
  const [selectedTechId, setSelectedTechId] = useState('');

  const pendingRequests = appointments.filter((a) => a.status === 'PENDING');
  const activeBayServices = appointments.filter(
    (a) => !['COMPLETED', 'VEHICLE_READY', 'REJECTED', 'CANCELLED'].includes(a.status)
  );
  const completedServices = appointments.filter((a) => a.status === 'COMPLETED' || a.status === 'VEHICLE_READY');

  const handleAccept = (aptId) => {
    updateAppointmentStatus(aptId, 'ACCEPTED');
  };

  const handleReject = (aptId) => {
    updateAppointmentStatus(aptId, 'REJECTED');
  };

  const handleAssign = () => {
    if (selectedAptForAssign && selectedTechId) {
      assignTechnician(selectedAptForAssign.id, selectedTechId);
      setSelectedAptForAssign(null);
      setSelectedTechId('');
    }
  };

  return (
    <div>
      <PageHeader
        title="Workshop Management Dashboard"
        subtitle="NexaCare Service Center • Operational overview of service requests and bay workload"
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/provider/requests" className="btn btn-primary">
              <ClipboardList size={16} /> Service Requests ({pendingRequests.length})
            </Link>
            <Link to="/provider/active-services" className="btn btn-secondary">
              <Activity size={16} /> Active Bay Floor
            </Link>
          </div>
        }
      />

      {/* 4 Clean Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <DashboardCard
          title="New Requests"
          value={pendingRequests.length}
          subtitle="Pending workshop approval"
          icon={ClipboardList}
          color="warning"
          onClick={() => navigate('/provider/requests')}
        />
        <DashboardCard
          title="Active in Bays"
          value={activeBayServices.length}
          subtitle="Under repair / inspection"
          icon={Activity}
          color="primary"
          onClick={() => navigate('/provider/active-services')}
        />
        <DashboardCard
          title="Technicians"
          value={technicians.length}
          subtitle="Mechanics on staff"
          icon={HardHat}
          color="info"
          onClick={() => navigate('/provider/technicians')}
        />
        <DashboardCard
          title="Completed Jobs"
          value={completedServices.length}
          subtitle="Finished service orders"
          icon={CheckCircle2}
          color="success"
          onClick={() => navigate('/provider/records')}
        />
      </div>

      {/* Incoming Requests Queue */}
      <div className="card" style={{ backgroundColor: '#ffffff', marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <ClipboardList size={18} style={{ color: 'var(--primary)' }} /> Incoming Customer Requests
            </h3>
            <p className="card-subtitle">Accept, decline, or assign mechanics to new bookings</p>
          </div>
          <Link to="/provider/requests" className="btn btn-secondary btn-sm">
            View All ({pendingRequests.length})
          </Link>
        </div>

        {pendingRequests.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-default)',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>
                      #{req.id}
                    </span>
                    <strong>{req.vehicleName}</strong>
                    <StatusBadge status={req.status} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Customer: <strong>{req.customerName}</strong> ({req.customerPhone}) &bull; Package: <strong>{req.serviceType}</strong> &bull; Date: {formatDate(req.scheduledDate)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Issue: "{req.problemDescription}"
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <Button
                    variant="success"
                    size="sm"
                    icon={Check}
                    onClick={() => handleAccept(req.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={UserCheck}
                    onClick={() => {
                      setSelectedAptForAssign(req);
                      setSelectedTechId(technicians[0]?.id || '');
                    }}
                  >
                    Assign Tech
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={X}
                    onClick={() => handleReject(req.id)}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No pending booking requests right now.
          </div>
        )}
      </div>

      {/* Active Bay Summary */}
      <div className="card" style={{ backgroundColor: '#ffffff' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Activity size={18} style={{ color: 'var(--primary)' }} /> Vehicles Currently in Workshop Bay
            </h3>
            <p className="card-subtitle">Active repairs and servicing</p>
          </div>
          <Link to="/provider/active-services" className="btn btn-secondary btn-sm">
            View Bay Floor
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {activeBayServices.slice(0, 3).map((svc) => (
            <div
              key={svc.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-default)'
              }}
            >
              <div>
                <strong style={{ fontSize: '0.9rem' }}>{svc.vehicleName}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Mechanic: <strong>{svc.technicianName || 'Vignesh Kumar'}</strong> &bull; {svc.serviceType}
                </div>
              </div>
              <StatusBadge status={svc.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Assign Technician Modal */}
      {selectedAptForAssign && (
        <Modal
          isOpen={!!selectedAptForAssign}
          onClose={() => setSelectedAptForAssign(null)}
          title="Assign Mechanic to Job"
          subtitle={`Assign technician for ${selectedAptForAssign.vehicleName}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setSelectedAptForAssign(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAssign}>
                Confirm Assignment
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.825rem' }}>
              <div><strong>Job:</strong> #{selectedAptForAssign.id} - {selectedAptForAssign.serviceType}</div>
              <div><strong>Vehicle:</strong> {selectedAptForAssign.vehicleName}</div>
            </div>

            <SelectInput
              label="Select Technician"
              icon={Wrench}
              name="technicianId"
              value={selectedTechId}
              onChange={(e) => setSelectedTechId(e.target.value)}
              required
              options={technicians.map((t) => ({
                value: t.id,
                label: `${t.name} (${t.specialty})`
              }))}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
