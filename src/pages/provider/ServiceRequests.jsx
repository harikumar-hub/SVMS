import React, { useState } from 'react';
import {
  ClipboardList,
  Check,
  X,
  UserCheck,
  Search,
  Eye,
  Calendar,
  Wrench,
  Car,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchBar } from '../../components/common/SearchBar';
import { Filter } from '../../components/common/Filter';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { SelectInput } from '../../components/common/SelectInput';
import { FormInput } from '../../components/common/FormInput';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';

export const ServiceRequests = () => {
  const { appointments, technicians, updateAppointmentStatus, assignTechnician } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assignModalApt, setAssignModalApt] = useState(null);
  const [selectedTechId, setSelectedTechId] = useState('');
  const [viewDetailsApt, setViewDetailsApt] = useState(null);

  const filteredRequests = appointments.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.serviceType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAccept = (aptId) => {
    updateAppointmentStatus(aptId, 'ACCEPTED');
  };

  const handleReject = (aptId) => {
    updateAppointmentStatus(aptId, 'REJECTED');
  };

  const handleConfirmAssign = () => {
    if (assignModalApt && selectedTechId) {
      assignTechnician(assignModalApt.id, selectedTechId);
      setAssignModalApt(null);
      setSelectedTechId('');
    }
  };

  const columns = [
    {
      header: 'Request ID',
      accessor: 'id',
      render: (row) => (
        <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
          {row.id}
        </span>
      )
    },
    {
      header: 'Customer',
      accessor: 'customerName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700 }}>{row.customerName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.customerPhone}</div>
        </div>
      )
    },
    {
      header: 'Vehicle & Plate',
      accessor: 'vehicleName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.vehicleName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.registrationNumber}</div>
        </div>
      )
    },
    {
      header: 'Service Package',
      accessor: 'serviceType',
      render: (row) => <strong>{row.serviceType}</strong>
    },
    {
      header: 'Date & Time',
      accessor: 'scheduledDate',
      render: (row) => (
        <div>
          <div>{formatDate(row.scheduledDate)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.scheduledTime}</div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Assigned Tech',
      accessor: 'technicianName',
      render: (row) => (
        <span style={{ fontSize: '0.85rem', color: row.technicianName ? 'var(--text-primary)' : 'var(--text-light)' }}>
          {row.technicianName || 'Unassigned'}
        </span>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setViewDetailsApt(row)}
            className="btn btn-secondary btn-sm btn-icon"
            title="View Details"
          >
            <Eye size={15} />
          </button>

          {row.status === 'PENDING' && (
            <button
              onClick={() => handleAccept(row.id)}
              className="btn btn-success btn-sm btn-icon"
              title="Accept Request"
            >
              <Check size={15} />
            </button>
          )}

          {['PENDING', 'ACCEPTED'].includes(row.status) && (
            <button
              onClick={() => {
                setAssignModalApt(row);
                setSelectedTechId(technicians[0]?.id || '');
              }}
              className="btn btn-primary btn-sm btn-icon"
              title="Assign Technician"
            >
              <UserCheck size={15} />
            </button>
          )}

          {row.status === 'PENDING' && (
            <button
              onClick={() => handleReject(row.id)}
              className="btn btn-danger btn-sm btn-icon"
              title="Decline Request"
            >
              <X size={15} />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Service Requests Management"
        subtitle="Review, approve, and allocate workshop technicians to incoming customer bookings"
        breadcrumbs={[{ label: 'Service Requests' }]}
      />

      {/* Filter & Search Bar */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          padding: '1.25rem',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center'
        }}
      >
        <div style={{ flex: '1 1 300px' }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by ID, customer name, vehicle, or service..."
          />
        </div>

        <Filter
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            'PENDING',
            'ACCEPTED',
            'TECHNICIAN_ASSIGNED',
            'VEHICLE_RECEIVED',
            'INSPECTION',
            'IN_PROGRESS',
            'QUALITY_CHECK',
            'COMPLETED',
            'REJECTED'
          ]}
          allLabel="All Statuses"
        />
      </div>

      {filteredRequests.length > 0 ? (
        <DataTable columns={columns} data={filteredRequests} pageSize={10} />
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No Service Requests Found"
          description="There are currently no bookings matching your criteria."
        />
      )}

      {/* Assign Technician Modal */}
      {assignModalApt && (
        <Modal
          isOpen={!!assignModalApt}
          onClose={() => setAssignModalApt(null)}
          title="Assign Workshop Technician"
          subtitle={`Allocate a qualified mechanic for ${assignModalApt.vehicleName}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setAssignModalApt(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmAssign}>
                Allocate Technician
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              <div><strong>Job Reference:</strong> #{assignModalApt.id}</div>
              <div><strong>Service Required:</strong> {assignModalApt.serviceType}</div>
              <div><strong>Problem Note:</strong> {assignModalApt.problemDescription}</div>
            </div>

            <SelectInput
              label="Select Available Workshop Technician"
              icon={Wrench}
              name="technicianId"
              value={selectedTechId}
              onChange={(e) => setSelectedTechId(e.target.value)}
              required
              options={technicians.map((t) => ({
                value: t.id,
                label: `${t.name} - Specialization: ${t.specialty} (${t.activeJobsCount} Active Jobs)`
              }))}
            />
          </div>
        </Modal>
      )}

      {/* View Details Modal */}
      {viewDetailsApt && (
        <Modal
          isOpen={!!viewDetailsApt}
          onClose={() => setViewDetailsApt(null)}
          title={`Service Request #${viewDetailsApt.id}`}
          subtitle="Detailed customer booking submission"
          footer={
            <Button variant="secondary" onClick={() => setViewDetailsApt(null)}>
              Close
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
              <StatusBadge status={viewDetailsApt.status} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Customer:</span>
              <strong>{viewDetailsApt.customerName} ({viewDetailsApt.customerPhone})</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Vehicle:</span>
              <strong>{viewDetailsApt.vehicleName}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Service Package:</span>
              <strong style={{ color: 'var(--primary)' }}>{viewDetailsApt.serviceType}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Scheduled Slot:</span>
              <strong>{formatDate(viewDetailsApt.scheduledDate)} at {viewDetailsApt.scheduledTime}</strong>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
              <span style={{ fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Problem Description:</span>
              <p style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', lineHeight: 1.5 }}>
                {viewDetailsApt.problemDescription}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
