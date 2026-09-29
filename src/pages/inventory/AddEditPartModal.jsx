import React, { useState, useEffect } from 'react';
import { Boxes, Tag, Hash, DollarSign, Truck, MapPin } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/common/FormInput';
import { SelectInput } from '../../components/common/SelectInput';
import { Button } from '../../components/common/Button';

export const AddEditPartModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    partName: '',
    partNumber: '',
    category: 'Fluids & Lubricants',
    availableQuantity: 10,
    minimumStock: 5,
    unitPrice: 850,
    supplier: 'Bosch Automotive India',
    location: 'Shelf A-01',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=80'
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        partName: initialData.partName || '',
        partNumber: initialData.partNumber || '',
        category: initialData.category || 'Fluids & Lubricants',
        availableQuantity: initialData.availableQuantity ?? 10,
        minimumStock: initialData.minimumStock ?? 5,
        unitPrice: initialData.unitPrice ?? 850,
        supplier: initialData.supplier || 'Bosch Automotive India',
        location: initialData.location || 'Shelf A-01',
        image: initialData.image || ''
      });
    } else {
      setFormData({
        partName: '',
        partNumber: '',
        category: 'Fluids & Lubricants',
        availableQuantity: 10,
        minimumStock: 5,
        unitPrice: 850,
        supplier: 'Bosch Automotive India',
        location: 'Shelf A-01',
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=80'
      });
    }
    setError('');
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.partName || !formData.partNumber) {
      setError('Please fill in Part Name and Part Number.');
      return;
    }

    onSave({
      ...formData,
      availableQuantity: Number(formData.availableQuantity),
      minimumStock: Number(formData.minimumStock),
      unitPrice: Number(formData.unitPrice)
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Spare Part Details' : 'Add New Spare Part'}
      subtitle="Configure inventory catalog, minimum thresholds, and supplier info"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {initialData ? 'Save Changes' : 'Add to Inventory'}
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

        <FormInput
          label="Part Name"
          name="partName"
          icon={Boxes}
          value={formData.partName}
          onChange={handleChange}
          placeholder="e.g. Ceramic Front Brake Pads Set"
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormInput
            label="Part Number / SKU"
            name="partNumber"
            icon={Hash}
            value={formData.partNumber}
            onChange={handleChange}
            placeholder="e.g. BRK-PAD-CR88"
            required
          />

          <SelectInput
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            options={[
              'Fluids & Lubricants',
              'Braking System',
              'Filters',
              'Ignition & Electrical',
              'Electrical & Battery',
              'AC & Climate',
              'Suspension & Steering',
              'Tyres & Wheels',
              'Body & Accessories'
            ]}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <FormInput
            label="Available Qty"
            name="availableQuantity"
            type="number"
            min="0"
            value={formData.availableQuantity}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Min Stock Alert"
            name="minimumStock"
            type="number"
            min="1"
            value={formData.minimumStock}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Unit Price (₹)"
            name="unitPrice"
            type="number"
            step="1"
            min="0"
            value={formData.unitPrice}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormInput
            label="Supplier"
            name="supplier"
            icon={Truck}
            value={formData.supplier}
            onChange={handleChange}
            placeholder="e.g. Brembo Brakes India Ltd."
            required
          />

          <FormInput
            label="Warehouse Shelf Location"
            name="location"
            icon={MapPin}
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Shelf B-05"
          />
        </div>

        <FormInput
          label="Part Image URL (Optional)"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://images.unsplash.com/..."
        />
      </form>
    </Modal>
  );
};
