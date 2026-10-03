import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, User, X } from 'lucide-react'
import { useApp } from '../context/AppStateContext'
import { getCurrentUser, signOut } from '../services/auth'
import { canAccessPath } from '../config/permissions'

export default function Navbar({ onMenu }) {
  const { data } = useApp()
  const navigate = useNavigate()
  const [, setSessionVersion] = useState(0)
  const user = getCurrentUser()
  const [query, setQuery] = useState('')
  const [panel, setPanel] = useState('')
  const readKey = `haven-read-notifications-${user.id}`
  const [readIds, setReadIds] = useState(() => new Set(JSON.parse(localStorage.getItem(readKey) || '[]')))
  const [preferences, setPreferences] = useState(() => ({ bookings: true, complaints: true, payments: true, visitors: true, notices: true, ...JSON.parse(localStorage.getItem('haven-notification-settings') || '{}') }))

  useEffect(() => {
    const refreshSession = () => setSessionVersion((value) => value + 1)
    const refreshPreferences = () => setPreferences((current) => ({ ...current, ...JSON.parse(localStorage.getItem('haven-notification-settings') || '{}') }))
    window.addEventListener('haven-session-change', refreshSession)
    window.addEventListener('haven-notification-settings-change', refreshPreferences)
    return () => { window.removeEventListener('haven-session-change', refreshSession); window.removeEventListener('haven-notification-settings-change', refreshPreferences) }
  }, [])
  const results = useMemo(() => {
    if (query.length < 2) return []
    const normalized = query.toLowerCase()
    const groups = [
      ['residents', 'resident_name', '/residents'], ['flats', 'flat_number', '/flats'], ['visitors', 'visitor_name', '/visitors'],
      ['complaints', 'complaint_title', '/complaints'], ['maintenance', 'bill_month', '/maintenance'], ['notices', 'notice_title', '/notices'],
    ]
    return groups.filter(([, , path]) => canAccessPath(user, path)).flatMap(([resource, field, path]) => data[resource].filter((row) => String(row[field]).toLowerCase().includes(normalized)).slice(0, 2).map((row) => ({ label: row[field], type: resource, path }))).slice(0, 7)
  }, [query, data, user])
  const notifications = useMemo(() => {
    const residentName = (id) => data.residents.find((item) => Number(item.resident_id) === Number(id))?.resident_name || 'A resident'
    const amenityName = (id) => data.amenities.find((item) => Number(item.amenity_id) === Number(id))?.amenity_name || 'an amenity'
    const items = []
    if (preferences.bookings && canAccessPath(user, '/bookings')) data.bookings.filter((item) => item.booking_status === 'Pending').forEach((item) => items.push({ id: `booking-${item.booking_id}-pending`, title: 'Booking approval required', text: `${residentName(item.resident_id)} requested ${amenityName(item.amenity_id)} for ${item.booking_date}.`, path: '/bookings' }))
    if (preferences.complaints && canAccessPath(user, '/complaints')) data.complaints.filter((item) => item.complaint_status === 'Open').forEach((item) => items.push({ id: `complaint-${item.complaint_id}-open`, title: 'Complaint requires attention', text: `${item.complaint_title} · ${residentName(item.resident_id)}`, path: '/complaints' }))
    if (preferences.payments && canAccessPath(user, '/payments')) data.payments.filter((item) => ['Pending', 'Failed'].includes(item.payment_status)).forEach((item) => items.push({ id: `payment-${item.payment_id}-${item.payment_status}`, title: 'Payment requires review', text: `${item.transaction_id} is ${item.payment_status.toLowerCase()}.`, path: '/payments' }))
    if (preferences.payments && canAccessPath(user, '/maintenance')) data.maintenance.filter((item) => item.bill_status === 'Overdue').forEach((item) => items.push({ id: `maintenance-${item.bill_id}-overdue`, title: 'Maintenance bill overdue', text: `${item.bill_month} bill #${item.bill_id} remains overdue.`, path: '/maintenance' }))
    if (preferences.visitors && canAccessPath(user, '/visitors')) data.visitors.filter((item) => item.status === 'Expected').forEach((item) => items.push({ id: `visitor-${item.visitor_id}-expected`, title: 'Expected visitor', text: `${item.visitor_name} is expected for ${item.purpose}.`, path: '/visitors' }))
    if (preferences.notices && canAccessPath(user, '/notices')) data.notices.forEach((item) => items.push({ id: `notice-${item.notice_id}`, title: 'Society notice', text: item.notice_title, path: '/notices' }))
    return items
  }, [data, preferences, user])
  const unreadCount = notifications.filter((item) => !readIds.has(item.id)).length
  const saveReadIds = (nextIds) => { setReadIds(nextIds); localStorage.setItem(readKey, JSON.stringify([...nextIds])) }
  const openNotification = (notification) => { saveReadIds(new Set([...readIds, notification.id])); setPanel(''); navigate(notification.path) }
  const markAllRead = () => saveReadIds(new Set([...readIds, ...notifications.map((item) => item.id)]))
  const logout = () => { signOut(); navigate('/login') }
  const initials = user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)
  const photo = localStorage.getItem(`haven-profile-photo-${user.id}`)

  return <header className="navbar"><button className="menu-button" onClick={onMenu} aria-label="Open navigation"><Menu /></button><div className="global-search"><Search size={19} /><input value={query} onFocus={() => setPanel('search')} onChange={(event) => { setQuery(event.target.value); setPanel('search') }} placeholder="Search residents, flats, bills…" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button>}
    {panel === 'search' && query.length >= 2 && <div className="dropdown search-results">{results.length ? results.map((result, index) => <button key={`${result.type}-${index}`} onClick={() => { navigate(result.path); setPanel(''); setQuery('') }}><span>{result.label}</span><small>{result.type}</small></button>) : <div className="dropdown-empty">No matching records found</div>}</div>}</div>
    <div className="navbar-actions"><div className="dropdown-wrap"><button className="icon-button notification-button" onClick={() => setPanel(panel === 'notifications' ? '' : 'notifications')} aria-label="Notifications"><Bell size={20} />{unreadCount > 0 && <span>{unreadCount > 99 ? '99+' : unreadCount}</span>}</button>{panel === 'notifications' && <div className="dropdown notification-dropdown"><header><strong>Notifications</strong><button disabled={!unreadCount} onClick={markAllRead}>Mark all read</button></header><div className="notification-list">{notifications.length ? notifications.map((notification) => <button className="notification-item" key={notification.id} onClick={() => openNotification(notification)}><i className={readIds.has(notification.id) ? '' : 'unread'} /><span><b>{notification.title}</b><small>{notification.text}</small></span></button>) : <div className="dropdown-empty">No updates require your attention.</div>}</div></div>}</div>
      <div className="dropdown-wrap"><button className="profile-button" onClick={() => setPanel(panel === 'profile' ? '' : 'profile')}><span className="avatar">{photo ? <img src={photo} alt="" /> : initials}</span><span className="profile-copy"><b>{user.name}</b><small>{user.role}</small></span><ChevronDown size={16} /></button>{panel === 'profile' && <div className="dropdown profile-menu"><button onClick={() => { navigate('/settings'); setPanel('') }}><User size={17} />Profile</button><button onClick={() => { navigate('/settings'); setPanel('') }}><Settings size={17} />Settings</button><hr /><button onClick={logout}><LogOut size={17} />Logout</button></div>}</div>
    </div>
  </header>
}
