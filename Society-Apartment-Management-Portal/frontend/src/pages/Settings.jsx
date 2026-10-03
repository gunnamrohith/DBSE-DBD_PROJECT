import { useRef, useState } from 'react'
import { Bell, Building2, Camera, LockKeyhole, User } from 'lucide-react'
import { changePassword, getCurrentUser, updateProfile } from '../services/auth'

const notificationDefaults = { bookings: true, complaints: true, payments: true, visitors: true, notices: true }
const societyDefaults = { name: 'Haven Society', supportEmail: 'admin@havenwoods.in', phone: '', address: '' }

export default function Settings() {
  const [user, setUser] = useState(getCurrentUser)
  const [tab, setTab] = useState('profile')
  const [profile, setProfile] = useState({ name: user.name, email: user.email })
  const [society, setSociety] = useState(() => ({ ...societyDefaults, ...JSON.parse(localStorage.getItem('haven-society-settings') || '{}') }))
  const [notifications, setNotifications] = useState(() => ({ ...notificationDefaults, ...JSON.parse(localStorage.getItem('haven-notification-settings') || '{}') }))
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [photo, setPhoto] = useState(() => localStorage.getItem(`haven-profile-photo-${user.id}`) || '')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [saving, setSaving] = useState(false)
  const photoInput = useRef(null)
  const initials = user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)

  const showMessage = (type, text) => setMessage({ type, text })
  const saveProfile = async (event) => {
    event.preventDefault(); setSaving(true); setMessage({ type: '', text: '' })
    try { const nextUser = await updateProfile(profile); setUser(nextUser); showMessage('success', 'Profile updated successfully.') } catch (error) { showMessage('error', error.message) } finally { setSaving(false) }
  }
  const saveSociety = (event) => { event.preventDefault(); localStorage.setItem('haven-society-settings', JSON.stringify(society)); showMessage('success', 'Society information saved.') }
  const saveNotifications = (event) => { event.preventDefault(); localStorage.setItem('haven-notification-settings', JSON.stringify(notifications)); window.dispatchEvent(new Event('haven-notification-settings-change')); showMessage('success', 'Notification preferences saved.') }
  const savePassword = async (event) => {
    event.preventDefault(); setMessage({ type: '', text: '' })
    if (passwords.newPassword !== passwords.confirmPassword) return showMessage('error', 'New passwords do not match.')
    setSaving(true)
    try { await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }); setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); showMessage('success', 'Password changed successfully.') } catch (error) { showMessage('error', error.message) } finally { setSaving(false) }
  }
  const changePhoto = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/') || file.size > 1_500_000) return showMessage('error', 'Choose an image smaller than 1.5 MB.')
    const reader = new FileReader()
    reader.onload = () => { setPhoto(reader.result); localStorage.setItem(`haven-profile-photo-${user.id}`, reader.result); window.dispatchEvent(new Event('haven-session-change')); showMessage('success', 'Profile photo updated.') }
    reader.readAsDataURL(file)
  }
  const openTab = (nextTab) => { setTab(nextTab); setMessage({ type: '', text: '' }) }
  const tabs = [['profile', 'Profile', User], ['society', 'Society', Building2], ['notifications', 'Notifications', Bell], ['security', 'Security', LockKeyhole]]

  return <div className="page-stack settings-page"><header className="page-header"><div><h1>Settings</h1><p>Manage your account and society preferences.</p></div></header><div className="settings-layout"><aside>{tabs.map(([value, label, Icon]) => <button type="button" className={tab === value ? 'active' : ''} onClick={() => openTab(value)} key={value}><Icon size={18} />{label}</button>)}</aside>
    {tab === 'profile' && <form className="panel settings-form" onSubmit={saveProfile}><header><div><h2>Profile information</h2><p>Update your account name and email address.</p></div></header><div className="profile-hero"><span className="avatar large">{photo ? <img src={photo} alt="Profile" /> : initials}</span><div><b>{user.name}</b><small>{user.role}</small></div><input ref={photoInput} hidden type="file" accept="image/*" onChange={changePhoto} /><button type="button" className="button secondary" onClick={() => photoInput.current?.click()}><Camera size={16} />Change photo</button></div><div className="form-grid"><label className="field"><span>Full Name</span><input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} required /></label><label className="field"><span>Email</span><input type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} required /></label><label className="field"><span>Account Type</span><input value={user.accountType} disabled readOnly /></label><label className="field"><span>Role</span><input value={user.role} disabled readOnly /></label></div><SettingsActions message={message} saving={saving} label="Save profile" /></form>}
    {tab === 'society' && <form className="panel settings-form" onSubmit={saveSociety}><header><div><h2>Society information</h2><p>Maintain the contact information used across the portal.</p></div></header><div className="form-grid"><label className="field"><span>Society Name</span><input value={society.name} onChange={(event) => setSociety({ ...society, name: event.target.value })} required /></label><label className="field"><span>Support Email</span><input type="email" value={society.supportEmail} onChange={(event) => setSociety({ ...society, supportEmail: event.target.value })} required /></label><label className="field"><span>Contact Number</span><input type="tel" value={society.phone} onChange={(event) => setSociety({ ...society, phone: event.target.value })} /></label><label className="field field-wide"><span>Address</span><textarea rows="4" value={society.address} onChange={(event) => setSociety({ ...society, address: event.target.value })} /></label></div><SettingsActions message={message} label="Save society" /></form>}
    {tab === 'notifications' && <form className="panel settings-form" onSubmit={saveNotifications}><header><div><h2>Notification preferences</h2><p>Choose which operational updates appear in the notification panel.</p></div></header><div className="settings-toggle-list">{[['bookings', 'Booking requests', 'Pending amenity requests that need approval.'], ['complaints', 'Complaints', 'Open resident complaints requiring action.'], ['payments', 'Payments', 'Pending or failed payment records.'], ['visitors', 'Visitors', 'Expected visitors awaiting arrival.'], ['notices', 'Notices', 'Society notices and announcements.']].map(([key, label, detail]) => <label className="settings-toggle" key={key}><span><b>{label}</b><small>{detail}</small></span><input type="checkbox" checked={notifications[key]} onChange={(event) => setNotifications({ ...notifications, [key]: event.target.checked })} /></label>)}</div><SettingsActions message={message} label="Save preferences" /></form>}
    {tab === 'security' && <form className="panel settings-form" onSubmit={savePassword}><header><div><h2>Change password</h2><p>Use your current password to secure the account with a new one.</p></div></header><div className="form-grid settings-security"><label className="field field-wide"><span>Current Password</span><input type="password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} required /></label><label className="field"><span>New Password</span><input type="password" minLength="8" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} required /></label><label className="field"><span>Confirm New Password</span><input type="password" minLength="8" value={passwords.confirmPassword} onChange={(event) => setPasswords({ ...passwords, confirmPassword: event.target.value })} required /></label></div><SettingsActions message={message} saving={saving} label="Change password" /></form>}
  </div></div>
}

function SettingsActions({ message, saving = false, label }) {
  return <div className="settings-actions">{message.text && <span className={message.type === 'error' ? 'settings-error' : ''}>{message.text}</span>}<button className="button primary" disabled={saving}>{saving ? 'Saving…' : label}</button></div>
}
