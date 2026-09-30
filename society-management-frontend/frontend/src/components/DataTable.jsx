import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from 'lucide-react'
import StatusBadge from './StatusBadge'

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
const date = (value) => value ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : '—'

export default function DataTable({ rows, columns, idField, data, onEdit, onDelete, onView, canEdit = () => true, canDelete = () => true }) {
  const [sort, setSort] = useState({ key: idField, direction: 'asc' })
  const [page, setPage] = useState(1)
  const pageSize = 6
  const sorted = useMemo(() => [...rows].sort((left, right) => {
    const result = String(left[sort.key] ?? '').localeCompare(String(right[sort.key] ?? ''), undefined, { numeric: true })
    return sort.direction === 'asc' ? result : -result
  }), [rows, sort])
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const visible = sorted.slice((Math.min(page, pages) - 1) * pageSize, Math.min(page, pages) * pageSize)

  const render = (row, key, type) => {
    const value = row[key]
    if (type === 'badge') return <StatusBadge value={value} />
    if (type === 'currency') return currency.format(value)
    if (type === 'date') return date(value)
    if (type === 'datetime') return value ? new Date(value).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'
    if (type === 'flat') { const flat = data.flats.find((item) => Number(item.flat_id) === Number(value)); return flat ? `${flat.block_name}-${flat.flat_number}` : '—' }
    if (type === 'resident') return data.residents.find((item) => Number(item.resident_id) === Number(value))?.resident_name || '—'
    if (type === 'amenity') return data.amenities.find((item) => Number(item.amenity_id) === Number(value))?.amenity_name || '—'
    if (type === 'truncate') return <span className="truncate" title={value}>{value}</span>
    if (key === 'resident_name') { const initials = value.split(' ').map((part) => part[0]).slice(0, 2).join(''); return <span className="person-cell"><span className="avatar small">{initials}</span><b>{value}</b></span> }
    return value || '—'
  }

  const toggleSort = (key) => setSort((current) => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }))

  return <div className="table-card">
    <div className="table-scroll"><table><thead><tr>{columns.map(([key, label]) => <th key={key}><button onClick={() => toggleSort(key)}>{label}{sort.key === key ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : ''}</button></th>)}<th>Actions</th></tr></thead>
      <tbody>{visible.length ? visible.map((row) => <tr key={row[idField]} onClick={() => onView?.(row)}>{columns.map(([key, , type]) => <td key={key}>{render(row, key, type)}</td>)}<td><div className="row-actions" onClick={(event) => event.stopPropagation()}>{onView && <button title="View" onClick={() => onView(row)}><Eye size={16} /></button>}{onEdit && canEdit(row) && <button title="Edit" onClick={() => onEdit(row)}><Pencil size={16} /></button>}{onDelete && canDelete(row) && <button className="danger-action" title="Delete" onClick={() => onDelete(row)}><Trash2 size={16} /></button>}</div></td></tr>) : <tr><td className="empty-row" colSpan={columns.length + 1}>No records match your search.</td></tr>}</tbody>
    </table></div>
    <footer className="table-footer"><span>Showing {visible.length} of {sorted.length} records</span><div><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft size={16} /></button><span>Page {Math.min(page, pages)} of {pages}</span><button disabled={page >= pages} onClick={() => setPage((value) => value + 1)}><ChevronRight size={16} /></button></div></footer>
  </div>
}
