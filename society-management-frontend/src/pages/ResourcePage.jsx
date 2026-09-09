import { useMemo, useState } from 'react'
import { Plus, Search, Users, UserCheck, Clock3, CircleCheck, WalletCards } from 'lucide-react'
import { useApp } from '../context/AppStateContext'
import { resourceConfig } from '../config/resources'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import RecordForm from '../components/RecordForm'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { getCurrentUser } from '../services/auth'
import { canCreateResource, canDeleteRecord, canEditRecord, scopeRecords } from '../config/permissions'

const statIcons = [Users, UserCheck, Clock3, CircleCheck]

export default function ResourcePage({ resource }) {
  const config = resourceConfig[resource]
  const user = getCurrentUser()
  const { data, loading, addRecord, updateRecord, deleteRecord } = useApp()
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({})
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const filterKeys = config.filters || (config.statusField ? [config.statusField] : [])
  const scopedRows = useMemo(() => scopeRecords(user, resource, data[resource] || []), [user, resource, data])
  const formFields = user.role === 'Resident' ? config.fields.filter((field) => !((resource === 'visitors' && field.name === 'flat_id') || (['complaints', 'bookings'].includes(resource) && field.name === 'resident_id'))) : config.fields

  const rows = useMemo(() => scopedRows.filter((row) => {
    const queryMatch = Object.values(row).some((value) => String(value).toLowerCase().includes(query.toLowerCase())) ||
      (row.flat_id && (() => { const flat = data.flats.find((item) => Number(item.flat_id) === Number(row.flat_id)); return `${flat?.block_name}-${flat?.flat_number}`.toLowerCase().includes(query.toLowerCase()) })())
    return queryMatch && Object.entries(filters).every(([key, value]) => !value || String(row[key]) === value)
  }), [data.flats, scopedRows, query, filters])

  const getStat = (kind) => {
    if (kind === 'all') return scopedRows.length
    if (kind === 'sum') return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(scopedRows.filter((item) => item.payment_status === 'Successful').reduce((sum, item) => sum + Number(item.amount), 0))
    if (kind === 'today') return scopedRows.filter((item) => item.booking_date === '2026-09-08').length
    if (kind === 'upcoming') return scopedRows.filter((item) => item.booking_date > '2026-09-08' && item.booking_status !== 'Cancelled').length
    return scopedRows.filter((item) => item[config.statusField] === kind).length
  }

  const save = async (values) => {
    const ownedValues = user.role === 'Resident' ? { ...values, ...(resource === 'visitors' ? { flat_id: user.flat_id } : {}), ...(['complaints', 'bookings'].includes(resource) ? { resident_id: user.resident_id } : {}) } : values
    const normalized = Object.fromEntries(Object.entries(ownedValues).map(([key, value]) => (key.endsWith('_id') || key === 'amount' || key === 'floor_number') && value !== '' ? [key, Number(value)] : [key, value]))
    if (editing?.[config.idField]) await updateRecord(resource, editing[config.idField], normalized, config.idField)
    else await addRecord(resource, normalized)
    setEditing(null)
  }

  if (loading) return <div className="loading-state"><span className="spinner" />Loading {config.title.toLowerCase()}…</div>

  return <div className="page-stack">
    <header className="page-header"><div><h1>{config.title}</h1><p>{config.subtitle}</p></div>{canCreateResource(user, resource) && <button className="button primary" onClick={() => setEditing({})}><Plus size={18} />Add {config.itemName}</button>}</header>
    {config.stats && <div className="mini-stats">{config.stats.map(([label, kind], index) => <StatCard key={label} label={label} value={getStat(kind)} detail="Live mock data" icon={kind === 'sum' ? WalletCards : statIcons[index]} tone={['blue', 'green', 'amber', 'violet'][index]} />)}</div>}
    <section className="toolbar"><label className="search-control"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${config.title.toLowerCase()}…`} /></label>
      {filterKeys.map((key) => <select key={key} value={filters[key] || ''} onChange={(event) => setFilters({ ...filters, [key]: event.target.value })}><option value="">All {key.replaceAll('_', ' ')}</option>{[...new Set(scopedRows.map((row) => String(row[key])))].map((value) => <option key={value}>{value}</option>)}</select>)}</section>
    <DataTable rows={rows} columns={config.columns} idField={config.idField} data={data} onEdit={setEditing} onDelete={setDeleting} onView={setViewing} canEdit={(row) => canEditRecord(user, resource, row)} canDelete={(row) => canDeleteRecord(user, resource, row)} />
    {editing && <Modal title={`${editing[config.idField] ? 'Edit' : 'Add'} ${config.itemName}`} onClose={() => setEditing(null)}><RecordForm fields={formFields} initial={editing} onCancel={() => setEditing(null)} onSubmit={save} submitLabel={editing[config.idField] ? 'Save changes' : `Add ${config.itemName}`} /></Modal>}
    {viewing && <Modal title={viewing.complaint_title || `${config.itemName} details`} onClose={() => setViewing(null)}><div className="detail-body">{viewing.complaint_description && <p>{viewing.complaint_description}</p>}<dl>{config.columns.map(([key, label, type]) => <span className="detail-row" key={key}><dt>{label}</dt><dd>{type === 'badge' ? <StatusBadge value={viewing[key]} /> : type === 'flat' ? (() => { const flat = data.flats.find((item) => Number(item.flat_id) === Number(viewing[key])); return flat ? `${flat.block_name}-${flat.flat_number}` : '—' })() : type === 'resident' ? data.residents.find((item) => Number(item.resident_id) === Number(viewing[key]))?.resident_name : type === 'amenity' ? data.amenities.find((item) => Number(item.amenity_id) === Number(viewing[key]))?.amenity_name : type === 'currency' ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(viewing[key]) : viewing[key] || '—'}</dd></span>)}</dl>{canEditRecord(user, resource, viewing) && <button className="button primary" onClick={() => { setEditing(viewing); setViewing(null) }}>Edit {config.itemName}</button>}</div></Modal>}
    {deleting && <Modal title={`Delete ${config.itemName}?`} onClose={() => setDeleting(null)}><div className="confirm-body"><p>Are you sure you want to delete this {config.itemName.toLowerCase()}? This action cannot be undone in the current session.</p><div className="modal-actions"><button className="button secondary" onClick={() => setDeleting(null)}>Cancel</button><button className="button danger" onClick={() => { deleteRecord(resource, deleting[config.idField], config.idField); setDeleting(null) }}>Delete</button></div></div></Modal>}
  </div>
}
