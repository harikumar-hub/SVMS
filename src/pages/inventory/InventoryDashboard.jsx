import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Boxes,
  AlertTriangle,
  ClipboardList,
  DollarSign,
  Plus,
  Check,
  X,
  ArrowRight,
  TrendingDown,
  Truck,
  CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DashboardCard } from '../../components/common/DashboardCard';
import { Button } from '../../components/common/Button';
import { AddEditPartModal } from './AddEditPartModal';
import { formatCurrency } from '../../utils/formatters';

export const InventoryDashboard = () => {
  const { spareParts, partsRequests, approvePartsRequest, rejectPartsRequest, issueParts, addPart } = useData();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Compute statistics
  const lowStockItems = spareParts.filter((p) => p.availableQuantity <= p.minimumStock);
  const outOfStockItems = spareParts.filter((p) => p.availableQuantity === 0);
  const pendingRequests = partsRequests.filter((p) => p.status === 'PENDING' || p.status === 'APPROVED');

  const totalValuation = spareParts.reduce((acc, p) => acc + p.availableQuantity * p.unitPrice, 0);

  // Pie chart by Category
  const categoryCounts = spareParts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.availableQuantity;
    return acc;
  }, {});

  const pieData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#64748b'];

  return (
    <div>
      <PageHeader
        title="Spare Parts & Inventory Command Center"
        subtitle="Stock levels, low-threshold alarms, supplier orders, and technician requisitions"
        breadcrumbs={[{ label: 'Inventory Management' }]}
        actions={
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Button variant="primary" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
              Add Spare Part
            </Button>
            <Link to="/inventory/requests" className="btn btn-secondary">
              Parts Queue ({pendingRequests.length})
            </Link>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        <DashboardCard
          title="Total Catalog SKUs"
          value={spareParts.length}
          subtitle="Distinct spare parts"
          icon={Boxes}
          color="primary"
          onClick={() => navigate('/inventory/parts')}
        />
        <DashboardCard
          title="Low Stock Alerts"
          value={lowStockItems.length}
          subtitle={`${outOfStockItems.length} Out of Stock`}
          icon={AlertTriangle}
          color="danger"
          onClick={() => navigate('/inventory/low-stock')}
        />
        <DashboardCard
          title="Pending Requisitions"
          value={pendingRequests.length}
          subtitle="From workshop bay mechanics"
          icon={ClipboardList}
          color="warning"
          onClick={() => navigate('/inventory/requests')}
        />
        <DashboardCard
          title="Stock Valuation"
          value={formatCurrency(totalValuation)}
          subtitle="Total available store value"
          icon={DollarSign}
          color="success"
        />
      </div>

      {/* Technician Parts Requests Quick Processing Queue */}
      <div className="card" style={{ backgroundColor: '#ffffff', marginBottom: '1.75rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <ClipboardList size={20} style={{ color: 'var(--primary)' }} /> Technician Parts Requisitions Queue
            </h3>
            <p className="card-subtitle">Review, approve, and issue parts with live stock auto-deduction</p>
          </div>
          <Link to="/inventory/requests" className="btn btn-secondary btn-sm">
            View All ({partsRequests.length})
          </Link>
        </div>

        {pendingRequests.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {pendingRequests.map((req) => {
              const matchedPart = spareParts.find((p) => p.id === req.partId);
              const hasEnoughStock = matchedPart && matchedPart.availableQuantity >= req.requestedQuantity;

              return (
                <div
                  key={req.id}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-default)',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--primary)' }}>
                        #{req.id}
                      </span>
                      <strong style={{ fontSize: '1rem' }}>{req.partName}</strong>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                        Qty: {req.requestedQuantity}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          backgroundColor: req.status === 'APPROVED' ? 'var(--accent-green-light)' : 'var(--warning-light)',
                          color: req.status === 'APPROVED' ? 'var(--accent-green)' : 'var(--warning-text)',
                          padding: '0.1rem 0.5rem',
                          borderRadius: '4px'
                        }}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      Requested by: <strong>{req.technicianName}</strong> &bull; Vehicle: {req.vehicleInfo} &bull; Urgency: <span style={{ fontWeight: 700, color: req.urgency === 'HIGH' ? 'var(--danger-text)' : 'inherit' }}>{req.urgency}</span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Stock Check: Available in store:{' '}
                      <strong style={{ color: hasEnoughStock ? 'var(--accent-green)' : 'var(--danger-text)' }}>
                        {matchedPart ? `${matchedPart.availableQuantity} units` : 'Unknown'}
                      </strong>{' '}
                      ({matchedPart?.location || 'Shelf A-01'})
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {req.status === 'PENDING' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => approvePartsRequest(req.id)}
                      >
                        Approve
                      </Button>
                    )}
                    {hasEnoughStock && (
                      <Button
                        variant="success"
                        size="sm"
                        icon={Check}
                        onClick={() => issueParts(req.id)}
                      >
                        Issue Part to Bay &rarr;
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      icon={X}
                      onClick={() => rejectPartsRequest(req.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={32} style={{ color: 'var(--accent-green)', margin: '0 auto 0.5rem' }} />
            <p style={{ fontWeight: 700 }}>All technician parts requisitions have been fulfilled!</p>
          </div>
        )}
      </div>

      {/* Two Column Grid: Low Stock Warnings & Category Breakdown */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        {/* Low Stock Watchlist */}
        <div className="card" style={{ backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <AlertTriangle size={20} style={{ color: 'var(--danger)' }} /> Low Stock Priority Watchlist
              </h3>
              <p className="card-subtitle">Items at or below safety reorder threshold</p>
            </div>
            <Link to="/inventory/low-stock" className="btn btn-secondary btn-sm">
              Reorder All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--danger-light)',
                  border: '1px solid #fecaca'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--danger-text)' }}>
                    {item.partName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Part #{item.partNumber} &bull; Supplier: {item.supplier}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--danger-text)' }}>
                    {item.availableQuantity} left
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Min: {item.minimumStock}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Volume by Category Chart */}
        <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Stock Distribution by Category
          </h3>
          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Add Part Modal */}
      <AddEditPartModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addPart}
      />
    </div>
  );
};
