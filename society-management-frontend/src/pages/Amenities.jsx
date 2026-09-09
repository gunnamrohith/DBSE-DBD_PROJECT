import { useState } from 'react'
import { Bike, Dumbbell, MapPin, Pencil, Plus, Waves, UsersRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppStateContext'
import Modal from '../components/Modal'
import RecordForm from '../components/RecordForm'
import StatusBadge from '../components/StatusBadge'
import { getCurrentUser } from '../services/auth'
import { canCreateResource, canEditRecord } from '../config/permissions'

const fields = [{ name: 'amenity_name', label: 'Amenity Name', required: true }, { name: 'location', label: 'Location', required: true }, { name: 'availability_status', label: 'Availability', type: 'select', options: ['Available', 'Maintenance'].map((value) => ({ value, label: value })), required: true }]
const icons = [Waves, Dumbbell, Bike, UsersRound, UsersRound]

export default function Amenities() {
  const user = getCurrentUser()
  const navigate = useNavigate()
  const { data, addRecord, updateRecord } = useApp()
  const [editing, setEditing] = useState(null)
  const save = async (values) => { editing.amenity_id ? await updateRecord('amenities', editing.amenity_id, values, 'amenity_id') : await addRecord('amenities', values); setEditing(null) }
  return <div className="page-stack"><header className="page-header"><div><h1>Amenities</h1><p>Manage shared spaces, availability, and resident access.</p></div>{canCreateResource(user, 'amenities') && <button className="button primary" onClick={() => setEditing({})}><Plus size={18} />Add Amenity</button>}</header><div className="amenity-grid">{data.amenities.map((amenity, index) => { const Icon = icons[index % icons.length]; return <article className="amenity-card" key={amenity.amenity_id}><div className="amenity-visual"><Icon size={34} /><span>{String(index + 1).padStart(2, '0')}</span></div><div className="amenity-content"><StatusBadge value={amenity.availability_status} /><h2>{amenity.amenity_name}</h2><p><MapPin size={16} />{amenity.location}</p><footer>{user.role === 'Resident' && <button className="button primary" disabled={amenity.availability_status !== 'Available'} onClick={() => navigate('/bookings')}>Book</button>}{canEditRecord(user, 'amenities', amenity) && <button className="button secondary icon-only" title="Edit amenity" onClick={() => setEditing(amenity)}><Pencil size={17} /></button>}</footer></div></article> })}</div>{editing && <Modal title={`${editing.amenity_id ? 'Edit' : 'Add'} Amenity`} onClose={() => setEditing(null)}><RecordForm fields={fields} initial={editing} onSubmit={save} onCancel={() => setEditing(null)} /></Modal>}</div>
}
