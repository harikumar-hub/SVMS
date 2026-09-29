import React, { useState } from 'react';
import { Activity, Plus, Minus, Search, CheckCircle2, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/common/FormInput';
import { formatCurrency } from '../../utils/formatters';

export const StockManagement = () => {
  const { spareParts, adjustStock } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [adjustingPart, setAdjustingPart] = useState(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState(5);
  const [feedback, setFeedback] = useState('');

  const filteredParts = (spareParts || []).filter((p) => {
    const pName = (p.partName || p.name || '').toLowerCase();
    const pNum = (p.partNumber || p.part_number || '').toLowerCase();
    const q = (searchQuery || '').toLowerCase();
    return pName.includes(q) || pNum.includes(q);
  });

  const handleQuickAdjust = (partId, delta) => {
    adjustStock(partId, delta);
    setFeedback(`Stock adjusted by ${delta > 0 ? '+' : ''}${delta} units.`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleCustomAdjust = (e) => {
    e.preventDefault();
    if (adjustingPart) {
      adjustStock(adjustingPart.id, Number(adjustmentAmount));
      setAdjustingPart(null);
      setFeedback(`Stock updated for ${adjustingPart.partName || adjustingPart.name || 'item'}.`);
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  return (
    <div>
      <PageHeader
        title="Stock Level Operations & Adjustments"
        subtitle="Manage stock intakes, warehouse shelf adjustments, and inventory quantity counts"
        breadcrumbs={[{ label: 'Stock Management' }]}
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

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: '#ffffff' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search parts by name or SKU number to adjust quantity..."
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredParts.map((part) => (
          <div
            key={part.id}
            className="card"
            style={{
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.25rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {part.partName || part.name || 'Spare Part'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--primary)' }}>
                    {part.partNumber || part.part_number || 'SKU-GEN'}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    color: (part.availableQuantity ?? 0) <= (part.minimumStock ?? 0) ? 'var(--danger-text)' : 'var(--accent-green)'
                  }}
                >
                  {part.availableQuantity ?? 0}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <span>Min Stock: {part.minimumStock ?? 0}</span>
                <span>Shelf: {part.location || 'A-01'}</span>
                <span>{formatCurrency(part.unitPrice ?? 0)}/ea</span>
              </div>
            </div>

            {/* Quick Adjustment Controls */}
            <div
              style={{
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  onClick={() => handleQuickAdjust(part.id, -1)}
                  disabled={part.availableQuantity === 0}
                  className="btn btn-secondary btn-sm btn-icon"
                  title="Subtract 1 unit"
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => handleQuickAdjust(part.id, 1)}
                  className="btn btn-secondary btn-sm btn-icon"
                  title="Add 1 unit"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => handleQuickAdjust(part.id, 10)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                  title="Restock +10 units"
                >
                  +10 Pack
                </button>
              </div>

              <button
                onClick={() => {
                  setAdjustingPart(part);
                  setAdjustmentAmount(5);
                }}
                className="btn btn-primary btn-sm"
              >
                Custom Intake
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Adjustment Modal */}
      {adjustingPart && (
        <Modal
          isOpen={!!adjustingPart}
          onClose={() => setAdjustingPart(null)}
          title="Custom Stock Adjustment"
          subtitle={`Adjust physical inventory count for ${adjustingPart.partName}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setAdjustingPart(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCustomAdjust}>
                Apply Adjustment
              </Button>
            </>
          }
        >
          <form onSubmit={handleCustomAdjust}>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              <div><strong>Current Available Quantity:</strong> {adjustingPart.availableQuantity} units</div>
              <div><strong>Minimum Threshold:</strong> {adjustingPart.minimumStock} units</div>
            </div>

            <FormInput
              label="Quantity to Add / Subtract (Use negative numbers to deduct)"
              name="adjustmentAmount"
              type="number"
              value={adjustmentAmount}
              onChange={(e) => setAdjustmentAmount(e.target.value)}
              placeholder="e.g. 15 or -3"
              required
            />
          </form>
        </Modal>
      )}
    </div>
  );
};
