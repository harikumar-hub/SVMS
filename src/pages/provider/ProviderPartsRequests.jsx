import React, { useState } from 'react';
import { Boxes, Search, CheckCircle, Clock, AlertTriangle, User } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { formatDate } from '../../utils/formatters';

export const ProviderPartsRequests = () => {
  const { partsRequests } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = partsRequests.filter((p) =>
    p.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.technicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.vehicleInfo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'Request Ref',
      accessor: 'id',
      render: (row) => <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{row.id}</span>
    },
    {
      header: 'Spare Part',
      accessor: 'partName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700 }}>{row.partName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Code: {row.partNumber}</div>
        </div>
      )
    },
    {
      header: 'Qty',
      accessor: 'requestedQuantity',
      render: (row) => <strong>{row.requestedQuantity} pcs</strong>
    },
    {
      header: 'Vehicle & Bay Job',
      accessor: 'vehicleInfo',
      render: (row) => (
        <div>
          <div>{row.vehicleInfo}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Job #{row.appointmentId}</div>
        </div>
      )
    },
    {
      header: 'Requesting Tech',
      accessor: 'technicianName',
      render: (row) => row.technicianName
    },
    {
      header: 'Urgency',
      accessor: 'urgency',
      render: (row) => (
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '0.15rem 0.5rem',
            borderRadius: '4px',
            backgroundColor: row.urgency === 'HIGH' ? 'var(--danger-light)' : 'var(--bg-subtle)',
            color: row.urgency === 'HIGH' ? 'var(--danger-text)' : 'var(--text-secondary)'
          }}
        >
          {row.urgency}
        </span>
      )
    },
    {
      header: 'Inventory Status',
      accessor: 'status',
      render: (row) => (
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor:
              row.status === 'ISSUED'
                ? 'var(--accent-green-light)'
                : row.status === 'APPROVED'
                ? 'var(--primary-light)'
                : 'var(--warning-light)',
            color:
              row.status === 'ISSUED'
                ? 'var(--accent-green)'
                : row.status === 'APPROVED'
                ? 'var(--primary)'
                : 'var(--warning-text)'
          }}
        >
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Workshop Spare Parts Requisitions"
        subtitle="Track status of parts requested by bay mechanics to the inventory stock room"
        breadcrumbs={[{ label: 'Parts Requests' }]}
      />

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: '#ffffff' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search parts requisitions by item, technician, or vehicle..."
        />
      </div>

      <DataTable columns={columns} data={filtered} pageSize={8} />
    </div>
  );
};
