import React, { useState } from 'react';
import { Activity, Search, Car, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchBar } from '../../components/common/SearchBar';
import { ServiceTimeline } from '../../components/common/ServiceTimeline';
import { formatCurrency } from '../../utils/formatters';

export const AdminServices = () => {
  const { appointments } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const activeServices = appointments.filter(
    (a) => !['COMPLETED', 'VEHICLE_READY', 'REJECTED', 'CANCELLED'].includes(a.status)
  );

  const filtered = activeServices.filter((s) =>
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Live Workshop Services Monitor"
        subtitle="Real-time multi-center oversight of vehicles currently in diagnostics, bay repair, or quality testing"
        breadcrumbs={[{ label: 'Services Monitor' }]}
      />

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: '#ffffff' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search active services by Job ID, vehicle, workshop, or customer..."
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filtered.map((service) => (
          <div
            key={service.id}
            className="card"
            style={{
              backgroundColor: '#ffffff',
              borderLeft: '5px solid var(--primary)',
              padding: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>
                    #{service.id}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{service.vehicleName}</h3>
                  <StatusBadge status={service.status} />
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Customer: <strong>{service.customerName}</strong> &bull; Workshop: <strong>{service.providerName}</strong> &bull; Tech: <strong>{service.technicianName || 'Assigning...'}</strong>
                </div>
              </div>

              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-green)' }}>
                {formatCurrency(service.estimatedCost)}
              </div>
            </div>

            <ServiceTimeline currentStatus={service.status} />
          </div>
        ))}
      </div>
    </div>
  );
};
