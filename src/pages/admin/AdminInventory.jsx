import React, { useState } from 'react';
import { Boxes, Search, AlertTriangle, Truck } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { formatCurrency } from '../../utils/formatters';

export const AdminInventory = () => {
  const { spareParts = [] } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = (spareParts || []).filter((p) => {
    const pName = (p.partName || p.name || '').toLowerCase();
    const pNum = (p.partNumber || p.part_number || '').toLowerCase();
    const pCat = (p.category || '').toLowerCase();
    const pSup = (p.supplier || '').toLowerCase();
    const q = (searchQuery || '').toLowerCase();
    return pName.includes(q) || pNum.includes(q) || pCat.includes(q) || pSup.includes(q);
  });

  const columns = [
    {
      header: 'Part SKU',
      accessor: 'partNumber',
      render: (row) => (
        <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>
          {row.partNumber || row.part_number || 'SKU-GEN'}
        </span>
      )
    },
    {
      header: 'Part Name',
      accessor: 'partName',
      render: (row) => <strong>{row.partName || row.name || 'Spare Part'}</strong>
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => row.category || 'General'
    },
    {
      header: 'Available Stock',
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
            {qty} units
          </span>
        );
      }
    },
    {
      header: 'Min Threshold',
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
      render: (row) => row.supplier || 'NexaCare OEM'
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const qty = row.availableQuantity ?? row.available_quantity ?? 0;
        const min = row.minimumStock ?? row.minimum_stock ?? 0;
        const isOut = qty === 0;
        const isLow = qty <= min;
        return (
          <span className={`badge ${isOut ? 'badge-out-of-stock' : isLow ? 'badge-low-stock' : 'badge-in-stock'}`}>
            {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
          </span>
        );
      }
    }
  ];

  return (
    <div>
      <PageHeader
        title="System-Wide Spare Parts Inventory"
        subtitle="Overview of spare parts catalog, store valuation, and low-stock indicators across all centers"
        breadcrumbs={[{ label: 'Inventory Overview' }]}
      />

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: '#ffffff' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search inventory by part name, SKU, or supplier..."
        />
      </div>

      <DataTable columns={columns} data={filtered} pageSize={10} />
    </div>
  );
};

