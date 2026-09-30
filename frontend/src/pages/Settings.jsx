import { useState } from 'react'
import { Bell, Building2, LockKeyhole, User } from 'lucide-react'
import { getCurrentUser } from '../services/auth'

export default function Settings() {
  const user = getCurrentUser()
  const [saved, setSaved] = useState(false)
  const submit = (event) => { event.preventDefault(); setSaved(true); window.setTimeout(() => setSaved(false), 2500) }
  const initials = user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)
  return <div className="page-stack settings-page"><header className="page-header"><div><h1>Settings</h1><p>Manage your profile and society preferences.</p></div></header><div className="settings-layout"><aside><button className="active"><User size={18} />Profile</button><button><Building2 size={18} />Society</button><button><Bell size={18} />Notifications</button><button><LockKeyhole size={18} />Security</button></aside><form className="panel settings-form" onSubmit={submit}><header><div><h2>Profile information</h2><p>Update your contact details shown in the portal.</p></div></header><div className="profile-hero"><span className="avatar large">{initials}</span><div><b>{user.name}</b><small>{user.role}</small></div><button type="button" className="button secondary">Change photo</button></div><div className="form-grid"><label className="field"><span>Full Name</span><input defaultValue={user.name} required /></label><label className="field"><span>Email</span><input type="email" defaultValue={user.email} required /></label><label className="field"><span>Account Type</span><input value={user.accountType} disabled readOnly /></label><label className="field"><span>Role</span><input value={user.role} disabled readOnly /></label></div><div className="settings-actions">{saved && <span>Settings saved successfully.</span>}<button className="button primary">Save changes</button></div></form></div></div>
}
