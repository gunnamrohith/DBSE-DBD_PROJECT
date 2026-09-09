import { mockData } from '../data/mockData'

const store = Object.fromEntries(Object.entries(mockData).map(([key, rows]) => [key, [...rows]]))
const idFields = { flats: 'flat_id', residents: 'resident_id', visitors: 'visitor_id', staff: 'staff_id', maintenance: 'bill_id', payments: 'payment_id', complaints: 'complaint_id', notices: 'notice_id', amenities: 'amenity_id', bookings: 'booking_id' }
const wait = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 180))

async function list(resource) {
  return wait([...store[resource]])
}

async function add(resource, values) {
  const idField = idFields[resource]
  const nextId = Math.max(0, ...store[resource].map((row) => Number(row[idField]))) + 1
  const record = { ...values, [idField]: nextId }
  store[resource] = [record, ...store[resource]]
  return wait(record)
}

async function update(resource, id, values) {
  const idField = idFields[resource]
  store[resource] = store[resource].map((row) => Number(row[idField]) === Number(id) ? { ...row, ...values } : row)
  return wait(store[resource].find((row) => Number(row[idField]) === Number(id)))
}

async function remove(resource, id) {
  const idField = idFields[resource]
  store[resource] = store[resource].filter((row) => Number(row[idField]) !== Number(id))
  return wait({ success: true })
}

export const api = { list, add, update, remove }

Object.keys(idFields).forEach((resource) => {
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
