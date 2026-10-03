export const resources = {
  flats: { table: 'flats', id: 'flat_id', fields: ['flat_number', 'block_name', 'floor_number', 'flat_type', 'occupancy_status'] },
  residents: { table: 'residents', id: 'resident_id', fields: ['resident_name', 'email', 'phone', 'password', 'role', 'resident_type', 'flat_id'] },
  visitors: { table: 'visitors', id: 'visitor_id', fields: ['visitor_name', 'phone', 'purpose', 'flat_id', 'entry_time', 'exit_time', 'status'] },
  staff: { table: 'staff', id: 'staff_id', fields: ['staff_name', 'phone', 'staff_type', 'address'] },
  maintenance: { table: 'maintenance_bills', id: 'bill_id', fields: ['flat_id', 'bill_month', 'amount', 'due_date', 'bill_status'] },
  payments: { table: 'payments', id: 'payment_id', fields: ['bill_id', 'resident_id', 'payment_date', 'amount', 'payment_method', 'transaction_id', 'payment_status'] },
  complaints: { table: 'complaints', id: 'complaint_id', fields: ['resident_id', 'complaint_title', 'complaint_description', 'complaint_date', 'complaint_status'] },
  notices: { table: 'notices', id: 'notice_id', fields: ['notice_title', 'notice_description', 'notice_date'] },
  amenities: { table: 'amenities', id: 'amenity_id', fields: ['amenity_name', 'location', 'availability_status'] },
  bookings: { table: 'amenity_bookings', id: 'booking_id', fields: ['resident_id', 'amenity_id', 'booking_date', 'start_time', 'end_time', 'booking_status'] },
}

const access = {
  Admin: Object.keys(resources),
  Committee: Object.keys(resources),
  Secretary: ['flats', 'residents', 'visitors', 'complaints', 'notices', 'amenities', 'bookings'],
  Resident: ['flats', 'residents', 'visitors', 'maintenance', 'payments', 'complaints', 'notices', 'amenities', 'bookings'],
  Security: ['flats', 'visitors', 'notices'],
  Housekeeping: ['flats', 'notices', 'amenities'],
  'Maintenance Staff': ['complaints', 'notices'],
}

const manage = {
  Admin: Object.keys(resources),
  Committee: ['residents', 'visitors', 'complaints', 'notices', 'amenities', 'bookings'],
  Secretary: ['visitors', 'complaints', 'notices', 'amenities', 'bookings'],
  Security: ['visitors'],
  'Maintenance Staff': ['complaints'],
}

export const canAccess = (role, resource) => access[role]?.includes(resource)
export const canManage = (role, resource) => manage[role]?.includes(resource)
export const canCreate = (role, resource) => canManage(role, resource) || (role === 'Resident' && ['visitors', 'complaints', 'bookings'].includes(resource))

export function owns(user, resource, row) {
  if (resource === 'residents') return Number(row.resident_id) === Number(user.resident_id)
  if (resource === 'staff') return Number(row.staff_id) === Number(user.staff_id)
  if (['payments', 'complaints', 'bookings'].includes(resource)) return Number(row.resident_id) === Number(user.resident_id)
  if (['visitors', 'maintenance'].includes(resource)) return Number(row.flat_id) === Number(user.flat_id)
  return false
}

export const canUpdate = (user, resource, row) => canManage(user.role, resource) || (user.role === 'Resident' && ['visitors', 'complaints', 'bookings'].includes(resource) && owns(user, resource, row))
export const canDelete = (user, resource, row) => user.role === 'Admin' || (['Committee', 'Secretary'].includes(user.role) && ['visitors', 'complaints', 'notices', 'bookings'].includes(resource)) || (user.role === 'Resident' && ['visitors', 'complaints', 'bookings'].includes(resource) && owns(user, resource, row))