import React, { useState, useEffect } from 'react';
import { Car, Calendar, Shield, Award, Fuel, Gauge, Hash } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/common/FormInput';
import { SelectInput } from '../../components/common/SelectInput';
import { Button } from '../../components/common/Button';

export const AddEditVehicleModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  ownerId,
  ownerName
}) => {
  const [formData, setFormData] = useState({
    registrationNumber: '',
    brand: '',
    model: '',
    vehicleType: 'Sedan',
    manufacturingYear: new Date().getFullYear(),
    fuelType: 'Petrol',
    mileage: '15,000 km',
    lastServiceDate: new Date().toISOString().split('T')[0],
    insuranceExpiry: '2025-12-31',
    pucExpiry: '2025-06-30',
    color: 'Silver',
    image: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        registrationNumber: initialData.registrationNumber || '',
        brand: initialData.brand || '',
        model: initialData.model || '',
        vehicleType: initialData.vehicleType || 'Sedan',
        manufacturingYear: initialData.manufacturingYear || 2022,
        fuelType: initialData.fuelType || 'Petrol',
        mileage: initialData.mileage || '20,000 km',
        lastServiceDate: initialData.lastServiceDate || '',
        insuranceExpiry: initialData.insuranceExpiry || '',
        pucExpiry: initialData.pucExpiry || '',
        color: initialData.color || 'White',
        image: initialData.image || ''
      });
    } else {
      setFormData({
        registrationNumber: '',
        brand: '',
        model: '',
        vehicleType: 'Sedan',
        manufacturingYear: new Date().getFullYear(),
        fuelType: 'Petrol',
        mileage: '15,000 km',
        lastServiceDate: new Date().toISOString().split('T')[0],
        insuranceExpiry: '2025-12-31',
        pucExpiry: '2025-06-30',
        color: 'Silver',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80'
      });
    }
    setError('');
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.registrationNumber || !formData.brand || !formData.model) {
      setError('Please fill in all mandatory vehicle details.');
      return;
    }

    onSave({
      ...formData,
      ownerId: ownerId,
      ownerName: ownerName || 'Customer'
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Vehicle Information' : 'Register New Vehicle'}
      subtitle="Enter all technical, compliance, and registration parameters"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {initialData ? 'Update Vehicle' : 'Save Vehicle to Garage'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger-text)', padding: '0.65rem 1rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <FormInput
            label="Registration Number (Number Plate)"
            name="registrationNumber"
            icon={Hash}
            value={formData.registrationNumber}
            onChange={handleChange}
            placeholder="e.g. TN 38 AB 1234"
            required
          />

          <FormInput
            label="Vehicle Brand / Make"
            name="brand"
            icon={Car}
            value={formData.brand}
            onChange={handleChange}
            placeholder="e.g. Toyota, Honda, Hyundai"
            required
          />

          <FormInput
            label="Model & Variant"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="e.g. Camry Hybrid, Creta SX"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <SelectInput
            label="Vehicle Type"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            options={['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Electric', 'Commercial', 'Luxury', 'Two-Wheeler']}
            required
          />

          <SelectInput
            label="Fuel Type"
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            options={['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG', 'LPG']}
            required
          />

          <FormInput
            label="Manufacturing Year"
            name="manufacturingYear"
            type="number"
            min="1990"
            max="2030"
            value={formData.manufacturingYear}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <FormInput
            label="Current Odometer Mileage"
            name="mileage"
            icon={Gauge}
            value={formData.mileage}
            onChange={handleChange}
            placeholder="e.g. 28,450 km"
            required
          />

          <FormInput
            label="Last Service Date"
            name="lastServiceDate"
            type="date"
            icon={Calendar}
            value={formData.lastServiceDate}
            onChange={handleChange}
          />

          <FormInput
            label="Body Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="e.g. Pearl White"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormInput
            label="Insurance Expiry Date"
            name="insuranceExpiry"
            type="date"
            icon={Shield}
            value={formData.insuranceExpiry}
            onChange={handleChange}
            required
          />

          <FormInput
            label="PUC / Emission Expiry Date"
            name="pucExpiry"
            type="date"
            icon={Award}
            value={formData.pucExpiry}
            onChange={handleChange}
            required
          />
        </div>

        <FormInput
          label="Vehicle Photo URL (Optional)"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://images.unsplash.com/..."
        />
      </form>
    </Modal>
  );
};
