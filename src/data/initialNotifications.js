export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-001',
    userId: 'usr-cust-1',
    role: 'CUSTOMER',
    type: 'SERVICE_PROGRESS',
    title: 'Service in Progress',
    message: 'Technician Vignesh Kumar has started working on your Maruti Swift (TN 38 AB 1234).',
    timestamp: '2024-09-28T14:15:00Z',
    read: false,
    link: '/customer/appointments/apt-2024-001',
    badge: 'IN_PROGRESS'
  },
  {
    id: 'notif-002',
    userId: 'usr-prov-1',
    role: 'SERVICE_PROVIDER',
    type: 'NEW_REQUEST',
    title: 'New Service Request Submitted',
    message: 'Priya Sharma booked an AC Service for Tata Nexon (TN 66 EF 7890).',
    timestamp: '2024-09-28T08:00:00Z',
    read: false,
    link: '/provider/requests',
    badge: 'PENDING'
  },
  {
    id: 'notif-003',
    userId: 'usr-tech-2',
    role: 'TECHNICIAN',
    type: 'ASSIGNMENT',
    title: 'Technician Assigned',
    message: 'You have been assigned to service Hyundai Creta (TN 37 CD 4567) - Brake Service.',
    timestamp: '2024-09-27T16:00:00Z',
    read: true,
    link: '/technician/assigned',
    badge: 'TECHNICIAN_ASSIGNED'
  },
  {
    id: 'notif-004',
    userId: 'usr-inv-1',
    role: 'INVENTORY_MANAGER',
    type: 'PARTS_REQUEST',
    title: 'Parts Request Submitted',
    message: 'Santhosh M requested Front Disc Brake Pads Set (BRK-PAD-SWIFT).',
    timestamp: '2024-09-28T11:20:00Z',
    read: false,
    link: '/inventory/requests',
    badge: 'PARTS_REQUIRED'
  },
  {
    id: 'notif-005',
    userId: 'usr-cust-2',
    role: 'CUSTOMER',
    type: 'VEHICLE_READY',
    title: 'Vehicle Ready for Delivery',
    message: 'Your Honda City (TN 33 GH 2345) service is complete and ready at NexaCare Service Center.',
    timestamp: '2024-09-27T16:45:00Z',
    read: true,
    link: '/customer/appointments/apt-2024-004',
    badge: 'VEHICLE_READY'
  }
];
