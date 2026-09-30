import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, User, X } from 'lucide-react'
import { useApp } from '../context/AppStateContext'
import { getCurrentUser, signOut } from '../services/auth'
import { canAccessPath } from '../config/permissions'

export default function Navbar({ onMenu }) {
  const { data } = useApp()
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [query, setQuery] = useState('')
  const [panel, setPanel] = useState('')
  const results = useMemo(() => {
    if (query.length < 2) return []
    const normalized = query.toLowerCase()
    const groups = [
      ['residents', 'resident_name', '/residents'], ['flats', 'flat_number', '/flats'], ['visitors', 'visitor_name', '/visitors'],
      ['complaints', 'complaint_title', '/complaints'], ['maintenance', 'bill_month', '/maintenance'], ['notices', 'notice_title', '/notices'],
    ]
    return groups.filter(([, , path]) => canAccessPath(user, path)).flatMap(([resource, field, path]) => data[resource].filter((row) => String(row[field]).toLowerCase().includes(normalized)).slice(0, 2).map((row) => ({ label: row[field], type: resource, path }))).slice(0, 7)
  }, [query, data, user])
  const logout = () => { signOut(); navigate('/login') }
  const initials = user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)

  return <header className="navbar"><button className="menu-button" onClick={onMenu} aria-label="Open navigation"><Menu /></button><div className="global-search"><Search size={19} /><input value={query} onFocus={() => setPanel('search')} onChange={(event) => { setQuery(event.target.value); setPanel('search') }} placeholder="Search residents, flats, bills…" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button>}
    {panel === 'search' && query.length >= 2 && <div className="dropdown search-results">{results.length ? results.map((result, index) => <button key={`${result.type}-${index}`} onClick={() => { navigate(result.path); setPanel(''); setQuery('') }}><span>{result.label}</span><small>{result.type}</small></button>) : <div className="dropdown-empty">No matching records found</div>}</div>}</div>
    <div className="navbar-actions"><div className="dropdown-wrap"><button className="icon-button notification-button" onClick={() => setPanel(panel === 'notifications' ? '' : 'notifications')} aria-label="Notifications"><Bell size={20} /><span>3</span></button>{panel === 'notifications' && <div className="dropdown notification-dropdown"><header><strong>Notifications</strong><button>Mark all read</button></header>{[['New complaint', 'Lift issue reported by Rahul Kumar', '2m'], ['Payment pending', 'Flat A-102 payment is pending', '18m'], ['Visitor entry', 'Amit Sharma entered Flat A-101', '32m'], ['Notice published', 'Water supply maintenance', '2h']].map(([title, text, time], index) => <button className="notification-item" key={title}><i className={index < 3 ? 'unread' : ''} /><span><b>{title}</b><small>{text}</small></span><time>{time}</time></button>)}</div>}</div>
      <div className="dropdown-wrap"><button className="profile-button" onClick={() => setPanel(panel === 'profile' ? '' : 'profile')}><span className="avatar">{initials}</span><span className="profile-copy"><b>{user.name}</b><small>{user.role}</small></span><ChevronDown size={16} /></button>{panel === 'profile' && <div className="dropdown profile-menu"><button onClick={() => navigate('/settings')}><User size={17} />Profile</button><button onClick={() => navigate('/settings')}><Settings size={17} />Settings</button><hr /><button onClick={logout}><LogOut size={17} />Logout</button></div>}</div>
    </div>
  </header>
}
