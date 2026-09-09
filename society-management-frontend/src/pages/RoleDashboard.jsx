import { useNavigate } from 'react-router-dom'
import { Building2, CalendarDays, CircleCheck, CreditCard, FileWarning, Megaphone, ReceiptIndianRupee, ShieldCheck, UserRoundCheck, Users, WalletCards, Wrench } from 'lucide-react'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

export default function RoleDashboard({ user, data }) {
  const navigate = useNavigate()
  const residentBills = data.maintenance.filter((item) => Number(item.flat_id) === Number(user.flat_id))
  const residentPayments = data.payments.filter((item) => Number(item.resident_id) === Number(user.resident_id))
  const residentComplaints = data.complaints.filter((item) => Number(item.resident_id) === Number(user.resident_id))
  const residentBookings = data.bookings.filter((item) => Number(item.resident_id) === Number(user.resident_id))
  const pendingBills = data.maintenance.filter((item) => item.bill_status !== 'Paid')
  const roleContent = {
    Resident: {
      subtitle: 'Your home, payments, requests, and bookings at a glance.',
      cards: [['My Flat', data.flats.find((item) => item.flat_id === user.flat_id) ? `${data.flats.find((item) => item.flat_id === user.flat_id).block_name}-${data.flats.find((item) => item.flat_id === user.flat_id).flat_number}` : '—', 'Registered residence', Building2, 'blue'], ['Amount Due', money.format(residentBills.filter((item) => item.bill_status !== 'Paid').reduce((sum, item) => sum + item.amount, 0)), `${residentBills.filter((item) => item.bill_status !== 'Paid').length} pending bills`, ReceiptIndianRupee, 'amber'], ['My Complaints', residentComplaints.length, `${residentComplaints.filter((item) => item.complaint_status !== 'Resolved').length} active`, FileWarning, 'red'], ['My Bookings', residentBookings.length, `${residentBookings.filter((item) => item.booking_status === 'Confirmed').length} confirmed`, CalendarDays, 'green']],
      actions: [['Pay maintenance', '/maintenance', CreditCard], ['Raise complaint', '/complaints', FileWarning], ['Book amenity', '/bookings', CalendarDays], ['Register visitor', '/visitors', UserRoundCheck]],
      title: 'My recent activity', records: [...residentPayments.map((item) => ({ title: `Payment ${item.transaction_id}`, detail: money.format(item.amount), status: item.payment_status })), ...residentComplaints.map((item) => ({ title: item.complaint_title, detail: item.complaint_date, status: item.complaint_status }))].slice(0, 5),
    },
    Treasurer: {
      subtitle: 'Monitor society collections, pending dues, and payment health.',
      cards: [['Total Collection', money.format(data.payments.filter((item) => item.payment_status === 'Successful').reduce((sum, item) => sum + item.amount, 0)), 'Successful payments', WalletCards, 'green'], ['Pending Dues', money.format(pendingBills.reduce((sum, item) => sum + item.amount, 0)), `${pendingBills.length} bills`, ReceiptIndianRupee, 'amber'], ['Overdue Bills', data.maintenance.filter((item) => item.bill_status === 'Overdue').length, 'Require follow-up', FileWarning, 'red'], ['Successful Payments', data.payments.filter((item) => item.payment_status === 'Successful').length, 'This billing cycle', CircleCheck, 'blue']],
      actions: [['Manage bills', '/maintenance', ReceiptIndianRupee], ['Review payments', '/payments', CreditCard], ['View residents', '/residents', Users]],
      title: 'Recent transactions', records: data.payments.slice(0, 5).map((item) => ({ title: data.residents.find((resident) => resident.resident_id === item.resident_id)?.resident_name, detail: `${item.transaction_id} · ${money.format(item.amount)}`, status: item.payment_status })),
    },
    Secretary: {
      subtitle: 'Coordinate residents, communications, visitors, and community requests.',
      cards: [['Residents', data.residents.length, 'Registered members', Users, 'blue'], ['Visitors Inside', data.visitors.filter((item) => item.status === 'Inside').length, 'Currently at society', UserRoundCheck, 'green'], ['Open Complaints', data.complaints.filter((item) => item.complaint_status === 'Open').length, 'Need assignment', FileWarning, 'red'], ['Published Notices', data.notices.length, 'Community updates', Megaphone, 'violet']],
      actions: [['Manage complaints', '/complaints', FileWarning], ['Publish notice', '/notices', Megaphone], ['Review visitors', '/visitors', UserRoundCheck], ['Manage bookings', '/bookings', CalendarDays]],
      title: 'Current complaints', records: data.complaints.slice(0, 5).map((item) => ({ title: item.complaint_title, detail: data.residents.find((resident) => resident.resident_id === item.resident_id)?.resident_name, status: item.complaint_status })),
    },
    Committee: {
      subtitle: 'A complete operational view for society committee decisions.',
      cards: [['Occupied Flats', data.flats.filter((item) => item.occupancy_status === 'Occupied').length, `${data.flats.length} total flats`, Building2, 'green'], ['Residents', data.residents.length, 'Society members', Users, 'blue'], ['Open Complaints', data.complaints.filter((item) => item.complaint_status === 'Open').length, 'Need committee review', FileWarning, 'red'], ['Upcoming Bookings', data.bookings.filter((item) => item.booking_date >= '2026-09-08').length, 'Amenity schedule', CalendarDays, 'violet']],
      actions: [['Residents', '/residents', Users], ['Complaints', '/complaints', FileWarning], ['Notices', '/notices', Megaphone], ['Amenities', '/amenities', CalendarDays]],
      title: 'Community issues', records: data.complaints.slice(0, 5).map((item) => ({ title: item.complaint_title, detail: item.complaint_date, status: item.complaint_status })),
    },
    Security: {
      subtitle: 'Manage gate movement and keep visitor records current.',
      cards: [['Visitors Today', data.visitors.filter((item) => item.entry_time.startsWith('2026-09-08')).length, 'All gate entries', UserRoundCheck, 'blue'], ['Currently Inside', data.visitors.filter((item) => item.status === 'Inside').length, 'Active entries', ShieldCheck, 'green'], ['Expected', data.visitors.filter((item) => item.status === 'Expected').length, 'Pre-approved guests', CalendarDays, 'amber'], ['Exited', data.visitors.filter((item) => item.status === 'Exited').length, 'Completed visits', CircleCheck, 'violet']],
      actions: [['Register visitor', '/visitors', UserRoundCheck], ['View notices', '/notices', Megaphone]],
      title: 'Gate activity', records: data.visitors.slice(0, 5).map((item) => ({ title: item.visitor_name, detail: `${item.purpose} · Flat ${data.flats.find((flat) => flat.flat_id === item.flat_id)?.block_name}-${data.flats.find((flat) => flat.flat_id === item.flat_id)?.flat_number}`, status: item.status })),
    },
    Housekeeping: {
      subtitle: 'Stay current with society announcements and daily responsibilities.',
      cards: [['Staff Profile', user.name, 'Housekeeping team', Users, 'blue'], ['Active Notices', data.notices.length, 'Society announcements', Megaphone, 'violet'], ['Available Amenities', data.amenities.filter((item) => item.availability_status === 'Available').length, 'Shared spaces', CircleCheck, 'green'], ['Society Blocks', new Set(data.flats.map((item) => item.block_name)).size, 'Service coverage', Building2, 'amber']],
      actions: [['Read notices', '/notices', Megaphone], ['My settings', '/settings', Users]],
      title: 'Latest notices', records: data.notices.slice(0, 5).map((item) => ({ title: item.notice_title, detail: item.notice_date, status: 'Published' })),
    },
    'Maintenance Staff': {
      subtitle: 'Track assigned society issues and update resolution progress.',
      cards: [['Open Issues', data.complaints.filter((item) => item.complaint_status === 'Open').length, 'Awaiting work', Wrench, 'red'], ['In Progress', data.complaints.filter((item) => item.complaint_status === 'In Progress').length, 'Currently assigned', FileWarning, 'amber'], ['Resolved', data.complaints.filter((item) => item.complaint_status === 'Resolved').length, 'Completed issues', CircleCheck, 'green'], ['Notices', data.notices.length, 'Operational updates', Megaphone, 'blue']],
      actions: [['Update complaints', '/complaints', Wrench], ['Read notices', '/notices', Megaphone]],
      title: 'Maintenance queue', records: data.complaints.slice(0, 5).map((item) => ({ title: item.complaint_title, detail: item.complaint_description, status: item.complaint_status })),
    },
  }[user.role]

  if (!roleContent) return null
  return <div className="page-stack role-dashboard">
    <header className="welcome"><div><span className="eyebrow">{user.role} workspace</span><h1>Good morning, {user.name.split(' ')[0]}</h1><p>{roleContent.subtitle}</p></div><span className="role-badge">{user.role}</span></header>
    <div className="mini-stats">{roleContent.cards.map(([label, value, detail, icon, tone]) => <StatCard key={label} label={label} value={value} detail={detail} icon={icon} tone={tone} />)}</div>
    <div className="role-dashboard-grid"><section className="panel role-actions"><header><div><h2>Quick actions</h2><p>Tools available for your role</p></div></header><div>{roleContent.actions.map(([label, path, Icon]) => <button key={label} onClick={() => navigate(path)}><span><Icon size={19} /></span><b>{label}</b></button>)}</div></section>
      <section className="panel"><header><div><h2>{roleContent.title}</h2><p>Latest relevant records</p></div></header><div className="role-records">{roleContent.records.length ? roleContent.records.map((record, index) => <div key={`${record.title}-${index}`}><span><b>{record.title}</b><small>{record.detail}</small></span><StatusBadge value={record.status} /></div>) : <p className="role-empty">No records to show yet.</p>}</div></section></div>
  </div>
}
