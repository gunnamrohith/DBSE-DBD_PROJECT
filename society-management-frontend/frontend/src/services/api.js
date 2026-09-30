const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('haven-token')
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  })
  const payload = await response.json().catch(() => ({}))
  if (response.status === 401) {
    localStorage.removeItem('haven-demo-user')
    localStorage.removeItem('haven-token')
    window.location.assign('/login')
    throw new Error('Your session expired. Please sign in again.')
  }
  if (!response.ok) throw new Error(payload.message || `Request failed with status ${response.status}`)
  return payload
}

const list = (resource) => request(`/${resource}`)
const add = (resource, values) => request(`/${resource}`, { method: 'POST', body: JSON.stringify(values) })
const update = (resource, id, values) => request(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(values) })
const remove = (resource, id) => request(`/${resource}/${id}`, { method: 'DELETE' })

export const api = { list, add, update, remove }

const resources = ['flats', 'residents', 'visitors', 'staff', 'maintenance', 'payments', 'complaints', 'notices', 'amenities', 'bookings']
resources.forEach((resource) => {
  const name = resource.charAt(0).toUpperCase() + resource.slice(1)
  api[`get${name}`] = () => list(resource)
  api[`add${name}`] = (values) => add(resource, values)
  api[`update${name}`] = (id, values) => update(resource, id, values)
  api[`delete${name}`] = (id) => remove(resource, id)
})

const singularNames = { flats: 'Flat', residents: 'Resident', visitors: 'Visitor', staff: 'Staff', maintenance: 'Bill', payments: 'Payment', complaints: 'Complaint', notices: 'Notice', amenities: 'Amenity', bookings: 'Booking' }
Object.entries(singularNames).forEach(([resource, name]) => {
  api[`add${name}`] = (values) => add(resource, values)
  api[`update${name}`] = (id, values) => update(resource, id, values)
  api[`delete${name}`] = (id) => remove(resource, id)
})
api.getMaintenanceBills = () => list('maintenance')
api.getAmenityBookings = () => list('bookings')
