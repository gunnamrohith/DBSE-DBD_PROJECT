const accessByRole = {
  Admin: ['/', '/flats', '/residents', '/visitors', '/staff', '/maintenance', '/payments', '/complaints', '/notices', '/amenities', '/bookings', '/settings'],
  Committee: ['/', '/flats', '/residents', '/visitors', '/staff', '/maintenance', '/payments', '/complaints', '/notices', '/amenities', '/bookings', '/settings'],
  Treasurer: ['/', '/flats', '/residents', '/maintenance', '/payments', '/notices', '/settings'],
  Secretary: ['/', '/flats', '/residents', '/visitors', '/complaints', '/notices', '/amenities', '/bookings', '/settings'],
  Resident: ['/', '/visitors', '/maintenance', '/payments', '/complaints', '/notices', '/amenities', '/bookings', '/settings'],
  Security: ['/', '/visitors', '/notices', '/settings'],
  Housekeeping: ['/', '/notices', '/settings'],
  'Maintenance Staff': ['/', '/complaints', '/notices', '/settings'],
}

const manageByRole = {
  Admin: ['flats', 'residents', 'visitors', 'staff', 'maintenance', 'payments', 'complaints', 'notices', 'amenities', 'bookings'],
  Committee: ['residents', 'visitors', 'complaints', 'notices', 'amenities', 'bookings'],
  Treasurer: ['maintenance', 'payments'],
  Secretary: ['visitors', 'complaints', 'notices', 'amenities', 'bookings'],
  Security: ['visitors'],
  'Maintenance Staff': ['complaints'],
}

const createByRole = {
  Resident: ['visitors', 'complaints', 'bookings'],
}

export function canAccessPath(user, path) {
  return Boolean(user && accessByRole[user.role]?.includes(path))
}

export function firstAllowedPath(user) {
  return accessByRole[user?.role]?.[0] || '/login'
}

export function canCreateResource(user, resource) {
  return Boolean(manageByRole[user?.role]?.includes(resource) || createByRole[user?.role]?.includes(resource))
}

export function canManageResource(user, resource) {
  return Boolean(manageByRole[user?.role]?.includes(resource))
}

export function ownsRecord(user, resource, record) {
  if (!user || !record) return false
  if (resource === 'residents') return Number(record.resident_id) === Number(user.resident_id)
  if (resource === 'staff') return Number(record.staff_id) === Number(user.staff_id)
  if (['complaints', 'payments', 'bookings'].includes(resource)) return Number(record.resident_id) === Number(user.resident_id)
  if (['visitors', 'maintenance'].includes(resource)) return Number(record.flat_id) === Number(user.flat_id)
  return false
}

export function canEditRecord(user, resource, record) {
  if (canManageResource(user, resource)) return true
  return user?.role === 'Resident' && ['visitors', 'complaints', 'bookings'].includes(resource) && ownsRecord(user, resource, record)
}

export function canDeleteRecord(user, resource, record) {
  if (user?.role === 'Admin') return true
  if (['Committee', 'Secretary'].includes(user?.role) && ['visitors', 'complaints', 'notices', 'bookings'].includes(resource)) return true
  return user?.role === 'Resident' && ['visitors', 'complaints', 'bookings'].includes(resource) && ownsRecord(user, resource, record)
}

export function scopeRecords(user, resource, rows) {
  if (!user || !rows) return []
  if (user.role === 'Resident') {
    if (['visitors', 'maintenance'].includes(resource)) return rows.filter((row) => Number(row.flat_id) === Number(user.flat_id))
    if (['payments', 'complaints', 'bookings'].includes(resource)) return rows.filter((row) => Number(row.resident_id) === Number(user.resident_id))
  }
  if (user.accountType === 'staff' && resource === 'staff') return rows.filter((row) => Number(row.staff_id) === Number(user.staff_id))
  return rows
}

export function getAllowedPaths(user) {
  return accessByRole[user?.role] || []
}
