import bcrypt from 'bcryptjs'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import jwt from 'jsonwebtoken'
import { pool } from './db.js'
import { authenticate } from './middleware/auth.js'
import { canAccess, canCreate, canDelete, canUpdate, resources } from './config/resources.js'

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET must be set in .env')

const app = express()
const allowedOrigins = new Set([
  process.env.FRONTEND_URL || 'http://localhost:5174',
  'http://127.0.0.1:5174',
])
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true)
    callback(new Error('Origin is not allowed by CORS.'))
  },
}))
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({
    name: 'Haven Society Management API',
    status: 'running',
    health: '/api/health',
    frontend: process.env.FRONTEND_URL || 'http://localhost:5174',
  })
})

app.get('/api/health', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    next(error)
  }
})

app.get('/api/auth/accounts', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.user_id, u.name, u.email, u.role, u.account_type,
              u.resident_id, u.staff_id, COALESCE(r.flat_id, u.flat_id) AS flat_id,
              r.resident_type, f.block_name, f.flat_number
       FROM app_users u
       LEFT JOIN residents r ON r.resident_id = u.resident_id
       LEFT JOIN flats f ON f.flat_id = COALESCE(r.flat_id, u.flat_id)
       WHERE u.is_active = TRUE
       ORDER BY FIELD(u.role, 'Admin', 'Committee', 'Secretary', 'Resident', 'Security', 'Housekeeping', 'Maintenance Staff'),
                f.block_name, f.flat_number, u.name`,
    )
    const demoPassword = (account) => {
      if (account.email === 'admin@havenwoods.in') return 'admin123'
      if (account.email === 'rahul@gmail.com') return 'rahul123'
      if (account.role === 'Security') return 'security123'
      if (account.account_type === 'staff') return 'staff123'
      return 'demo123'
    }
    res.json(rows.map((account) => ({
      id: String(account.user_id),
      name: account.name,
      email: account.email,
      role: account.role,
      accountType: account.account_type,
      resident_id: account.resident_id,
      staff_id: account.staff_id,
      flat_id: account.flat_id,
      residentType: account.resident_type,
      block: account.block_name,
      flatLabel: account.flat_number ? `Block ${account.block_name} · Flat ${account.flat_number}` : null,
      demoPassword: demoPassword(account),
    })))
  } catch (error) {
    next(error)
  }
})

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' })
    const [rows] = await pool.execute(
      `SELECT u.user_id, u.name, u.email, u.password_hash, u.role, u.account_type,
              u.resident_id, u.staff_id, COALESCE(r.flat_id, u.flat_id) AS flat_id
       FROM app_users u LEFT JOIN residents r ON r.resident_id = u.resident_id
       WHERE LOWER(u.email) = LOWER(?) AND u.is_active = TRUE`,
      [email.trim()],
    )
    const account = rows[0]
    if (!account || !await bcrypt.compare(password, account.password_hash)) return res.status(401).json({ message: 'Email or password is incorrect.' })
    const user = { id: account.user_id, name: account.name, email: account.email, role: account.role, accountType: account.account_type, resident_id: account.resident_id, staff_id: account.staff_id, flat_id: account.flat_id }
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '8h' })
    res.json({ user, token })
  } catch (error) {
    next(error)
  }
})

app.put('/api/account/profile', authenticate, async (req, res, next) => {
  const name = req.body.name?.trim()
  const email = req.body.email?.trim().toLowerCase()
  if (!name || !email) return res.status(400).json({ message: 'Name and email are required.' })
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    await connection.execute('UPDATE app_users SET name = ?, email = ? WHERE user_id = ?', [name, email, req.user.id])
    if (req.user.resident_id) await connection.execute('UPDATE residents SET resident_name = ?, email = ? WHERE resident_id = ?', [name, email, req.user.resident_id])
    if (req.user.staff_id) await connection.execute('UPDATE staff SET staff_name = ? WHERE staff_id = ?', [name, req.user.staff_id])
    await connection.commit()
    const user = { ...req.user, name, email }
    delete user.iat
    delete user.exp
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '8h' })
    res.json({ user, token })
  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    connection.release()
  }
})

app.put('/api/account/password', authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current and new passwords are required.' })
    if (newPassword.length < 8) return res.status(400).json({ message: 'New password must contain at least 8 characters.' })
    const [rows] = await pool.execute('SELECT password_hash FROM app_users WHERE user_id = ?', [req.user.id])
    if (!rows[0] || !await bcrypt.compare(currentPassword, rows[0].password_hash)) return res.status(401).json({ message: 'Current password is incorrect.' })
    await pool.execute('UPDATE app_users SET password_hash = ? WHERE user_id = ?', [await bcrypt.hash(newPassword, 10), req.user.id])
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

app.use('/api/:resource', authenticate, (req, res, next) => {
  const config = resources[req.params.resource]
  if (!config) return res.status(404).json({ message: 'Unknown resource.' })
  if (!canAccess(req.user.role, req.params.resource)) return res.status(403).json({ message: 'You do not have access to this resource.' })
  req.resourceConfig = config
  next()
})

function scopedWhere(user, resource) {
  if (user.role === 'Resident') {
    if (resource === 'residents') return { sql: ' WHERE resident_id = ?', values: [user.resident_id] }
    if (['visitors', 'maintenance'].includes(resource)) return { sql: ' WHERE flat_id = ?', values: [user.flat_id] }
    if (['payments', 'complaints', 'bookings'].includes(resource)) return { sql: ' WHERE resident_id = ?', values: [user.resident_id] }
  }
  if (user.accountType === 'staff' && resource === 'staff') return { sql: ' WHERE staff_id = ?', values: [user.staff_id] }
  return { sql: '', values: [] }
}

function cleanValues(body, fields) {
  return Object.fromEntries(fields.filter((field) => field !== 'password' && body[field] !== undefined).map((field) => [field, body[field] === '' ? null : body[field]]))
}

async function findBookingConflict(connection, booking, excludeId = null) {
  const values = [booking.amenity_id, booking.booking_date, booking.end_time, booking.start_time]
  let exclude = ''
  if (excludeId) {
    exclude = ' AND booking_id <> ?'
    values.push(excludeId)
  }
  const [rows] = await connection.execute(
    `SELECT booking_id, start_time, end_time FROM amenity_bookings
     WHERE amenity_id = ? AND booking_date = ? AND booking_status = 'Confirmed'
       AND start_time < ? AND end_time > ?${exclude}
     LIMIT 1`,
    values,
  )
  return rows[0]
}

async function validateBookingRequest(connection, booking) {
  if (booking.end_time <= booking.start_time) throw Object.assign(new Error('End time must be after start time.'), { statusCode: 400 })
  if (booking.booking_date < new Date().toISOString().slice(0, 10)) throw Object.assign(new Error('Booking date cannot be in the past.'), { statusCode: 400 })
  const [amenities] = await connection.execute('SELECT availability_status FROM amenities WHERE amenity_id = ?', [booking.amenity_id])
  if (!amenities[0]) throw Object.assign(new Error('Amenity not found.'), { statusCode: 400 })
  if (amenities[0].availability_status !== 'Available') throw Object.assign(new Error('This amenity is currently unavailable for booking.'), { statusCode: 409 })
}

app.get('/api/:resource', async (req, res, next) => {
  try {
    const { table, id } = req.resourceConfig
    const scope = scopedWhere(req.user, req.params.resource)
    const [rows] = await pool.execute(`SELECT * FROM ${table}${scope.sql} ORDER BY ${id} DESC`, scope.values)
    res.json(rows)
  } catch (error) {
    next(error)
  }
})

app.post('/api/:resource', async (req, res, next) => {
  const resource = req.params.resource
  if (!canCreate(req.user.role, resource)) return res.status(403).json({ message: 'You cannot create this resource.' })
  const pendingBody = resource === 'bookings' ? { ...req.body, booking_status: 'Pending' } : req.body
  const ownedBody = req.user.role === 'Resident' ? { ...pendingBody, ...(['complaints', 'bookings'].includes(resource) ? { resident_id: req.user.resident_id } : {}), ...(resource === 'visitors' ? { flat_id: req.user.flat_id } : {}) } : pendingBody
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const values = cleanValues(ownedBody, req.resourceConfig.fields)
    const fields = Object.keys(values)
    if (!fields.length) throw Object.assign(new Error('No valid fields supplied.'), { statusCode: 400 })
    if (resource === 'bookings') await validateBookingRequest(connection, values)
    const [result] = await connection.execute(`INSERT INTO ${req.resourceConfig.table} (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`, Object.values(values))
    if (resource === 'residents') {
      if (!ownedBody.password) throw new Error('A password is required for a resident account.')
      const passwordHash = await bcrypt.hash(ownedBody.password, 10)
      await connection.execute('INSERT INTO app_users (name, email, password_hash, role, account_type, resident_id, flat_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [ownedBody.resident_name, ownedBody.email, passwordHash, ownedBody.role, 'resident', result.insertId, ownedBody.flat_id])
    }
    const [rows] = await connection.execute(`SELECT * FROM ${req.resourceConfig.table} WHERE ${req.resourceConfig.id} = ?`, [result.insertId])
    await connection.commit()
    res.status(201).json(rows[0])
  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    connection.release()
  }
})

app.put('/api/:resource/:id', async (req, res, next) => {
  const { table, id, fields: allowedFields } = req.resourceConfig
  const connection = await pool.getConnection()
  try {
    const [existingRows] = await connection.execute(`SELECT * FROM ${table} WHERE ${id} = ?`, [req.params.id])
    const existing = existingRows[0]
    if (!existing) return res.status(404).json({ message: 'Record not found.' })
    if (!canUpdate(req.user, req.params.resource, existing)) return res.status(403).json({ message: 'You cannot update this record.' })
    if (req.params.resource === 'bookings') {
      const nextStatus = req.body.booking_status ?? existing.booking_status
      if (nextStatus !== existing.booking_status && req.user.role !== 'Admin') return res.status(403).json({ message: 'Only an admin can approve or decline booking requests.' })
      if (req.user.role === 'Resident' && existing.booking_status !== 'Pending') return res.status(409).json({ message: 'Only pending booking requests can be changed.' })
      if (nextStatus === 'Confirmed') {
        const candidate = { ...existing, ...req.body }
        await validateBookingRequest(connection, candidate)
        const conflict = await findBookingConflict(connection, candidate, req.params.id)
        if (conflict) return res.status(409).json({ message: `This amenity is already booked from ${String(conflict.start_time).slice(0, 5)} to ${String(conflict.end_time).slice(0, 5)} on the selected date.` })
      }
    }
    const values = cleanValues(req.body, allowedFields)
    const fields = Object.keys(values)
    if (!fields.length && !req.body.password) return res.status(400).json({ message: 'No valid fields supplied.' })
    await connection.beginTransaction()
    if (fields.length) await connection.execute(`UPDATE ${table} SET ${fields.map((field) => `${field} = ?`).join(', ')} WHERE ${id} = ?`, [...Object.values(values), req.params.id])
    if (req.params.resource === 'residents') {
      const userValues = [req.body.resident_name ?? existing.resident_name, req.body.email ?? existing.email, req.body.role ?? existing.role, req.body.flat_id ?? existing.flat_id, req.params.id]
      await connection.execute('UPDATE app_users SET name = ?, email = ?, role = ?, flat_id = ? WHERE resident_id = ?', userValues)
      if (req.body.password) await connection.execute('UPDATE app_users SET password_hash = ? WHERE resident_id = ?', [await bcrypt.hash(req.body.password, 10), req.params.id])
    }
    const [rows] = await connection.execute(`SELECT * FROM ${table} WHERE ${id} = ?`, [req.params.id])
    await connection.commit()
    res.json(rows[0])
  } catch (error) {
    await connection.rollback()
    next(error)
  } finally {
    connection.release()
  }
})

app.delete('/api/:resource/:id', async (req, res, next) => {
  try {
    const { table, id } = req.resourceConfig
    const [rows] = await pool.execute(`SELECT * FROM ${table} WHERE ${id} = ?`, [req.params.id])
    if (!rows[0]) return res.status(404).json({ message: 'Record not found.' })
    if (!canDelete(req.user, req.params.resource, rows[0])) return res.status(403).json({ message: 'You cannot delete this record.' })
    await pool.execute(`DELETE FROM ${table} WHERE ${id} = ?`, [req.params.id])
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

app.use((error, _req, res, next) => {
  void next
  console.error(error)
  if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'A record with this unique value already exists.' })
  if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ message: 'This record is used by another record and cannot be deleted.' })
  res.status(error.statusCode || 500).json({ message: process.env.NODE_ENV === 'production' && !error.statusCode ? 'Internal server error.' : error.message })
})

const port = Number(process.env.PORT || 3001)
app.listen(port, () => console.log(`Society API listening on http://localhost:${port}`))