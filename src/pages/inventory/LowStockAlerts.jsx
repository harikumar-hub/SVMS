import React, { useState } from 'react';
import { AlertTriangle, Plus, Truck, CheckCircle2, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/common/FormInput';
import { formatCurrency } from '../../utils/formatters';

export const LowStockAlerts = () => {
  const { spareParts, adjustStock } = useData();
  const [reorderPart, setReorderPart] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(20);
  const [feedback, setFeedback] = useState('');

  // Items at or below minimum threshold
  const lowStockItems = spareParts.filter((p) => p.availableQuantity <= p.minimumStock);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (reorderPart) {
      adjustStock(reorderPart.id, Number(orderQuantity));
      setFeedback(`Purchase Order sent to ${reorderPart.supplier}. Added +${orderQuantity} units.`);
      setReorderPart(null);
      setTimeout(() => setFeedback(''), 4000);
    }
  };

  const columns = [
    {
      header: 'SKU Number',
      accessor: 'partNumber',
      render: (row) => <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{row.partNumber}</span>
    },
    {
      header: 'Part Name',
      accessor: 'partName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.partName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location: {row.location || 'Shelf A'}</div>
        </div>
      )
    },
    {
      header: 'Available Stock',
      accessor: 'availableQuantity',
      render: (row) => (
        <span style={{ fontWeight: 800, color: row.availableQuantity === 0 ? '#b91c1c' : '#c2410c' }}>
          {row.availableQuantity} units left
        </span>
      )
    },
    {
      header: 'Minimum Threshold',
      accessor: 'minimumStock',
      render: (row) => `${row.minimumStock} units`
    },
    {
      header: 'Supplier',
      accessor: 'supplier',
      render: (row) => row.supplier
    },
    {
      header: 'Severity',
      accessor: 'status',
      render: (row) => {
        const isOut = row.availableQuantity === 0;
        return (
          <span className={`badge ${isOut ? 'badge-out-of-stock' : 'badge-low-stock'}`}>
            {isOut ? 'OUT OF STOCK' : 'LOW STOCK ALERT'}
          </span>
        );
      }
    },
    {
      header: 'Action',
      align: 'right',
      render: (row) => (
        <Button
          variant="primary"
          size="sm"
          icon={Truck}
          onClick={() => {
            setReorderPart(row);
            setOrderQuantity(20);
          }}
        >
          Fast Restock
        </Button>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Low Stock & Depleted Inventory Alerts"
        subtitle="Critical items requiring immediate purchase order placement to prevent workshop service delays"
        breadcrumbs={[{ label: 'Low Stock Alerts' }]}
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

      <DataTable columns={columns} data={lowStockItems} pageSize={8} />

      {/* Restock Order Modal */}
      {reorderPart && (
        <Modal
          isOpen={!!reorderPart}
          onClose={() => setReorderPart(null)}
          title="Place Supplier Purchase Order"
          subtitle={`Reorder ${reorderPart.partName} from ${reorderPart.supplier}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setReorderPart(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handlePlaceOrder}>
                Confirm Order & Restock
              </Button>
            </>
          }
        >
          <form onSubmit={handlePlaceOrder}>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              <div><strong>Part SKU:</strong> {reorderPart.partNumber}</div>
              <div><strong>Current Stock:</strong> {reorderPart.availableQuantity} (Min: {reorderPart.minimumStock})</div>
              <div><strong>Unit Price:</strong> {formatCurrency(reorderPart.unitPrice)}</div>
            </div>

            <FormInput
              label="Purchase Order Quantity"
              name="orderQuantity"
              type="number"
              min="5"
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(e.target.value)}
              required
            />
          </form>
        </Modal>
      )}
    </div>
  );
};
