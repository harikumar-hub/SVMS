export * from './initialUsers';
export * from './initialVehicles';
export * from './initialServiceProviders';
export * from './initialTechnicians';
export * from './initialSpareParts';
export * from './initialAppointments';
export * from './initialPartsRequests';
export * from './initialReminders';
export * from './initialNotifications';

export const SERVICE_TYPES = [
  'General Service',
  'Oil Change',
  'Brake Service',
  'Engine Service',
  'Battery Service',
  'AC Service',
  'Tyre Service',
  'Periodic Maintenance',
  'Other'
];

export const SERVICE_STATUSES = [
  'PENDING',
  'ACCEPTED',
  'TECHNICIAN_ASSIGNED',
  'VEHICLE_RECEIVED',
  'INSPECTION',
  'IN_PROGRESS',
  'PARTS_REQUIRED',
  'QUALITY_CHECK',
  'COMPLETED',
  'VEHICLE_READY',
  'REJECTED',
  'CANCELLED'
];

export const ROLES = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  SERVICE_PROVIDER: 'SERVICE_PROVIDER',
  TECHNICIAN: 'TECHNICIAN',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER'
};
