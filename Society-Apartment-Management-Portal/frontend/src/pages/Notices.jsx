import { useState } from 'react'
import { Eye, Megaphone, Pencil, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppStateContext'
import Modal from '../components/Modal'
import RecordForm from '../components/RecordForm'
import { getCurrentUser } from '../services/auth'
import { canCreateResource, canDeleteRecord, canEditRecord } from '../config/permissions'

const fields = [{ name: 'notice_title', label: 'Title', required: true }, { name: 'notice_description', label: 'Description', type: 'textarea', required: true }, { name: 'notice_date', label: 'Date', type: 'date', required: true }]

export default function Notices() {
  const user = getCurrentUser()
  const { data, addRecord, updateRecord, deleteRecord } = useApp()
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const save = async (values) => { editing.notice_id ? await updateRecord('notices', editing.notice_id, values, 'notice_id') : await addRecord('notices', values); setEditing(null) }
  return <div className="page-stack"><header className="page-header"><div><h1>Notices</h1><p>Keep residents informed with timely society announcements.</p></div>{canCreateResource(user, 'notices') && <button className="button primary" onClick={() => setEditing({})}><Plus size={18} />Add Notice</button>}</header><div className="notice-grid">{data.notices.map((notice) => <article className="notice-card" key={notice.notice_id}><div className="notice-icon"><Megaphone size={21} /></div><time>{new Date(notice.notice_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</time><h2>{notice.notice_title}</h2><p>{notice.notice_description}</p><footer><button onClick={() => setViewing(notice)}><Eye size={16} />View</button>{canEditRecord(user, 'notices', notice) && <button onClick={() => setEditing(notice)}><Pencil size={16} />Edit</button>}{canDeleteRecord(user, 'notices', notice) && <button className="danger-action" onClick={() => setDeleting(notice)}><Trash2 size={16} />Delete</button>}</footer></article>)}</div>
    {editing && <Modal title={`${editing.notice_id ? 'Edit' : 'Add'} Notice`} onClose={() => setEditing(null)}><RecordForm fields={fields} initial={editing} onSubmit={save} onCancel={() => setEditing(null)} /></Modal>}
    {viewing && <Modal title={viewing.notice_title} onClose={() => setViewing(null)}><div className="detail-body"><p>{viewing.notice_description}</p><dl><span className="detail-row"><dt>Published</dt><dd>{new Date(viewing.notice_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</dd></span></dl>{canEditRecord(user, 'notices', viewing) && <button className="button primary" onClick={() => { setEditing(viewing); setViewing(null) }}>Edit Notice</button>}</div></Modal>}
    {deleting && <Modal title="Delete notice?" onClose={() => setDeleting(null)}><div className="confirm-body"><p>Are you sure you want to delete “{deleting.notice_title}”?</p><div className="modal-actions"><button className="button secondary" onClick={() => setDeleting(null)}>Cancel</button><button className="button danger" onClick={() => { deleteRecord('notices', deleting.notice_id, 'notice_id'); setDeleting(null) }}>Delete</button></div></div></Modal>}
  </div>
}
