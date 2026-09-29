import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Car,
  Building,
  Wrench,
  FileText,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  MapPin,
  Phone,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { SERVICE_TYPES } from '../../data';
import { PageHeader } from '../../components/common/PageHeader';
import { FormInput } from '../../components/common/FormInput';
import { SelectInput } from '../../components/common/SelectInput';
import { Button } from '../../components/common/Button';
import { AddEditVehicleModal } from './AddEditVehicleModal';

export const BookService = () => {
  const { currentUser } = useAuth();
  const { vehicles, providers, bookAppointment, addVehicle } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const myVehicles = vehicles.filter((v) => v.ownerId === currentUser?.id || !v.ownerId);
  const nexaCareCenter = providers[0] || {
    id: 'usr-prov-1',
    name: 'NexaCare Service Center',
    address: '142, Avinashi Road, Peelamedu, Coimbatore',
    phone: '+91 98432 55678',
    rating: 4.9
  };

  const [vehicleId, setVehicleId] = useState(searchParams.get('vehicleId') || (myVehicles[0]?.id || ''));
  const [serviceType, setServiceType] = useState('General Service');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');
  const [problemDescription, setProblemDescription] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('vehicleId')) setVehicleId(searchParams.get('vehicleId'));
  }, [searchParams]);

  const selectedVehicle = vehicles.find((v) => v.id === vehicleId);

  const estimatedPrices = {
    'General Service': '₹1,800',
    'Oil Change': '₹750',
    'Brake Service': '₹1,450',
    'Engine Service': '₹2,200',
    'Battery Service': '₹900',
    'AC Service': '₹1,100',
    'Tyre Service': '₹600',
    'Periodic Maintenance': '₹1,600',
    'Other': 'Custom Quote'
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');

    if (!vehicleId) {
      setError('Please select or add a vehicle.');
      return;
    }
    if (!serviceType) {
      setError('Please select a service package.');
      return;
    }
    if (!scheduledDate || !scheduledTime) {
      setError('Please choose a date and time slot.');
      return;
    }
    if (!problemDescription.trim()) {
      setError('Please describe your vehicle problem or maintenance requirements.');
      return;
    }

    setLoading(true);

    try {
      const newApt = await bookAppointment({
        customerId: currentUser?.id,
        customerName: currentUser?.name || 'Customer',
        customerPhone: currentUser?.phone || '',
        vehicleId: selectedVehicle?.id,
        vehicleName: `${selectedVehicle?.brand} ${selectedVehicle?.model} (${selectedVehicle?.registrationNumber})`,
        registrationNumber: selectedVehicle?.registrationNumber,
        providerId: nexaCareCenter.id,
        providerName: nexaCareCenter.name,
        technicianId: null,
        technicianName: null,
        serviceType: serviceType,
        scheduledDate: scheduledDate,
        scheduledTime: scheduledTime,
        problemDescription: problemDescription,
        additionalNotes: additionalNotes,
        estimatedCost: estimatedPrices[serviceType] || '₹1,500'
      });

      setLoading(false);
      navigate(`/customer/appointments/${newApt.id}?booked=true`);
    } catch (err) {
      setLoading(false);
      setError('Failed to create appointment. Please try again.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Book Service at NexaCare"
        subtitle="Schedule a vehicle maintenance or repair appointment at NexaCare Service Center"
        breadcrumbs={[
          { label: 'Appointments', link: '/customer/appointments' },
          { label: 'Book Service' }
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Form Card */}
        <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.5rem', flex: '1 1 500px' }}>
          {/* NexaCare Fixed Service Center Info Banner */}
          <div
            style={{
              backgroundColor: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Building size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                  {nexaCareCenter.name}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={12} style={{ color: 'var(--primary)' }} /> {nexaCareCenter.address}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--primary-border)',
                padding: '0.25rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <ShieldCheck size={13} style={{ color: 'var(--accent-green)' }} /> Authorized Service Center
            </div>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger-text)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginBottom: '1rem'
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleBook}>
            {/* 1. Vehicle Selection */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  <Car size={15} /> Select Vehicle <span className="required">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddVehicleOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  + Add New Vehicle
                </button>
              </div>

              {myVehicles.length > 0 ? (
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="form-control"
                  required
                >
                  <option value="">Select your vehicle...</option>
                  {myVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} ({v.registrationNumber}) - {v.fuelType}
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--warning-light)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--warning-text)' }}>
                  No vehicles registered yet.{' '}
                  <button
                    type="button"
                    onClick={() => setIsAddVehicleOpen(true)}
                    style={{ fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                  >
                    Click here to add one
                  </button>
                </div>
              )}
            </div>

            {/* 2. Service Type Selection */}
            <SelectInput
              label="Service Package Type"
              icon={Wrench}
              name="serviceType"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              required
              options={SERVICE_TYPES}
            />

            {/* 3. Date & Time Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <FormInput
                label="Appointment Date"
                icon={Calendar}
                name="scheduledDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />

              <SelectInput
                label="Preferred Time Slot"
                icon={Clock}
                name="scheduledTime"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
                options={[
                  '09:00 AM',
                  '10:00 AM',
                  '11:30 AM',
                  '02:00 PM',
                  '03:30 PM',
                  '05:00 PM'
                ]}
              />
            </div>

            {/* 4. Problem Description & Notes */}
            <FormInput
              label="Problem Description / Complaints"
              name="problemDescription"
              type="textarea"
              rows={3}
              icon={FileText}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="e.g. Brake noise while reversing, routine 10,000 km engine oil and filter replacement..."
              required
            />

            <FormInput
              label="Additional Notes (Optional)"
              name="additionalNotes"
              type="textarea"
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. Please also check tyre pressure and battery charge voltage."
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              Confirm & Book Service at NexaCare &rarr;
            </Button>
          </form>
        </div>

        {/* Summary Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              Booking Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Service Package:</span>
                <strong style={{ color: 'var(--primary)' }}>{serviceType}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Vehicle:</span>
                <strong>
                  {selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : 'Not selected'}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Service Center:</span>
                <strong>{nexaCareCenter.name}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Date & Slot:</span>
                <strong>{scheduledDate} ({scheduledTime})</strong>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.95rem',
                  fontWeight: 800
                }}
              >
                <span>Estimated Cost:</span>
                <span style={{ color: 'var(--accent-green)' }}>
                  {estimatedPrices[serviceType] || '₹1,500'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      <AddEditVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        onSave={(data) => {
          const created = addVehicle(data);
          setVehicleId(created.id);
        }}
        ownerId={currentUser?.id}
        ownerName={currentUser?.name}
      />
    </div>
  );
};
