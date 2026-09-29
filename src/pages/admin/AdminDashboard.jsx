import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  User,
  Car,
  Building,
  HardHat,
  Activity,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Boxes,
  RotateCcw
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DashboardCard } from '../../components/common/DashboardCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';

export const AdminDashboard = () => {
  const { users = [], vehicles = [], providers = [], technicians = [], appointments = [], spareParts = [], resetToMockData } = useData();
  const navigate = useNavigate();

  const staffCount = users.filter((u) => ['TECHNICIAN', 'SERVICE_PROVIDER', 'INVENTORY_MANAGER'].includes(u.role)).length;
  const customersCount = users.filter((u) => u.role === 'CUSTOMER').length;
  const activeServicesCount = appointments.filter(
    (a) => !['COMPLETED', 'VEHICLE_READY', 'REJECTED', 'CANCELLED'].includes(a.status)
  ).length;
  const completedServicesCount = appointments.filter((a) => a.status === 'COMPLETED' || a.status === 'VEHICLE_READY').length;
  const pendingAppointmentsCount = appointments.filter((a) => a.status === 'PENDING').length;
  const lowStockCount = spareParts.filter((p) => p.availableQuantity <= p.minimumStock).length;

  return (
    <div>
      <PageHeader
        title="Admin Master Dashboard"
        subtitle="Central platform overview of users, vehicles, workshop operations, and inventory"
        breadcrumbs={[{ label: 'Admin Dashboard' }]}
        actions={
          <Link to="/admin/users" className="btn btn-primary">
            <Users size={16} /> User & Staff Management
          </Link>
        }
      />

      {/* 9 Clean Summary Cards */}
      <div className="grid-3" style={{ marginBottom: '1rem' }}>
        <DashboardCard
          title="Total Users"
          value={users.length}
          subtitle="All registered accounts"
          icon={Users}
          color="primary"
          onClick={() => navigate('/admin/users')}
        />
        <DashboardCard
          title="Total Customers"
          value={customersCount}
          subtitle="Vehicle owner profiles"
          icon={User}
          color="primary"
          onClick={() => navigate('/admin/customers')}
        />
        <DashboardCard
          title="Total Vehicles"
          value={vehicles.length}
          subtitle="Registered cars & bikes"
          icon={Car}
          color="info"
          onClick={() => navigate('/admin/vehicles')}
        />
      </div>

      <div className="grid-3" style={{ marginBottom: '1rem' }}>
        <DashboardCard
          title="Service Providers"
          value={providers.length}
          subtitle="Registered workshops"
          icon={Building}
          color="success"
          onClick={() => navigate('/admin/providers')}
        />
        <DashboardCard
          title="Technicians"
          value={technicians.length}
          subtitle="Certified mechanics"
          icon={HardHat}
          color="purple"
          onClick={() => navigate('/admin/technicians')}
        />
        <DashboardCard
          title="Active Services"
          value={activeServicesCount}
          subtitle="Currently on floor"
          icon={Activity}
          color="warning"
          onClick={() => navigate('/admin/services')}
        />
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <DashboardCard
          title="Completed Services"
          value={completedServicesCount}
          subtitle="Finished job cards"
          icon={CheckCircle2}
          color="success"
          onClick={() => navigate('/admin/reports')}
        />
        <DashboardCard
          title="Pending Appointments"
          value={pendingAppointmentsCount}
          subtitle="Awaiting workshop action"
          icon={Calendar}
          color="warning"
          onClick={() => navigate('/admin/appointments')}
        />
        <DashboardCard
          title="Low Stock Items"
          value={lowStockCount}
          subtitle="Items below threshold"
          icon={AlertTriangle}
          color="danger"
          onClick={() => navigate('/admin/inventory')}
        />
      </div>

      {/* Two Column Grid: Appointments Table & Users Quick View */}
      <div className="grid-2">
        {/* Appointments Table */}
        <div className="card" style={{ backgroundColor: '#ffffff' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Calendar size={18} style={{ color: 'var(--primary)' }} /> Recent Appointments
              </h3>
              <p className="card-subtitle">Latest platform service bookings</p>
            </div>
            <Link to="/admin/appointments" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {appointments.slice(0, 4).map((apt) => (
              <div
                key={apt.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  fontSize: '0.825rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{apt.vehicleName}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    Customer: {apt.customerName} &bull; Workshop: {apt.providerName}
                  </div>
                </div>
                <StatusBadge status={apt.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Users Quick List */}
        <div className="card" style={{ backgroundColor: '#ffffff' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Users size={18} style={{ color: 'var(--primary)' }} /> Registered Platform Users
              </h3>
              <p className="card-subtitle">Active user profiles across roles</p>
            </div>
            <Link to="/admin/users" className="btn btn-secondary btn-sm">
              Manage Users
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {users.slice(0, 4).map((u) => (
              <div
                key={u.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  fontSize: '0.825rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{u.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {u.email} &bull; {u.city || 'Coimbatore'}
                  </div>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                  {u.role.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
