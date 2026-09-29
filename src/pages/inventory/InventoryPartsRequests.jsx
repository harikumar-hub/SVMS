import React, { useState } from 'react';
import { ClipboardList, Check, X, Search, CheckCircle2, AlertTriangle, Boxes, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchBar } from '../../components/common/SearchBar';
import { Filter } from '../../components/common/Filter';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';

export const InventoryPartsRequests = () => {
  const { partsRequests, spareParts, approvePartsRequest, rejectPartsRequest, issueParts } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRequestDetails, setSelectedRequestDetails] = useState(null);
  const [feedback, setFeedback] = useState('');

  const filtered = partsRequests.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.technicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehicleInfo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (reqId) => {
    approvePartsRequest(reqId);
    setFeedback('Parts requisition approved.');
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleIssue = (reqId) => {
    issueParts(reqId);
    setFeedback('Part successfully issued to bay and stock deducted automatically.');
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleReject = (reqId) => {
    rejectPartsRequest(reqId);
    setFeedback('Parts request marked as rejected.');
    setTimeout(() => setFeedback(''), 3000);
  };

  const columns = [
    {
      header: 'Requisition ID',
      accessor: 'id',
      render: (row) => <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{row.id}</span>
    },
    {
      header: 'Part Requested',
      accessor: 'partName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700 }}>{row.partName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {row.partNumber}</div>
        </div>
      )
    },
    {
      header: 'Qty Requested',
      accessor: 'requestedQuantity',
      render: (row) => <strong>{row.requestedQuantity} pcs</strong>
    },
    {
      header: 'Stock in Store',
      accessor: 'partId',
      render: (row) => {
        const item = spareParts.find((p) => p.id === row.partId);
        const inStock = item ? item.availableQuantity : 0;
        const sufficient = inStock >= row.requestedQuantity;

        return (
          <span style={{ fontWeight: 700, color: sufficient ? 'var(--accent-green)' : 'var(--danger-text)' }}>
            {inStock} units ({sufficient ? 'Sufficient' : 'Insufficient'})
          </span>
        );
      }
    },
    {
      header: 'Target Vehicle',
      accessor: 'vehicleInfo',
      render: (row) => (
        <div>
          <div>{row.vehicleInfo}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Job #{row.appointmentId}</div>
        </div>
      )
    },
    {
      header: 'Technician',
      accessor: 'technicianName',
      render: (row) => row.technicianName
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
                : row.status === 'REJECTED'
                ? 'var(--danger-light)'
                : 'var(--warning-light)',
            color:
              row.status === 'ISSUED'
                ? 'var(--accent-green)'
                : row.status === 'APPROVED'
                ? 'var(--primary)'
                : row.status === 'REJECTED'
                ? 'var(--danger-text)'
                : 'var(--warning-text)'
          }}
        >
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => {
        const item = spareParts.find((p) => p.id === row.partId);
        const hasStock = item && item.availableQuantity >= row.requestedQuantity;

        return (
          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
            {row.status === 'PENDING' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApprove(row.id)}
                title="Approve Requisition"
              >
                Approve
              </Button>
            )}

            {hasStock && row.status !== 'ISSUED' && (
              <Button
                variant="success"
                size="sm"
                icon={Check}
                onClick={() => handleIssue(row.id)}
                title="Issue Part and Deduct Stock"
              >
                Issue Part
              </Button>
            )}

            {row.status !== 'ISSUED' && row.status !== 'REJECTED' && (
              <button
                onClick={() => handleReject(row.id)}
                className="btn btn-danger btn-sm btn-icon"
                title="Reject"
              >
                <X size={14} />
              </button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div>
      <PageHeader
        title="Technician Parts Requests Queue"
        subtitle="Approve or reject workshop bay requisitions and issue components with automated inventory updates"
        breadcrumbs={[{ label: 'Parts Requests' }]}
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
            placeholder="Search requisitions by part, technician, vehicle, or ID..."
          />
        </div>

        <Filter
          value={statusFilter}
          onChange={setStatusFilter}
          options={['PENDING', 'APPROVED', 'ISSUED', 'REJECTED']}
          allLabel="All Requisition Statuses"
        />
      </div>

      <DataTable columns={columns} data={filtered} pageSize={8} />
    </div>
  );
};
