import React, { useState } from 'react';
import { Calendar, Search, Filter as FilterIcon, Building, Car, User } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchBar } from '../../components/common/SearchBar';
import { Filter } from '../../components/common/Filter';
import { DataTable } from '../../components/common/DataTable';
import { formatDate, formatCurrency } from '../../utils/formatters';

export const AdminAppointments = () => {
  const { appointments } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.providerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Booking ID',
      accessor: 'id',
      render: (row) => <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{row.id}</span>
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
      header: 'Vehicle',
      accessor: 'vehicleName',
      render: (row) => (
        <div>
          <div>{row.vehicleName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.registrationNumber}</div>
        </div>
      )
    },
    {
      header: 'Workshop Center',
      accessor: 'providerName',
      render: (row) => row.providerName
    },
    {
      header: 'Package',
      accessor: 'serviceType',
      render: (row) => <strong>{row.serviceType}</strong>
    },
    {
      header: 'Date & Slot',
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
      header: 'Cost',
      accessor: 'estimatedCost',
      render: (row) => <span style={{ fontWeight: 700, color: 'var(--accent-green)' }}>{formatCurrency(row.estimatedCost)}</span>
    }
  ];

  return (
    <div>
      <PageHeader
        title="Global Platform Appointments"
        subtitle="System-wide view of all customer booking requests and workshop reservations"
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
            placeholder="Search appointments by ID, customer, vehicle, or workshop..."
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
            'REJECTED',
            'CANCELLED'
          ]}
          allLabel="All Statuses"
        />
      </div>

      <DataTable columns={columns} data={filtered} pageSize={10} />
    </div>
  );
};
