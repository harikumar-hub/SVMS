export const INITIAL_REMINDERS = [
  {
    id: 'rem-101',
    userId: 'usr-cust-1',
    vehicleId: 'veh-102',
    vehicleName: 'Hyundai Creta (TN 37 CD 4567)',
    type: 'PUC_EXPIRY',
    title: 'PUC / Emission Certificate Expiring Soon',
    dueDate: '2024-11-20',
    daysRemaining: 18,
    urgency: 'HIGH',
    description: 'Mandatory Tamil Nadu Pollution Under Control (PUC) certificate renewal due.',
    actionRequired: 'Book Emission Test',
    status: 'ACTIVE'
  },
  {
    id: 'rem-102',
    userId: 'usr-cust-1',
    vehicleId: 'veh-101',
    vehicleName: 'Maruti Suzuki Swift (TN 38 AB 1234)',
    type: 'NEXT_SERVICE',
    title: 'Periodic 25,000 km Service Due',
    dueDate: '2024-10-15',
    daysRemaining: 17,
    urgency: 'MEDIUM',
    description: 'Your Maruti Swift is due for 25,000 km routine maintenance.',
    actionRequired: 'Book Service',
    status: 'ACTIVE'
  },
  {
    id: 'rem-103',
    userId: 'usr-cust-1',
    vehicleId: 'veh-102',
    vehicleName: 'Hyundai Creta (TN 37 CD 4567)',
    type: 'INSURANCE_EXPIRY',
    title: 'Vehicle Insurance Renewal Due',
    dueDate: '2025-03-30',
    daysRemaining: 180,
    urgency: 'LOW',
    description: 'Insurance policy renewal with United India Insurance.',
    actionRequired: 'View Details',
    status: 'UPCOMING'
  }
];
