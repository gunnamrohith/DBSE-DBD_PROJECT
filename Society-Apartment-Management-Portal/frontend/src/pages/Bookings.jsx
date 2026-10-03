import { useMemo, useState } from 'react'
import { CalendarDays, Check, Clock3, Plus, Search, TriangleAlert, X } from 'lucide-react'
import Modal from '../components/Modal'
import RecordForm from '../components/RecordForm'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { useApp } from '../context/AppStateContext'
import { canCreateResource, scopeRecords } from '../config/permissions'
import { resourceConfig } from '../config/resources'
import { getCurrentUser } from '../services/auth'

const dateFormatter = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const shortDateFormatter = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' })
const localDate = () => {
	const now = new Date()
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}
const formatTime = (value) => String(value || '').slice(0, 5)

export default function Bookings() {
	const user = getCurrentUser()
	const { data, loading, addRecord, updateRecord } = useApp()
	const [creating, setCreating] = useState(false)
	const [query, setQuery] = useState('')
	const [status, setStatus] = useState('All')
	const [busyId, setBusyId] = useState(null)
	const [actionError, setActionError] = useState('')
	const today = localDate()
	const isAdmin = user.role === 'Admin'
	const scopedBookings = useMemo(() => scopeRecords(user, 'bookings', data.bookings), [data.bookings, user])

	const amenityName = (booking) => data.amenities.find((item) => Number(item.amenity_id) === Number(booking.amenity_id))?.amenity_name || 'Unknown amenity'
	const resident = (booking) => data.residents.find((item) => Number(item.resident_id) === Number(booking.resident_id))
	const flatLabel = (booking) => {
		const flat = data.flats.find((item) => Number(item.flat_id) === Number(resident(booking)?.flat_id))
		return flat ? `${flat.block_name}-${flat.flat_number}` : 'Flat not assigned'
	}
	const conflictFor = (booking) => data.bookings.find((item) =>
		Number(item.booking_id) !== Number(booking.booking_id) &&
		Number(item.amenity_id) === Number(booking.amenity_id) &&
		item.booking_date === booking.booking_date &&
		item.booking_status === 'Confirmed' &&
		item.start_time < booking.end_time && item.end_time > booking.start_time,
	)

	const visibleBookings = scopedBookings.filter((booking) => {
		const searchText = `${amenityName(booking)} ${resident(booking)?.resident_name || ''} ${flatLabel(booking)}`.toLowerCase()
		return (status === 'All' || booking.booking_status === status) && searchText.includes(query.toLowerCase())
	}).sort((left, right) => left.booking_date.localeCompare(right.booking_date) || left.start_time.localeCompare(right.start_time))

	const groupedBookings = Object.entries(visibleBookings.reduce((groups, booking) => ({ ...groups, [booking.booking_date]: [...(groups[booking.booking_date] || []), booking] }), {}))
	const formFields = resourceConfig.bookings.fields.filter((field) => field.name !== 'booking_status' && (user.role !== 'Resident' || field.name !== 'resident_id')).map((field) => field.name === 'booking_date' ? { ...field, min: today } : field)

	const submitRequest = async (values) => {
		setActionError('')
		const request = Object.fromEntries(Object.entries({ ...values, ...(user.role === 'Resident' ? { resident_id: user.resident_id } : {}) }).map(([key, value]) => key.endsWith('_id') ? [key, Number(value)] : [key, value]))
		try {
			await addRecord('bookings', request)
			setCreating(false)
		} catch (error) {
			setActionError(error.message)
		}
	}

	const decide = async (booking, bookingStatus) => {
		setBusyId(booking.booking_id)
		setActionError('')
		try {
			await updateRecord('bookings', booking.booking_id, { booking_status: bookingStatus }, 'booking_id')
		} catch (error) {
			setActionError(error.message)
		} finally {
			setBusyId(null)
		}
	}

	if (loading) return <div className="loading-state"><span className="spinner" />Loading booking schedule…</div>

	const pending = scopedBookings.filter((booking) => booking.booking_status === 'Pending').length
	const confirmed = scopedBookings.filter((booking) => booking.booking_status === 'Confirmed' && booking.booking_date >= today).length
	const todayCount = scopedBookings.filter((booking) => booking.booking_date === today).length
	const cancelled = scopedBookings.filter((booking) => booking.booking_status === 'Cancelled').length

	return <div className="page-stack booking-page">
		<header className="page-header"><div><span className="eyebrow">Request and approval workflow</span><h1>Amenity Bookings</h1><p>{isAdmin ? 'Review resident requests and protect the schedule from overlapping reservations.' : 'Request a time slot and track its approval status.'}</p></div>{canCreateResource(user, 'bookings') && <button className="button primary" onClick={() => { setActionError(''); setCreating(true) }}><Plus size={18} />Request a booking</button>}</header>

		<div className="mini-stats">
			<StatCard label="Pending review" value={pending} detail={isAdmin ? 'Needs admin decision' : 'Awaiting admin'} icon={Clock3} tone="amber" />
			<StatCard label="Upcoming confirmed" value={confirmed} detail="Approved reservations" icon={Check} tone="green" />
			<StatCard label="Scheduled today" value={todayCount} detail={shortDateFormatter.format(new Date(`${today}T00:00:00`))} icon={CalendarDays} tone="blue" />
			<StatCard label="Declined / cancelled" value={cancelled} detail="Not reserved" icon={X} tone="red" />
		</div>

		{actionError && <div className="booking-alert" role="alert"><TriangleAlert size={18} /><span><b>Booking could not be updated</b>{actionError}</span></div>}

		<section className="toolbar booking-toolbar"><label className="search-control"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search amenity, resident or flat…" /></label><div className="booking-status-filter">{['All', 'Pending', 'Confirmed', 'Cancelled'].map((value) => <button className={status === value ? 'active' : ''} key={value} onClick={() => setStatus(value)}>{value === 'Cancelled' ? 'Declined' : value}</button>)}</div></section>

		<div className="booking-schedule">
			{groupedBookings.length ? groupedBookings.map(([date, bookings]) => <section className="booking-day" key={date}>
				<header><div className="booking-date"><CalendarDays size={18} /><span><b>{date === today ? 'Today' : dateFormatter.format(new Date(`${date}T00:00:00`))}</b><small>{bookings.length} {bookings.length === 1 ? 'request' : 'requests'}</small></span></div></header>
				<div className="booking-list">{bookings.map((booking) => {
					const bookingResident = resident(booking)
					const conflict = booking.booking_status === 'Pending' ? conflictFor(booking) : null
					return <article className="booking-row" key={booking.booking_id}>
						<div className="booking-time"><Clock3 size={16} /><b>{formatTime(booking.start_time)}</b><span>to</span><b>{formatTime(booking.end_time)}</b></div>
						<div className="booking-main"><b>{amenityName(booking)}</b><span>{bookingResident?.resident_name || 'Unknown resident'} · {flatLabel(booking)}</span>{conflict && <small className="booking-conflict"><TriangleAlert size={13} />Clashes with confirmed booking #{conflict.booking_id}, {formatTime(conflict.start_time)}–{formatTime(conflict.end_time)}</small>}</div>
						<StatusBadge value={booking.booking_status} />
						{isAdmin && booking.booking_status === 'Pending' && <div className="booking-actions"><button className="button secondary booking-decline" disabled={busyId === booking.booking_id} onClick={() => decide(booking, 'Cancelled')}><X size={15} />Decline</button><button className="button primary" disabled={busyId === booking.booking_id || Boolean(conflict)} title={conflict ? 'Resolve the conflicting confirmed booking first' : 'Approve booking'} onClick={() => decide(booking, 'Confirmed')}><Check size={15} />Approve</button></div>}
					</article>
				})}</div>
			</section>) : <div className="panel empty-state"><CalendarDays size={28} /><h3>No booking requests found</h3><p>Change the filters or request a new time slot.</p></div>}
		</div>

		{creating && <Modal title="Request an amenity booking" onClose={() => setCreating(false)}><RecordForm fields={formFields} onCancel={() => setCreating(false)} onSubmit={submitRequest} submitLabel="Send for approval" /></Modal>}
	</div>
}
