const accounts = [
  { id: 'admin', name: 'Admin User', email: 'admin@havenwoods.in', password: 'admin123', role: 'Admin', accountType: 'admin' },
  { id: 'resident-1', name: 'Rahul Kumar', email: 'rahul@gmail.com', password: 'rahul123', role: 'Resident', accountType: 'resident', resident_id: 1, flat_id: 1 },
  { id: 'committee-3', name: 'Vikram Singh', email: 'vikram@example.com', password: 'demo123', role: 'Committee', accountType: 'resident', resident_id: 3, flat_id: 4 },
  { id: 'treasurer-6', name: 'Nisha Patel', email: 'nisha@example.com', password: 'demo123', role: 'Treasurer', accountType: 'resident', resident_id: 6, flat_id: 8 },
  { id: 'secretary-10', name: 'Isha Verma', email: 'isha@example.com', password: 'demo123', role: 'Secretary', accountType: 'resident', resident_id: 10, flat_id: 2 },
  { id: 'security-1', name: 'Mahesh Yadav', email: 'security@havenwoods.in', password: 'security123', role: 'Security', accountType: 'staff', staff_id: 1 },
  { id: 'housekeeping-2', name: 'Lata Pawar', email: 'housekeeping@havenwoods.in', password: 'staff123', role: 'Housekeeping', accountType: 'staff', staff_id: 2 },
  { id: 'maintenance-3', name: 'Ganesh More', email: 'maintenance@havenwoods.in', password: 'staff123', role: 'Maintenance Staff', accountType: 'staff', staff_id: 3 },
]

const sessionKey = 'haven-demo-user'

export function signIn(email, password) {
  const account = accounts.find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password)
  if (!account) return null
  const user = { ...account }
  delete user.password
  localStorage.setItem(sessionKey, JSON.stringify(user))
  return user
}

export function signOut() {
  localStorage.removeItem(sessionKey)
  localStorage.removeItem('haven-demo-auth')
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(sessionKey))
  } catch {
    return null
  }
}

export const demoAccounts = accounts.map(({ password, ...account }) => ({ ...account, demoPassword: password }))
