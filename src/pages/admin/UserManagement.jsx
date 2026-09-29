import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  User,
  Plus,
  Search,
  Shield,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Award,
  Check,
  X,
  UserPlus,
  Building,
  Wrench,
  Boxes
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/common/FormInput';
import { SelectInput } from '../../components/common/SelectInput';
import { formatDate } from '../../utils/formatters';

export const UserManagement = ({ initialRoleFilter = '' }) => {
  const [searchParams] = useSearchParams();
  const { users = [], updateUserStatus, createStaffMember, addUser } = useData();
  const { createStaffAccountByAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState(initialRoleFilter);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialRoleFilter) {
      setRoleFilter(initialRoleFilter);
    }
  }, [initialRoleFilter]);

  // Form State for Admin adding a Staff Member
  const [staffFormData, setStaffFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'TECHNICIAN',
    specialty: 'Engine Diagnostics & Multi-Point Inspection',
    password: 'Password@123',
    experienceYears: 3,
    certifications: 'NexaCare Certified Automotive Specialist'
  });

  // Form State for Admin adding a Customer
  const [customerFormData, setCustomerFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
    address: '',
    city: 'Coimbatore'
  });

  const staffCount = users.filter((u) => ['TECHNICIAN', 'SERVICE_PROVIDER', 'INVENTORY_MANAGER'].includes(u.role)).length;
  const customerCount = users.filter((u) => u.role === 'CUSTOMER').length;

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery)) ||
      u.role?.toLowerCase().includes(searchQuery.toLowerCase());

    if (roleFilter === 'STAFF') {
      return matchesSearch && ['TECHNICIAN', 'SERVICE_PROVIDER', 'INVENTORY_MANAGER'].includes(u.role);
    }

    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Handle Admin creating a Staff Member
  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!staffFormData.name || !staffFormData.email) return;

    setLoading(true);

    try {
      const res = await createStaffAccountByAdmin(staffFormData);
      if (res.success) {
        if (res.user) {
          await createStaffMember({ ...staffFormData, id: res.user.id });
        } else {
          await createStaffMember(staffFormData);
        }
        setIsAddStaffModalOpen(false);
        setFeedback(`Staff member ${staffFormData.name} added successfully as ${staffFormData.role.replace('_', ' ')}! Initial password: ${staffFormData.password}`);
        setStaffFormData({
          name: '',
          email: '',
          phone: '',
          role: 'TECHNICIAN',
          specialty: 'Engine Diagnostics & Multi-Point Inspection',
          password: 'Password@123',
          experienceYears: 3,
          certifications: 'NexaCare Certified Automotive Specialist'
        });
      } else {
        setFeedback(`Error: ${res.message}`);
      }
    } catch (err) {
      console.error(err);
      setFeedback('Failed to create staff account.');
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(''), 8000);
    }
  };

  // Handle Admin creating a Customer
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!customerFormData.name || !customerFormData.email) return;

    await addUser(customerFormData);
    setIsAddCustomerModalOpen(false);
    setFeedback(`Customer account for ${customerFormData.name} created successfully.`);
    setCustomerFormData({
      name: '',
      email: '',
      phone: '',
      role: 'CUSTOMER',
      address: '',
      city: 'Coimbatore'
    });
    setTimeout(() => setFeedback(''), 5000);
  };

  const handleToggleStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    updateUserStatus(userId, newStatus);
    setFeedback(`Account status updated to ${newStatus}.`);
    setTimeout(() => setFeedback(''), 4000);
  };

  const roleBadges = {
    CUSTOMER: { bg: 'var(--primary-light)', color: 'var(--primary)', label: 'Customer' },
    SERVICE_PROVIDER: { bg: 'var(--success-light)', color: 'var(--success-text)', label: 'Service Provider' },
    TECHNICIAN: { bg: '#fff7ed', color: '#9a3412', label: 'Technician' },
    INVENTORY_MANAGER: { bg: '#f5f3ff', color: '#6b21a8', label: 'Inventory Manager' },
    ADMIN: { bg: '#fef2f2', color: '#991b1b', label: 'System Admin' }
  };

  const userColumns = [
    {
      header: 'User & Profile',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: roleBadges[row.role]?.bg || 'var(--bg-subtle)',
              color: roleBadges[row.role]?.color || 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '15px'
            }}
          >
            {row.name ? row.name.charAt(0) : 'U'}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '15px' }}>{row.name}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'System Role',
      accessor: 'role',
      render: (row) => {
        const badge = roleBadges[row.role] || { bg: 'var(--bg-subtle)', color: 'var(--text-primary)', label: row.role };
        return (
          <span
            className="badge"
            style={{
              backgroundColor: badge.bg,
              color: badge.color,
              fontWeight: 600,
              fontSize: '12.5px',
              border: `1px solid ${badge.bg}`
            }}
          >
            {badge.label}
          </span>
        );
      }
    },
    {
      header: 'Phone & City',
      accessor: 'phone',
      render: (row) => (
        <div>
          <div style={{ fontSize: '14.5px', fontWeight: 500 }}>{row.phone || '+91 98432 00000'}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{row.city || 'Coimbatore'}</div>
        </div>
      )
    },
    {
      header: 'Department / Specialty',
      accessor: 'specialty',
      render: (row) => (
        <span style={{ fontSize: '14px', color: row.specialty ? 'var(--text-primary)' : 'var(--text-muted)' }}>
          {row.specialty || (row.role === 'CUSTOMER' ? 'Vehicle Owner' : row.role === 'ADMIN' ? 'Platform Administrator' : 'Workshop General')}
        </span>
      )
    },
    {
      header: 'Account Status',
      accessor: 'status',
      render: (row) => {
        const isActive = row.status === 'ACTIVE' || !row.status;
        return (
          <span
            className="badge"
            style={{
              backgroundColor: isActive ? 'var(--success-light)' : 'var(--danger-light)',
              color: isActive ? 'var(--success-text)' : 'var(--danger-text)',
              border: `1px solid ${isActive ? 'var(--success-border)' : 'var(--danger-border)'}`
            }}
          >
            {isActive ? 'ACTIVE' : 'SUSPENDED'}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => {
        if (row.role === 'ADMIN') {
          return <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Protected</span>;
        }

        const isActive = row.status === 'ACTIVE' || !row.status;
        return (
          <Button
            variant={isActive ? 'danger-light' : 'success'}
            size="sm"
            onClick={() => handleToggleStatus(row.id, row.status || 'ACTIVE')}
          >
            {isActive ? 'Suspend' : 'Activate'}
          </Button>
        );
      }
    }
  ];

  return (
    <div>
      <PageHeader
        title="User & Staff Management"
        subtitle="Provision staff accounts (Technicians, Service Providers, Inventory Managers) and manage customer profiles"
        breadcrumbs={[{ label: 'Staff Management' }]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setIsAddStaffModalOpen(true)}
            >
              Add Staff Member
            </Button>
            <Button
              variant="secondary"
              icon={UserPlus}
              onClick={() => setIsAddCustomerModalOpen(true)}
            >
              Add Customer
            </Button>
          </div>
        }
      />

      {feedback && (
        <div
          style={{
            backgroundColor: feedback.startsWith('Error') ? 'var(--danger-light)' : 'var(--success-light)',
            border: `1px solid ${feedback.startsWith('Error') ? 'var(--danger-border)' : 'var(--success-border)'}`,
            color: feedback.startsWith('Error') ? 'var(--danger-text)' : 'var(--success-text)',
            padding: '0.9rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 600,
            fontSize: '15px'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{feedback}</span>
        </div>
      )}

      {/* Role Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { key: '', label: `All Users (${users.length})` },
          { key: 'STAFF', label: `All Staff (${staffCount})` },
          { key: 'TECHNICIAN', label: 'Technicians' },
          { key: 'SERVICE_PROVIDER', label: 'Service Providers' },
          { key: 'INVENTORY_MANAGER', label: 'Inventory Managers' },
          { key: 'CUSTOMER', label: `Customers (${customerCount})` },
          { key: 'ADMIN', label: 'Administrators (1)' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setRoleFilter(tab.key)}
            className={`btn btn-sm ${roleFilter === tab.key ? 'btn-primary' : 'btn-secondary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: '#ffffff' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search staff and customers by name, email, phone number, or role..."
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="card" style={{ backgroundColor: '#ffffff', padding: '3.5rem', textAlign: 'center' }}>
          <User size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            No {roleFilter ? (roleFilter === 'STAFF' ? 'Staff Members' : roleFilter.replace('_', ' ') + 's') : 'Users'} Found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '0.35rem' }}>
            {roleFilter === 'STAFF' || ['TECHNICIAN', 'SERVICE_PROVIDER', 'INVENTORY_MANAGER'].includes(roleFilter)
              ? 'Click "Add Staff Member" to provision a new technician, service provider, or inventory manager.'
              : 'No users match your filter criteria.'}
          </p>
        </div>
      ) : (
        <DataTable columns={userColumns} data={filteredUsers} pageSize={10} />
      )}

      {/* 1. Dedicated Modal: Admin Adding Staff Member */}
      <Modal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        title="Add New Staff Member"
        subtitle="Provision an authenticated staff account for Technician, Service Provider, or Inventory Manager"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddStaffModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={loading} onClick={handleAddStaff}>
              Create Staff Account
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddStaff}>
          <FormInput
            label="Full Name"
            name="name"
            value={staffFormData.name}
            onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
            placeholder="e.g. Ramesh Kumar"
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormInput
              label="Staff Email Address"
              name="email"
              type="email"
              value={staffFormData.email}
              onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
              placeholder="e.g. ramesh@nexacare.in"
              required
            />

            <FormInput
              label="Phone Number"
              name="phone"
              value={staffFormData.phone}
              onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })}
              placeholder="e.g. +91 98432 12345"
              required
            />
          </div>

          <SelectInput
            label="Staff Role"
            name="role"
            value={staffFormData.role}
            onChange={(e) => {
              const newRole = e.target.value;
              let defaultSpecialty = 'Diagnostics & Multi-Point Inspection';
              if (newRole === 'SERVICE_PROVIDER') defaultSpecialty = 'Workshop Floor Lead & Service Advisor';
              if (newRole === 'INVENTORY_MANAGER') defaultSpecialty = 'Store & OEM Parts Inventory Controller';
              setStaffFormData({ ...staffFormData, role: newRole, specialty: defaultSpecialty });
            }}
            required
            options={[
              { value: 'TECHNICIAN', label: 'Technician (Inspection & Bay Mechanic)' },
              { value: 'SERVICE_PROVIDER', label: 'Service Provider (Workshop Supervisor & Dispatch)' },
              { value: 'INVENTORY_MANAGER', label: 'Inventory Manager (Store & Parts Control)' }
            ]}
          />

          <FormInput
            label="Department / Specialization"
            name="specialty"
            value={staffFormData.specialty}
            onChange={(e) => setStaffFormData({ ...staffFormData, specialty: e.target.value })}
            placeholder="e.g. Engine Diagnostics & Multi-Point Inspection"
          />

          <FormInput
            label="Initial Login Password"
            name="password"
            type="text"
            value={staffFormData.password}
            onChange={(e) => setStaffFormData({ ...staffFormData, password: e.target.value })}
            placeholder="e.g. Password@123"
            required
            hint="Staff member will use this email and password on the main Login page."
          />
        </form>
      </Modal>

      {/* 2. Modal: Admin Adding Customer */}
      <Modal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        title="Add Customer Account"
        subtitle="Manually register a vehicle owner in the platform"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddCustomerModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddCustomer}>
              Create Customer
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddCustomer}>
          <FormInput
            label="Customer Name"
            name="name"
            value={customerFormData.name}
            onChange={(e) => setCustomerFormData({ ...customerFormData, name: e.target.value })}
            placeholder="e.g. Ananya Sharma"
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={customerFormData.email}
              onChange={(e) => setCustomerFormData({ ...customerFormData, email: e.target.value })}
              placeholder="e.g. ananya@gmail.com"
              required
            />

            <FormInput
              label="Phone Number"
              name="phone"
              value={customerFormData.phone}
              onChange={(e) => setCustomerFormData({ ...customerFormData, phone: e.target.value })}
              placeholder="e.g. +91 98421 98765"
            />
          </div>

          <FormInput
            label="Address"
            name="address"
            value={customerFormData.address}
            onChange={(e) => setCustomerFormData({ ...customerFormData, address: e.target.value })}
            placeholder="e.g. RS Puram, Coimbatore"
          />
        </form>
      </Modal>
    </div>
  );
};
