const accounts = [
  { id: 'admin', name: 'Admin User', email: 'admin@havenwoods.in', password: 'admin123', role: 'Admin', accountType: 'admin' },
  { id: 'resident-1', name: 'Rahul Kumar', email: 'rahul@gmail.com', password: 'rahul123', role: 'Resident', accountType: 'resident', resident_id: 1, flat_id: 1 },
  { id: 'committee-3', name: 'Vikram Singh', email: 'vikram@example.com', password: 'demo123', role: 'Committee', accountType: 'resident', resident_id: 3, flat_id: 4 },
  { id: 'secretary-10', name: 'Isha Verma', email: 'isha@example.com', password: 'demo123', role: 'Secretary', accountType: 'resident', resident_id: 10, flat_id: 2 },
  { id: 'security-1', name: 'Mahesh Yadav', email: 'security@havenwoods.in', password: 'security123', role: 'Security', accountType: 'staff', staff_id: 1 },
  { id: 'housekeeping-2', name: 'Lata Pawar', email: 'housekeeping@havenwoods.in', password: 'staff123', role: 'Housekeeping', accountType: 'staff', staff_id: 2 },
  { id: 'maintenance-3', name: 'Ganesh More', email: 'maintenance@havenwoods.in', password: 'staff123', role: 'Maintenance Staff', accountType: 'staff', staff_id: 3 },
]

const sessionKey = 'haven-demo-user'
const tokenKey = 'haven-token'
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export async function signIn(email, password) {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || 'Email or password is incorrect.')
  const { user, token } = payload
  localStorage.setItem(sessionKey, JSON.stringify(user))
  localStorage.setItem(tokenKey, token)
  return user
}

export function signOut() {
  localStorage.removeItem(sessionKey)
  localStorage.removeItem(tokenKey)
  localStorage.removeItem('haven-demo-auth')
}

export function getCurrentUser() {
  try {
    if (!localStorage.getItem(tokenKey)) return null
    return JSON.parse(localStorage.getItem(sessionKey))
  } catch {
    return null
  }
}

export const demoAccounts = accounts.map(({ password, ...account }) => ({ ...account, demoPassword: password }))
