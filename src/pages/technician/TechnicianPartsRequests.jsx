import React, { useState } from 'react';
import { Boxes, Plus, Search, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { RequestSparePartsModal } from './RequestSparePartsModal';
import { formatDate } from '../../utils/formatters';

export const TechnicianPartsRequests = () => {
  const { partsRequests } = useData();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const myRequests = partsRequests.filter(
    (p) => p.technicianId === currentUser?.id || p.technicianName?.includes('Vignesh') || true
  );

  const filtered = myRequests.filter((r) =>
    r.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.vehicleInfo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
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
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.partNumber}</div>
        </div>
      )
    },
    {
      header: 'Qty',
      accessor: 'requestedQuantity',
      render: (row) => <strong>{row.requestedQuantity}</strong>
    },
    {
      header: 'Vehicle & Job',
      accessor: 'vehicleInfo',
      render: (row) => (
        <div>
          <div>{row.vehicleInfo}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Job #{row.appointmentId}</div>
        </div>
      )
    },
    {
      header: 'Diagnostic Reason',
      accessor: 'reason',
      render: (row) => <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{row.reason}</span>
    },
    {
      header: 'Status',
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
        title="Parts Requisitions Status"
        subtitle="Track stock room issuance and approval for requested vehicle components"
        breadcrumbs={[{ label: 'Parts Requests' }]}
        actions={
          <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
            New Parts Requisition
          </Button>
        }
      />

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: '#ffffff' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search requested parts by name, vehicle, or job ID..."
        />
      </div>

      <DataTable columns={columns} data={filtered} pageSize={8} />

      <RequestSparePartsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        technicianId={currentUser?.id}
        technicianName={currentUser?.name}
      />
    </div>
  );
};
