export const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending Approval',
    badgeClass: 'badge-PENDING',
    color: '#d97706',
    bgColor: '#fef3c7',
    step: 1,
    description: 'Booking submitted and awaiting service provider review.'
  },
  ACCEPTED: {
    label: 'Request Accepted',
    badgeClass: 'badge-ACCEPTED',
    color: '#0284c7',
    bgColor: '#e0f2fe',
    step: 2,
    description: 'Workshop accepted booking; technician allocation underway.'
  },
  TECHNICIAN_ASSIGNED: {
    label: 'Technician Assigned',
    badgeClass: 'badge-TECHNICIAN_ASSIGNED',
    color: '#1d4ed8',
    bgColor: '#dbeafe',
    step: 3,
    description: 'Certified technician has been allocated to this vehicle.'
  },
  VEHICLE_RECEIVED: {
    label: 'Vehicle Received',
    badgeClass: 'badge-VEHICLE_RECEIVED',
    color: '#6d28d9',
    bgColor: '#ede9fe',
    step: 4,
    description: 'Vehicle checked in at the workshop service bay.'
  },
  INSPECTION: {
    label: 'Under Inspection',
    badgeClass: 'badge-INSPECTION',
    color: '#7e22ce',
    bgColor: '#f3e8ff',
    step: 5,
    description: 'Digital multi-point vehicle inspection in progress.'
  },
  IN_PROGRESS: {
    label: 'Service In Progress',
    badgeClass: 'badge-IN_PROGRESS',
    color: '#c2410c',
    bgColor: '#ffedd5',
    step: 6,
    description: 'Repairs, servicing, and scheduled maintenance ongoing.'
  },
  PARTS_REQUIRED: {
    label: 'Parts Required',
    badgeClass: 'badge-PARTS_REQUIRED',
    color: '#be123c',
    bgColor: '#ffe4e6',
    step: 7,
    description: 'Spare parts requested from inventory department.'
  },
  QUALITY_CHECK: {
    label: 'Quality Check',
    badgeClass: 'badge-QUALITY_CHECK',
    color: '#0f766e',
    bgColor: '#ccfbf1',
    step: 8,
    description: 'Road test and quality control supervisor review.'
  },
  COMPLETED: {
    label: 'Service Completed',
    badgeClass: 'badge-COMPLETED',
    color: '#15803d',
    bgColor: '#dcfce7',
    step: 9,
    description: 'All work completed successfully.'
  },
  VEHICLE_READY: {
    label: 'Vehicle Ready',
    badgeClass: 'badge-VEHICLE_READY',
    color: '#047857',
    bgColor: '#d1fae5',
    step: 10,
    description: 'Vehicle cleaned, tested, and ready for customer pickup.'
  },
  REJECTED: {
    label: 'Request Rejected',
    badgeClass: 'badge-REJECTED',
    color: '#b91c1c',
    bgColor: '#fee2e2',
    step: -1,
    description: 'Booking was declined by the workshop.'
  },
  CANCELLED: {
    label: 'Cancelled',
    badgeClass: 'badge-CANCELLED',
    color: '#475569',
    bgColor: '#f1f5f9',
    step: -1,
    description: 'Service appointment was cancelled.'
  }
};

export const getStatusConfig = (status) => {
  return STATUS_CONFIG[status] || {
    label: status || 'UNKNOWN',
    badgeClass: 'badge-CANCELLED',
    color: '#475569',
    bgColor: '#f1f5f9',
    step: 0,
    description: ''
  };
};

export const SERVICE_WORKFLOW_STEPS = [
  { key: 'PENDING', title: 'Submitted' },
  { key: 'ACCEPTED', title: 'Accepted' },
  { key: 'TECHNICIAN_ASSIGNED', title: 'Tech Assigned' },
  { key: 'VEHICLE_RECEIVED', title: 'Received' },
  { key: 'INSPECTION', title: 'Inspection' },
  { key: 'IN_PROGRESS', title: 'In Progress' },
  { key: 'QUALITY_CHECK', title: 'Quality Check' },
  { key: 'COMPLETED', title: 'Completed' },
  { key: 'VEHICLE_READY', title: 'Ready' }
];
