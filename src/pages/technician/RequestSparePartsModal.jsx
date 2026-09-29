import React, { useState } from 'react';
import { Boxes, Plus, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/common/FormInput';
import { SelectInput } from '../../components/common/SelectInput';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';

export const RequestSparePartsModal = ({
  isOpen,
  onClose,
  appointmentId = '',
  vehicleInfo = '',
  technicianId = 'usr-tech-1',
  technicianName = 'Vignesh Kumar'
}) => {
  const { spareParts, createPartsRequest, appointments } = useData();

  const [selectedPartId, setSelectedPartId] = useState(spareParts[0]?.id || '');
  const [selectedAptId, setSelectedAptId] = useState(appointmentId || appointments[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [urgency, setUrgency] = useState('HIGH');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const selectedPart = spareParts.find((p) => p.id === selectedPartId);
  const targetApt = appointments.find((a) => a.id === selectedAptId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPartId) {
      setError('Please select a spare part.');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason / diagnostic justification for this part.');
      return;
    }

    createPartsRequest({
      appointmentId: selectedAptId,
      technicianId: technicianId,
      technicianName: technicianName,
      providerId: targetApt?.providerId || 'usr-prov-1',
      partId: selectedPart?.id,
      partName: selectedPart?.partName,
      partNumber: selectedPart?.partNumber,
      requestedQuantity: Number(quantity),
      vehicleInfo: vehicleInfo || targetApt?.vehicleName || 'Vehicle in Bay',
      urgency: urgency,
      reason: reason,
      notes: notes
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Requisition Spare Part"
      subtitle="Submit an OEM spare parts request to the inventory manager"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit Requisition
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

        <SelectInput
          label="Select Target Service Job"
          name="selectedAptId"
          value={selectedAptId}
          onChange={(e) => setSelectedAptId(e.target.value)}
          required
          options={appointments
            .filter((a) => !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(a.status))
            .map((a) => ({
              value: a.id,
              label: `#${a.id} - ${a.vehicleName} (${a.serviceType})`
            }))}
        />

        <SelectInput
          label="Select Spare Part from Catalog"
          icon={Boxes}
          name="selectedPartId"
          value={selectedPartId}
          onChange={(e) => setSelectedPartId(e.target.value)}
          required
          options={spareParts.map((p) => ({
            value: p.id,
            label: `${p.partName} [${p.partNumber}] - In Stock: ${p.availableQuantity} units`
          }))}
        />

        {selectedPart && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-subtle)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              fontSize: '0.825rem'
            }}
          >
            <div><strong>Location:</strong> {selectedPart.location || 'Shelf A-01'}</div>
            <div>
              <strong>Available:</strong>{' '}
              <span style={{ color: selectedPart.availableQuantity <= selectedPart.minimumStock ? 'var(--danger-text)' : 'var(--accent-green)', fontWeight: 700 }}>
                {selectedPart.availableQuantity} units
              </span>
            </div>
            <div><strong>Price:</strong> {formatCurrency(selectedPart.unitPrice)}</div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormInput
            label="Requested Quantity"
            name="quantity"
            type="number"
            min="1"
            max={selectedPart?.availableQuantity || 10}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          <SelectInput
            label="Urgency Level"
            name="urgency"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            options={['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']}
            required
          />
        </div>

        <FormInput
          label="Reason / Diagnostic Justification"
          name="reason"
          type="textarea"
          rows={2}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Front brake pads worn down below 2mm safety threshold."
          required
        />

        <FormInput
          label="Bay Location / Mechanic Notes (Optional)"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Vehicle currently on Lift #2."
        />
      </form>
    </Modal>
  );
};
