import React, { useState } from 'react';
import { CheckCircle2, Search, Car, Calendar, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { formatDate } from '../../utils/formatters';

export const CompletedServices = () => {
  const { appointments } = useData();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const completed = appointments.filter(
    (a) =>
      ['COMPLETED', 'VEHICLE_READY'].includes(a.status) &&
      (a.technicianId === currentUser?.id || a.technicianName?.includes('Vignesh') || true)
  );

  const filtered = completed.filter((c) =>
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'Job ID',
      accessor: 'id',
      render: (row) => <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{row.id}</span>
    },
    {
      header: 'Vehicle & Plate',
      accessor: 'vehicleName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700 }}>{row.vehicleName}</div>
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
      header: 'Completed Date',
      accessor: 'scheduledDate',
      render: (row) => formatDate(row.scheduledDate)
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
        title="Completed Technical Services"
        subtitle="Archive of successfully serviced and quality-checked vehicles"
        breadcrumbs={[{ label: 'Completed Services' }]}
      />

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: '#ffffff' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search completed jobs..."
        />
      </div>

      <DataTable columns={columns} data={filtered} pageSize={8} />
    </div>
  );
};
