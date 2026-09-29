import React, { useState } from 'react';
import { History, Search, FileText, CheckCircle2, Eye, Car } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { formatDate, formatCurrency } from '../../utils/formatters';

export const ProviderServiceRecords = () => {
  const { appointments } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewRecord, setViewRecord] = useState(null);

  const completedRecords = appointments.filter((a) =>
    ['COMPLETED', 'VEHICLE_READY', 'CANCELLED', 'REJECTED'].includes(a.status)
  );

  const filtered = completedRecords.filter((r) =>
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'Job ID',
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
      render: (row) => <strong>{row.customerName}</strong>
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
      header: 'Technician',
      accessor: 'technicianName',
      render: (row) => row.technicianName || 'Vignesh Kumar'
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
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => setViewRecord(row)}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
        >
          <Eye size={14} /> Log Card
        </button>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Workshop Service Records Archive"
        subtitle="Completed job cards, technical inspection logs, and historical customer servicing records"
        breadcrumbs={[{ label: 'Service Records' }]}
      />

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: '#ffffff' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search service logs by Job ID, customer, vehicle, or technician..."
        />
      </div>

      <DataTable columns={columns} data={filtered} pageSize={10} />

      {/* Detailed Log Modal */}
      {viewRecord && (
        <Modal
          isOpen={!!viewRecord}
          onClose={() => setViewRecord(null)}
          title={`Completed Job Log #${viewRecord.id}`}
          subtitle={`${viewRecord.vehicleName} (${viewRecord.registrationNumber})`}
          footer={
            <Button variant="secondary" onClick={() => setViewRecord(null)}>
              Close Log
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div>
                <div><strong>Customer:</strong> {viewRecord.customerName} ({viewRecord.customerPhone})</div>
                <div><strong>Lead Mechanic:</strong> {viewRecord.technicianName || 'Vignesh Kumar'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <StatusBadge status={viewRecord.status} />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Billed: {formatCurrency(viewRecord.estimatedCost)}
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>Customer Reported Concern:</div>
              <p>{viewRecord.problemDescription}</p>
            </div>

            {viewRecord.inspectionNotes && (
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>Final Inspection Findings & Remarks:</div>
                <p>{viewRecord.inspectionNotes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
