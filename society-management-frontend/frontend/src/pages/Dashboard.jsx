import { Building2, Users, ReceiptIndianRupee, MessageSquareWarning, UserRoundCheck, Home, ArrowUpRight, CreditCard, Megaphone } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppStateContext'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { getCurrentUser } from '../services/auth'
import RoleDashboard from './RoleDashboard'

const COLORS = ['#3157d5', '#dce2ee']
const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

export default function Dashboard() {
  const navigate = useNavigate()
  const { data, loading } = useApp()
  if (loading) return <div className="dashboard-skeleton"><span /><span /><span /><span /></div>
  const user = getCurrentUser()
  if (user.role !== 'Admin') return <RoleDashboard user={user} data={data} />
  const occupied = data.flats.filter((item) => item.occupancy_status === 'Occupied').length
  const pending = data.maintenance.filter((item) => item.bill_status !== 'Paid')
  const summary = [
    ['Total Flats', data.flats.length, '+2 this quarter', Building2, 'blue'], ['Occupied Flats', occupied, `${Math.round(occupied / data.flats.length * 100)}% occupancy`, Home, 'green'],
    ['Total Residents', data.residents.length, 'Across 3 blocks', Users, 'violet'], ['Pending Maintenance', money.format(pending.reduce((sum, item) => sum + item.amount, 0)), `${pending.length} flats pending`, ReceiptIndianRupee, 'amber'],
    ['Open Complaints', data.complaints.filter((item) => item.complaint_status === 'Open').length, '2 need attention', MessageSquareWarning, 'red'], ['Active Visitors', data.visitors.filter((item) => item.status === 'Inside').length, 'Currently inside', UserRoundCheck, 'cyan'],
  ]
  const occupancy = [{ name: 'Occupied', value: occupied }, { name: 'Vacant', value: data.flats.length - occupied }]
  const maintenance = ['Paid', 'Pending', 'Overdue'].map((name) => ({ name, value: data.maintenance.filter((item) => item.bill_status === name).length }))
  const complaints = ['Open', 'In Progress', 'Resolved'].map((name) => ({ name, value: data.complaints.filter((item) => item.complaint_status === name).length }))

  return <div className="page-stack dashboard"><header className="welcome"><div><span className="eyebrow">Tuesday, September 8</span><h1>Good morning, {user.name.split(' ')[0]}</h1><p>Here’s what’s happening in your society today.</p></div><button className="button secondary" onClick={() => navigate('/maintenance')}><ArrowUpRight size={17} />View monthly report</button></header>
    <div className="dashboard-stats">{summary.map(([label, value, detail, icon, tone]) => <StatCard key={label} label={label} value={value} detail={detail} icon={icon} tone={tone} />)}</div>
    <div className="dashboard-grid two"><section className="panel"><header><div><h2>Occupancy overview</h2><p>Current flat utilization</p></div><span className="panel-chip">{occupied}/{data.flats.length} occupied</span></header><div className="donut-wrap"><ResponsiveContainer width="55%" height={230}><PieChart><Pie data={occupancy} innerRadius={70} outerRadius={92} paddingAngle={3} dataKey="value">{occupancy.map((entry, index) => <Cell key={entry.name} fill={COLORS[index]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="donut-legend">{occupancy.map((item, index) => <div key={item.name}><i style={{ background: COLORS[index] }} /><span>{item.name}<b>{item.value}</b></span></div>)}</div></div></section>
      <section className="panel"><header><div><h2>Maintenance overview</h2><p>September billing status</p></div><button onClick={() => navigate('/maintenance')}>View all</button></header><ResponsiveContainer width="100%" height={230}><BarChart data={maintenance} margin={{ top: 20, right: 8, left: -22, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f6" /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} allowDecimals={false} /><Tooltip cursor={{ fill: '#f5f7fb' }} /><Bar dataKey="value" fill="#3157d5" radius={[5, 5, 0, 0]} barSize={42} /></BarChart></ResponsiveContainer></section></div>
    <div className="dashboard-grid lower"><section className="panel"><header><div><h2>Complaint status</h2><p>Resolution progress</p></div><span className="panel-chip">{data.complaints.length} total</span></header><ResponsiveContainer width="100%" height={220}><BarChart data={complaints} layout="vertical" margin={{ top: 14, right: 20, left: 10, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#edf0f6" /><XAxis type="number" hide /><YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={80} /><Tooltip /><Bar dataKey="value" fill="#17a673" radius={[0, 5, 5, 0]} barSize={18} /></BarChart></ResponsiveContainer></section>
      <section className="panel activity-panel"><header><div><h2>Recent activity</h2><p>Latest society updates</p></div></header><div className="activity-list">{[[CreditCard, 'Rahul Kumar paid maintenance bill', '2 minutes ago', 'green'], [UserRoundCheck, 'Visitor entered Flat A-101', '15 minutes ago', 'blue'], [MessageSquareWarning, 'New complaint submitted', '1 hour ago', 'amber'], [Megaphone, 'New notice published', '2 hours ago', 'violet']].map(([Icon, text, time, tone]) => <div className="activity" key={text}><span className={`activity-icon tone-${tone}`}><Icon size={17} /></span><div><b>{text}</b><small>{time}</small></div></div>)}</div></section></div>
    <div className="dashboard-grid two tables"><section className="panel"><header><div><h2>Recent visitors</h2><p>Today’s gate activity</p></div></header><div className="compact-list">{data.visitors.slice(0, 4).map((visitor) => <div key={visitor.visitor_id}><span className="avatar small">{visitor.visitor_name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span><b>{visitor.visitor_name}</b><small>{data.flats.find((flat) => flat.flat_id === visitor.flat_id)?.block_name}-{data.flats.find((flat) => flat.flat_id === visitor.flat_id)?.flat_number} · {visitor.purpose}</small></span><StatusBadge value={visitor.status} /></div>)}</div></section>
      <section className="panel"><header><div><h2>Recent payments</h2><p>Latest transactions</p></div></header><div className="compact-list">{data.payments.slice(0, 4).map((payment) => <div key={payment.payment_id}><span className="payment-symbol">₹</span><span><b>{data.residents.find((resident) => resident.resident_id === payment.resident_id)?.resident_name}</b><small>{payment.transaction_id}</small></span><span className="payment-value"><b>{money.format(payment.amount)}</b><StatusBadge value={payment.payment_status} /></span></div>)}</div></section></div>
  </div>
}
