import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  Calendar,
  Clock,
  Wrench,
  Plus,
  Building,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DashboardCard } from '../../components/common/DashboardCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';

export const CustomerDashboard = () => {
  const { currentUser } = useAuth();
  const { vehicles, appointments, reminders } = useData();
  const navigate = useNavigate();

  const myVehicles = vehicles.filter((v) => v.ownerId === currentUser?.id || !v.ownerId);
  const myAppointments = appointments.filter((a) => a.customerId === currentUser?.id || a.customerName === currentUser?.name);
  const myReminders = reminders.filter((r) => r.userId === currentUser?.id || !r.userId);

  const activeServices = myAppointments.filter(
    (a) => !['COMPLETED', 'VEHICLE_READY', 'REJECTED', 'CANCELLED'].includes(a.status)
  );
  const completedServices = myAppointments.filter(
    (a) => a.status === 'COMPLETED' || a.status === 'VEHICLE_READY'
  );

  return (
    <div>
      <PageHeader
        title={`Welcome, ${currentUser?.name || 'Customer'}`}
        subtitle="NexaCare Customer Portal • Manage vehicles, track ongoing services, and schedule maintenance"
        actions={
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link to="/customer/book" className="btn btn-primary">
              <Plus size={16} /> Book Service
            </Link>
            <Link to="/customer/providers" className="btn btn-secondary">
              <Building size={16} /> Service Center
            </Link>
          </div>
        }
      />

      {/* 4 Clean Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <DashboardCard
          title="My Vehicles"
          value={myVehicles.length}
          subtitle="Registered cars & bikes"
          icon={Car}
          color="primary"
          onClick={() => navigate('/customer/vehicles')}
        />
        <DashboardCard
          title="Active Services"
          value={activeServices.length}
          subtitle="Currently at NexaCare"
          icon={Activity}
          color="warning"
          onClick={() => navigate('/customer/tracking')}
        />
        <DashboardCard
          title="Completed Services"
          value={completedServices.length}
          subtitle="Past service history"
          icon={CheckCircle2}
          color="success"
          onClick={() => navigate('/customer/history')}
        />
        <DashboardCard
          title="Reminders"
          value={myReminders.length}
          subtitle="PUC & service due"
          icon={Clock}
          color="purple"
          onClick={() => navigate('/customer/reminders')}
        />
      </div>

      {/* Active Service Highlight Card if any */}
      {activeServices.length > 0 && (
        <div
          className="card"
          style={{
            marginBottom: '1.5rem',
            borderLeft: '4px solid var(--primary)',
            backgroundColor: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  Ongoing Service
                </span>
                <StatusBadge status={activeServices[0].status} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {activeServices[0].vehicleName} &bull; {activeServices[0].serviceType}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Service Center: <strong>{activeServices[0].providerName || 'NexaCare Service Center'}</strong> &bull; Scheduled: {formatDate(activeServices[0].scheduledDate)} ({activeServices[0].scheduledTime})
              </p>
            </div>

            <Link
              to={`/customer/appointments/${activeServices[0].id}`}
              className="btn btn-primary btn-sm"
            >
              Track Progress &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Two Column Grid: Appointments Table & Vehicle List */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Appointments Table */}
        <div className="card" style={{ backgroundColor: '#ffffff' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Calendar size={18} style={{ color: 'var(--primary)' }} /> Recent Appointments
              </h3>
              <p className="card-subtitle">Upcoming and latest bookings at NexaCare</p>
            </div>
            <Link to="/customer/appointments" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>

          {myAppointments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {myAppointments.slice(0, 3).map((apt) => (
                <div
                  key={apt.id}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{apt.vehicleName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {apt.serviceType} &bull; {formatDate(apt.scheduledDate)}
                    </div>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No appointments booked yet.
            </div>
          )}
        </div>

        {/* My Garage */}
        <div className="card" style={{ backgroundColor: '#ffffff' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Car size={18} style={{ color: 'var(--primary)' }} /> My Garage
              </h3>
              <p className="card-subtitle">Registered vehicles</p>
            </div>
            <Link to="/customer/vehicles" className="btn btn-secondary btn-sm">
              Manage
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {myVehicles.slice(0, 2).map((v) => (
              <div
                key={v.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)'
                }}
              >
                <img
                  src={v.image}
                  alt={v.model}
                  style={{ width: '56px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.88rem' }}>{v.brand} {v.model}</strong>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: 'var(--bg-subtle)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      {v.registrationNumber}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {v.fuelType} &bull; {v.mileage} &bull; Last: {formatDate(v.lastServiceDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <Link to="/customer/book" style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary)' }}>
              + Book Service at NexaCare &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
