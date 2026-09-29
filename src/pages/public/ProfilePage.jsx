import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Shield, Calendar, Edit3, CheckCircle2, Building, Wrench, Clock, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/common/FormInput';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';

export const ProfilePage = () => {
  const { currentUser, role, updateProfile } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [editData, setEditData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || 'Coimbatore',
    specialty: currentUser?.specialty || '',
    avatar: currentUser?.avatar || ''
  });

  const handleOpenEdit = () => {
    setEditData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || '',
      city: currentUser?.city || 'Coimbatore',
      specialty: currentUser?.specialty || '',
      avatar: currentUser?.avatar || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(editData);
    setIsEditModalOpen(false);
    setSuccessMessage('Profile details updated successfully.');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal account details and contact information"
        breadcrumbs={[{ label: 'Profile' }]}
        actions={
          <Button variant="primary" icon={Edit3} onClick={handleOpenEdit}>
            Edit Profile
          </Button>
        }
      />

      {successMessage && (
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
          <span>{successMessage}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Profile Card */}
        <div className="card" style={{ backgroundColor: '#ffffff', padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '1.75rem' }}>
            {/* Clean Initials Avatar Badge */}
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '20px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                border: '2px solid var(--primary-border)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.85rem',
                fontWeight: 800,
                marginBottom: '1rem'
              }}
            >
              {currentUser?.name
                ? currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'U'}
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {currentUser?.name || 'User'}
            </h2>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginTop: '0.4rem',
                textTransform: 'uppercase'
              }}
            >
              <Shield size={13} /> {role?.replace('_', ' ')}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={18} style={{ color: 'var(--text-muted)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {currentUser?.email}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone size={18} style={{ color: 'var(--text-muted)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone Contact</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {currentUser?.phone || 'Not provided'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin size={18} style={{ color: 'var(--text-muted)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Address & City</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {currentUser?.address || currentUser?.city || 'Coimbatore'}
                </div>
              </div>
            </div>

            {currentUser?.specialty && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Wrench size={18} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Specialization</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {currentUser.specialty}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Details Card */}
        <div className="card" style={{ backgroundColor: '#ffffff', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Account Information
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Account Status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--accent-green)', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} /> {currentUser?.status || 'ACTIVE'}
              </div>
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Designated Role</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                {role?.replace('_', ' ')}
              </div>
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Member Since</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
                {formatDate(currentUser?.created_at || currentUser?.joinedDate || new Date())}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile Information"
        subtitle="Update your contact information and display details"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <FormInput
            label="Full Name"
            name="name"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            required
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={editData.email}
            disabled
          />

          <FormInput
            label="Phone Number"
            name="phone"
            type="tel"
            value={editData.phone}
            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <FormInput
              label="Address"
              name="address"
              value={editData.address}
              onChange={(e) => setEditData({ ...editData, address: e.target.value })}
              placeholder="Street name / Area"
            />
            <FormInput
              label="City"
              name="city"
              value={editData.city}
              onChange={(e) => setEditData({ ...editData, city: e.target.value })}
              placeholder="City"
            />
          </div>

          {role === 'TECHNICIAN' && (
            <FormInput
              label="Technical Specialization"
              name="specialty"
              value={editData.specialty}
              onChange={(e) => setEditData({ ...editData, specialty: e.target.value })}
            />
          )}
        </form>
      </Modal>
    </div>
  );
};
