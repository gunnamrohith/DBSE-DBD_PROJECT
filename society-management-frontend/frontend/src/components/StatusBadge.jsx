const tones = {
  Occupied: 'success', Paid: 'success', Successful: 'success', Resolved: 'success', Exited: 'success', Available: 'success', Confirmed: 'success', Completed: 'success', Owner: 'info',
  Pending: 'warning', Expected: 'warning', 'In Progress': 'info', Inside: 'info', Tenant: 'neutral', Vacant: 'neutral', Maintenance: 'warning', Overdue: 'danger', Failed: 'danger', Open: 'danger', Cancelled: 'danger',
}

export default function StatusBadge({ value }) {
  return <span className={`badge badge-${tones[value] || 'neutral'}`}><span className="badge-dot" />{value || 'Not set'}</span>
}
