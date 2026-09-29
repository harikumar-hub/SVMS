import React, { useState } from 'react';
import { Car, Search, Shield, Award, Calendar, Fuel } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { formatDate } from '../../utils/formatters';

export const AdminVehicles = () => {
  const { vehicles } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = vehicles.filter((v) =>
    v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.ownerName && v.ownerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    {
      header: 'Registration Plate',
      accessor: 'registrationNumber',
      render: (row) => (
        <span style={{ fontWeight: 800, fontFamily: 'monospace', backgroundColor: 'var(--bg-subtle)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
          {row.registrationNumber}
        </span>
      )
    },
    {
      header: 'Vehicle Model & Make',
      accessor: 'brand',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700 }}>{row.brand} {row.model}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.manufacturingYear} &bull; {row.vehicleType}</div>
        </div>
      )
    },
    {
      header: 'Fuel & Mileage',
      accessor: 'fuelType',
      render: (row) => (
        <div>
          <div>{row.fuelType}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.mileage}</div>
        </div>
      )
    },
    {
      header: 'Registered Owner',
      accessor: 'ownerName',
      render: (row) => row.ownerName || 'Customer'
    },
    {
      header: 'Last Service',
      accessor: 'lastServiceDate',
      render: (row) => formatDate(row.lastServiceDate)
    },
    {
      header: 'Insurance Expiry',
      accessor: 'insuranceExpiry',
      render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--accent-green)' }}>
          {formatDate(row.insuranceExpiry)}
        </span>
      )
    },
    {
      header: 'PUC Expiry',
      accessor: 'pucExpiry',
      render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--warning-text)' }}>
          {formatDate(row.pucExpiry)}
        </span>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Global Vehicles Registry"
        subtitle="Master registry of all customer vehicles, compliance records, and service tracking"
        breadcrumbs={[{ label: 'Vehicles Registry' }]}
      />

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: '#ffffff' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search vehicles by registration number, brand, model, or owner..."
        />
      </div>

      <DataTable columns={columns} data={filtered} pageSize={10} />
    </div>
  );
};
