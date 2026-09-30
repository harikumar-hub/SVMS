export const INITIAL_REMINDERS = [
  {
    id: 'rem-101',
    vehicleId: 'veh-102',
    vehicleName: 'Hyundai Creta (TN 37 CD 4567)',
    type: 'PUC_EXPIRY',
    title: 'PUC / Emission Certificate Expired',
    dueDate: '2026-09-25',
    daysRemaining: -5,
    urgency: 'OVERDUE',
    description: 'Mandatory Tamil Nadu Pollution Under Control (PUC) certificate renewal is overdue.',
    actionRequired: 'Book Emission Test',
    status: 'ACTIVE'
  },
  {
    id: 'rem-102',
    vehicleId: 'veh-101',
    vehicleName: 'Maruti Suzuki Swift (TN 38 AB 1234)',
    type: 'NEXT_SERVICE',
    title: 'Periodic 25,000 km Service Due',
    dueDate: '2026-10-15',
    daysRemaining: 15,
    urgency: 'HIGH',
    description: 'Your Maruti Swift is due for 25,000 km routine maintenance.',
    actionRequired: 'Book Service',
    status: 'ACTIVE'
  },
  {
    id: 'rem-103',
    vehicleId: 'veh-102',
    vehicleName: 'Hyundai Creta (TN 37 CD 4567)',
    type: 'INSURANCE_EXPIRY',
    title: 'Vehicle Insurance Renewal Due',
    dueDate: '2026-12-31',
    daysRemaining: 92,
    urgency: 'LOW',
    description: 'Annual comprehensive insurance policy renewal with United India Insurance.',
    actionRequired: 'View Details',
    status: 'UPCOMING'
  },
  {
    id: 'rem-104',
    vehicleId: 'veh-101',
    vehicleName: 'Maruti Suzuki Swift (TN 38 AB 1234)',
    type: 'PERIODIC_MAINTENANCE',
    title: 'Wheel Alignment & Brake Pad Inspection',
    dueDate: '2026-11-10',
    daysRemaining: 41,
    urgency: 'MEDIUM',
    description: 'Recommended scheduled inspection for brake liners and four-wheel alignment.',
    actionRequired: 'Schedule Inspection',
    status: 'ACTIVE'
  }
];
