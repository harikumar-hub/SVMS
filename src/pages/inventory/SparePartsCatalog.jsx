import React, { useState } from 'react';
import { Boxes, Plus, Edit2, Trash2, Search, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { Filter } from '../../components/common/Filter';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { AddEditPartModal } from './AddEditPartModal';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { formatCurrency } from '../../utils/formatters';

export const SparePartsCatalog = () => {
  const { spareParts, addPart, updatePart, deletePart } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [deletingPartId, setDeletingPartId] = useState(null);

  const categories = Array.from(new Set((spareParts || []).map((p) => p.category || 'General')));

  const filteredParts = (spareParts || []).filter((p) => {
    const pName = (p.partName || p.name || '').toLowerCase();
    const pNum = (p.partNumber || p.part_number || '').toLowerCase();
    const pSup = (p.supplier || '').toLowerCase();
    const q = (searchQuery || '').toLowerCase();

    const matchesSearch = pName.includes(q) || pNum.includes(q) || pSup.includes(q);
    const matchesCategory = !categoryFilter || (p.category || 'General') === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSave = (data) => {
    if (editingPart) {
      updatePart(editingPart.id, data);
    } else {
      addPart(data);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingPartId) {
      deletePart(deletingPartId);
      setDeletingPartId(null);
    }
  };

  const columns = [
    {
      header: 'Part Number',
      accessor: 'partNumber',
      render: (row) => (
        <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>
          {row.partNumber || row.part_number || 'SKU-GEN'}
        </span>
      )
    },
    {
      header: 'Part Name & Details',
      accessor: 'partName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {row.partName || row.name || 'Spare Part'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Category: {row.category || 'General'} &bull; Loc: {row.location || 'Shelf A'}
          </div>
        </div>
      )
    },
    {
      header: 'Available Qty',
      accessor: 'availableQuantity',
      render: (row) => {
        const qty = row.availableQuantity ?? row.available_quantity ?? 0;
        const min = row.minimumStock ?? row.minimum_stock ?? 0;
        return (
          <span
            style={{
              fontWeight: 800,
              color: qty === 0 ? 'var(--danger-text)' : qty <= min ? 'var(--warning-text)' : 'var(--accent-green)'
            }}
          >
            {qty} in stock
          </span>
        );
      }
    },
    {
      header: 'Min Stock',
      accessor: 'minimumStock',
      render: (row) => `${row.minimumStock ?? row.minimum_stock ?? 0} units`
    },
    {
      header: 'Unit Price',
      accessor: 'unitPrice',
      render: (row) => formatCurrency(row.unitPrice ?? row.unit_price ?? 0)
    },
    {
      header: 'Supplier',
      accessor: 'supplier',
      render: (row) => row.supplier
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const isOut = row.availableQuantity === 0;
        const isLow = row.availableQuantity <= row.minimumStock;

        return (
          <span
            className={`badge ${isOut ? 'badge-out-of-stock' : isLow ? 'badge-low-stock' : 'badge-in-stock'}`}
          >
            {isOut ? 'Out of Stock' : isLow ? 'Low Stock Alert' : 'In Stock'}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              setEditingPart(row);
              setIsAddModalOpen(true);
            }}
            className="btn btn-secondary btn-sm btn-icon"
            title="Edit part"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeletingPartId(row.id)}
            className="btn btn-danger btn-sm btn-icon"
            title="Delete part"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Spare Parts Master Catalog"
        subtitle="Catalog repository of OEM vehicle replacement components, pricing, and stock metrics"
        breadcrumbs={[{ label: 'Spare Parts' }]}
        actions={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setEditingPart(null);
              setIsAddModalOpen(true);
            }}
          >
            Add New Part
          </Button>
        }
      />

      {/* Filter & Search */}
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
            placeholder="Search spare parts by name, SKU part number, or supplier..."
          />
        </div>

        <Filter
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={categories}
          allLabel="All Categories"
        />
      </div>

      <DataTable columns={columns} data={filteredParts} pageSize={10} />

      {/* Modal */}
      <AddEditPartModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingPart(null);
        }}
        onSave={handleSave}
        initialData={editingPart}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deletingPartId}
        onClose={() => setDeletingPartId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Spare Part"
        message="Are you sure you want to remove this spare part SKU from the master catalog?"
        confirmText="Delete SKU"
      />
    </div>
  );
};
