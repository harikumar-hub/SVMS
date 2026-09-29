import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Search, Eye, XCircle, Activity, Clock, Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchBar } from '../../components/common/SearchBar';
import { Filter } from '../../components/common/Filter';
import { DataTable } from '../../components/common/DataTable';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';

export const MyAppointments = () => {
  const { currentUser } = useAuth();
  const { appointments, updateAppointmentStatus } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cancellingAptId, setCancellingAptId] = useState(null);

  const myAppointments = appointments.filter(
    (a) => a.customerId === currentUser?.id || a.customerName === currentUser?.name
  );

  const filteredAppointments = myAppointments.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.vehicleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.serviceType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.providerName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConfirmCancel = () => {
    if (cancellingAptId) {
      updateAppointmentStatus(cancellingAptId, 'CANCELLED');
      setCancellingAptId(null);
    }
  };

  const columns = [
    {
      header: 'Booking ID',
      accessor: 'id',
      render: (row) => (
        <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
          {row.id}
        </span>
      )
    },
    {
      header: 'Vehicle & Plate',
      accessor: 'vehicleName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.vehicleName}</div>
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
      header: 'Workshop Center',
      accessor: 'providerName',
      render: (row) => row.providerName
    },
    {
      header: 'Scheduled Slot',
      accessor: 'scheduledDate',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{formatDate(row.scheduledDate)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.scheduledTime}</div>
        </div>
      )
    },
    {
      header: 'Live Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
          <Link
            to={`/customer/appointments/${row.id}`}
            className="btn btn-primary btn-sm"
          >
            <Activity size={14} /> Track & Details
          </Link>
          {['PENDING', 'ACCEPTED'].includes(row.status) && (
            <button
              onClick={() => setCancellingAptId(row.id)}
              className="btn btn-danger btn-sm"
              title="Cancel Booking"
            >
              <XCircle size={14} />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="My Service Appointments"
        subtitle="Manage upcoming bookings, inspect real-time progress, and track maintenance"
        breadcrumbs={[{ label: 'Appointments' }]}
        actions={
          <Link to="/customer/book" className="btn btn-primary">
            <Plus size={16} /> Book New Service
          </Link>
        }
      />

      {/* Filter & Search Strip */}
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
            placeholder="Search by ID, vehicle model, service type, or workshop..."
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
            'PARTS_REQUIRED',
            'QUALITY_CHECK',
            'COMPLETED',
            'VEHICLE_READY',
            'CANCELLED'
          ]}
          allLabel="All Statuses"
        />
      </div>

      {/* Data Table */}
      {filteredAppointments.length > 0 ? (
        <DataTable
          columns={columns}
          data={filteredAppointments}
          pageSize={8}
        />
      ) : (
        <EmptyState
          icon={Calendar}
          title="No Appointments Found"
          description="You don't have any bookings matching the current filters."
          actionLabel="Book a Service"
          onAction={() => window.location.href = '/customer/book'}
        />
      )}

      {/* Cancel Confirmation */}
      <ConfirmationDialog
        isOpen={!!cancellingAptId}
        onClose={() => setCancellingAptId(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Service Appointment"
        message="Are you sure you want to cancel this service appointment? The workshop will be notified immediately."
        confirmText="Yes, Cancel Booking"
      />
    </div>
  );
};
