import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Shield,
  Award,
  Fuel,
  Gauge,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader } from '../../components/common/PageHeader';
import { AddEditVehicleModal } from './AddEditVehicleModal';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';

export const MyVehicles = () => {
  const { currentUser } = useAuth();
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useData();
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deletingVehicleId, setDeletingVehicleId] = useState(null);
  const [feedback, setFeedback] = useState('');

  const myVehicles = vehicles.filter((v) => v.ownerId === currentUser?.id || !v.ownerId);

  const handleSaveVehicle = (vehicleData) => {
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, vehicleData);
      setFeedback('Vehicle information updated successfully.');
    } else {
      addVehicle(vehicleData);
      setFeedback('New vehicle added to your digital garage.');
    }
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleConfirmDelete = () => {
    if (deletingVehicleId) {
      deleteVehicle(deletingVehicleId);
      setDeletingVehicleId(null);
      setFeedback('Vehicle removed from garage.');
      setTimeout(() => setFeedback(''), 4000);
    }
  };

  return (
    <div>
      <PageHeader
        title="My Digital Garage"
        subtitle="Manage your registered vehicles, monitor compliance dates, and schedule maintenance"
        breadcrumbs={[{ label: 'My Vehicles' }]}
        actions={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setEditingVehicle(null);
              setIsAddModalOpen(true);
            }}
          >
            Add New Vehicle
          </Button>
        }
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

      {myVehicles.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {myVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="card card-hover"
              style={{
                backgroundColor: '#ffffff',
                padding: '0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* Image & Plate Bar */}
              <div style={{ position: 'relative', height: '180px' }}>
                <img
                  src={vehicle.image}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  {vehicle.registrationNumber}
                </div>

                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)'
                  }}
                >
                  {vehicle.manufacturingYear} &bull; {vehicle.vehicleType}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px'
                    }}
                  >
                    {vehicle.fuelType}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '0.75rem',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Gauge size={15} style={{ color: 'var(--text-muted)' }} />
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Odometer</div>
                      <strong>{vehicle.mileage}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Last Service</div>
                      <strong>{formatDate(vehicle.lastServiceDate)}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Shield size={15} style={{ color: 'var(--accent-green)' }} />
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Insurance Till</div>
                      <strong>{formatDate(vehicle.insuranceExpiry)}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Award size={15} style={{ color: 'var(--warning-text)' }} />
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>PUC Expiry</div>
                      <strong>{formatDate(vehicle.pucExpiry)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div
                style={{
                  padding: '0.85rem 1.25rem',
                  borderTop: '1px solid var(--border-subtle)',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => {
                      setEditingVehicle(vehicle);
                      setIsAddModalOpen(true);
                    }}
                    className="btn btn-secondary btn-sm"
                    title="Edit vehicle details"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setDeletingVehicleId(vehicle.id)}
                    className="btn btn-danger btn-sm"
                    title="Delete vehicle"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <Link
                  to={`/customer/book?vehicleId=${vehicle.id}`}
                  className="btn btn-primary btn-sm"
                >
                  Book Service &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Car}
          title="No Vehicles Registered Yet"
          description="Add your first car or motorcycle to schedule service appointments and track maintenance."
          actionLabel="Register Vehicle"
          actionIcon={Plus}
          onAction={() => {
            setEditingVehicle(null);
            setIsAddModalOpen(true);
          }}
        />
      )}

      {/* Add / Edit Modal */}
      <AddEditVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingVehicle(null);
        }}
        onSave={handleSaveVehicle}
        initialData={editingVehicle}
        ownerId={currentUser?.id}
        ownerName={currentUser?.name}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deletingVehicleId}
        onClose={() => setDeletingVehicleId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle"
        message="Are you sure you want to remove this vehicle from your digital garage? Associated historical records will remain intact."
        confirmText="Remove Vehicle"
      />
    </div>
  );
};
