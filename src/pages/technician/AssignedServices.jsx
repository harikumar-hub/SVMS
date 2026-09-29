import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Search, ShieldCheck, Play, Boxes, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';

export const AssignedServices = () => {
  const { currentUser } = useAuth();
  const { appointments, updateAppointmentStatus } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const myAssignedJobs = appointments.filter(
    (a) =>
      (a.technicianId === currentUser?.id || a.technicianName?.includes('Vignesh') || !a.technicianId) &&
      !['COMPLETED', 'VEHICLE_READY', 'CANCELLED', 'REJECTED'].includes(a.status)
  );

  const filtered = myAssignedJobs.filter((j) =>
    j.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdvance = (job) => {
    const workflow = [
      'TECHNICIAN_ASSIGNED',
      'VEHICLE_RECEIVED',
      'INSPECTION',
      'IN_PROGRESS',
      'QUALITY_CHECK',
      'COMPLETED'
    ];
    const currentIndex = workflow.indexOf(job.status);
    if (currentIndex >= 0 && currentIndex < workflow.length - 1) {
      updateAppointmentStatus(job.id, workflow[currentIndex + 1]);
    }
  };

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
      header: 'Vehicle & Plate',
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
      header: 'Customer',
      accessor: 'customerName',
      render: (row) => row.customerName
    },
    {
      header: 'Scheduled Slot',
      accessor: 'scheduledDate',
      render: (row) => (
        <div>
          <div>{formatDate(row.scheduledDate)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.scheduledTime}</div>
        </div>
      )
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
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
          <Link
            to={`/technician/service/${row.id}`}
            className="btn btn-secondary btn-sm"
          >
            <ShieldCheck size={14} /> Inspection & Work Log
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleAdvance(row)}
          >
            Next Stage &rarr;
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Assigned Technical Services Queue"
        subtitle="Manage assigned vehicle diagnostics, parts requirements, and repair progression"
        breadcrumbs={[{ label: 'Assigned Services' }]}
      />

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: '#ffffff' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search assigned jobs by ID, vehicle model, customer, or service..."
        />
      </div>

      <DataTable columns={columns} data={filtered} pageSize={8} />
    </div>
  );
};
