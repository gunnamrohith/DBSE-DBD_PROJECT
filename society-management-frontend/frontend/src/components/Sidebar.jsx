import { NavLink } from 'react-router-dom'
import { Building2, LayoutDashboard, Users, UserRoundCheck, ShieldCheck, ReceiptIndianRupee, CreditCard, MessageSquareWarning, Megaphone, Dumbbell, CalendarDays, Settings, X } from 'lucide-react'
import { getCurrentUser } from '../services/auth'
import { canAccessPath } from '../config/permissions'

const groups = [
  { label: 'Overview', items: [['/', 'Dashboard', LayoutDashboard]] },
  { label: 'Society', items: [['/flats', 'Flats', Building2], ['/residents', 'Residents', Users], ['/staff', 'Staff', ShieldCheck]] },
  { label: 'Gate', items: [['/visitors', 'Visitors', UserRoundCheck]] },
  { label: 'Finance', items: [['/maintenance', 'Maintenance', ReceiptIndianRupee], ['/payments', 'Payments', CreditCard]] },
  { label: 'Community', items: [['/complaints', 'Complaints', MessageSquareWarning], ['/notices', 'Notices', Megaphone], ['/amenities', 'Amenities', Dumbbell], ['/bookings', 'Bookings', CalendarDays]] },
]

export default function Sidebar({ open, onClose }) {
  const user = getCurrentUser()
  const visibleGroups = groups.map((group) => ({ ...group, items: group.items.filter(([path]) => canAccessPath(user, path)) })).filter((group) => group.items.length)
  return <><aside className={`sidebar ${open ? 'open' : ''}`}><div className="brand"><span className="brand-mark"><Building2 size={24} /></span><div><strong>Haven</strong><small>Society OS</small></div><button className="sidebar-close" onClick={onClose} aria-label="Close navigation"><X /></button></div>
    <nav>{visibleGroups.map((group) => <div className="nav-group" key={group.label}><span>{group.label}</span>{group.items.map(([path, label, Icon]) => <NavLink key={path} to={path} end={path === '/'} onClick={onClose}><Icon size={19} />{label}</NavLink>)}</div>)}
      <div className="nav-group settings-link"><span>Account</span><NavLink to="/settings" onClick={onClose}><Settings size={19} />Settings</NavLink></div>
    </nav><div className="sidebar-community"><span>{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div><strong>{user.name}</strong><small>{user.role}</small></div></div></aside>{open && <button className="sidebar-overlay" onClick={onClose} aria-label="Close navigation" />}</>
}
