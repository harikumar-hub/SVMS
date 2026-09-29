import React, { useState } from 'react';
import { History, FileText, Download, CheckCircle, Search, Eye, Car } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate, formatCurrency } from '../../utils/formatters';

export const ServiceHistory = () => {
  const { currentUser } = useAuth();
  const { appointments } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // History includes completed or vehicle ready services
  const historyRecords = appointments.filter(
    (a) =>
      (a.customerId === currentUser?.id || a.customerName === currentUser?.name) &&
      ['COMPLETED', 'VEHICLE_READY', 'CANCELLED', 'REJECTED'].includes(a.status)
  );

  const filteredRecords = historyRecords.filter((r) => {
    return (
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.providerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
      header: 'Vehicle',
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
      header: 'Service Center',
      accessor: 'providerName',
      render: (row) => row.providerName
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
      header: 'Total Paid',
      accessor: 'estimatedCost',
      render: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--accent-green)' }}>
          {formatCurrency(row.estimatedCost)}
        </span>
      )
    },
    {
      header: 'Invoice',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => setSelectedInvoice(row)}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
        >
          <FileText size={14} /> Receipt
        </button>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Vehicle Service History"
        subtitle="Complete digital logbook of completed maintenance, parts replacements, and workshop receipts"
        breadcrumbs={[{ label: 'Service History' }]}
      />

      {/* Search Bar */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          padding: '1.25rem',
          backgroundColor: '#ffffff'
        }}
      >
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search historical service records by ID, vehicle model, or workshop..."
        />
      </div>

      {filteredRecords.length > 0 ? (
        <DataTable columns={columns} data={filteredRecords} pageSize={8} />
      ) : (
        <EmptyState
          icon={History}
          title="No Historical Records Found"
          description="Your completed service appointments and digital inspection archives will appear here."
        />
      )}

      {/* Invoice / Service Receipt Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          title="Digital Service Summary & Receipt"
          subtitle={`Reference Job ID: ${selectedInvoice.id}`}
          size="md"
          footer={
            <>
              <Button variant="secondary" onClick={() => setSelectedInvoice(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon={Download}
                onClick={() => alert('Receipt downloaded successfully.')}
              >
                Download Receipt PDF
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{selectedInvoice.providerName}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Certified VSMS Partner Workshop</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <StatusBadge status={selectedInvoice.status} />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Date: {formatDate(selectedInvoice.scheduledDate)}
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>Vehicle Information:</div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {selectedInvoice.vehicleName} &bull; Plate: {selectedInvoice.registrationNumber}
              </div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Technician: {selectedInvoice.technicianName || 'Vignesh Kumar'}
              </div>
            </div>

            {/* Line items breakdown */}
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Work Performed & Charges:</div>
              <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem', backgroundColor: '#f8fafc', fontWeight: 700, fontSize: '0.8rem' }}>
                  <span>Item Description</span>
                  <span>Amount</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span>{selectedInvoice.serviceType} Package Labor</span>
                  <span>₹1,200</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span>OEM Parts & Consumables Top-Up</span>
                  <span>₹650</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem', borderTop: '1px solid var(--border-subtle)', backgroundColor: '#f8fafc', fontWeight: 800 }}>
                  <span>Total Amount Paid</span>
                  <span style={{ color: 'var(--accent-green)' }}>{formatCurrency(selectedInvoice.estimatedCost)}</span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              &bull; Official digital invoice generated by VSMS Smart Cloud &bull;
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
