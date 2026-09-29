import React, { useState } from 'react';
import { Calendar, Search, Filter as FilterIcon, Clock, User, Car, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchBar } from '../../components/common/SearchBar';
import { Filter } from '../../components/common/Filter';
import { DataTable } from '../../components/common/DataTable';
import { formatDate } from '../../utils/formatters';

export const ProviderAppointments = () => {
  const { appointments } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.serviceType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      header: 'Scheduled Slot',
      accessor: 'scheduledDate',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700 }}>{formatDate(row.scheduledDate)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.scheduledTime}</div>
        </div>
      )
    },
    {
      header: 'Customer',
      accessor: 'customerName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.customerName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.customerPhone}</div>
        </div>
      )
    },
    {
      header: 'Vehicle & Plate',
      accessor: 'vehicleName',
      render: (row) => (
        <div>
          <div>{row.vehicleName}</div>
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
      header: 'Assigned Tech',
      accessor: 'technicianName',
      render: (row) => row.technicianName || 'Pending Allocation'
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  return (
    <div>
      <PageHeader
        title="Workshop Appointments Schedule"
        subtitle="Master schedule of confirmed customer bookings and assigned technical slots"
        breadcrumbs={[{ label: 'Appointments' }]}
      />

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
            placeholder="Search appointments by ID, customer, vehicle, or service..."
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
            'IN_PROGRESS',
            'COMPLETED',
            'VEHICLE_READY'
          ]}
          allLabel="All Statuses"
        />
      </div>

      <DataTable columns={columns} data={filteredAppointments} pageSize={10} />
    </div>
  );
};
