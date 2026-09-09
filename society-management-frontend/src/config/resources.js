const select = (options) => options.map((value) => ({ value, label: value }))

export const resourceConfig = {
  flats: {
    title: 'Flats', subtitle: 'Manage apartments and occupancy information.', idField: 'flat_id', itemName: 'Flat',
    columns: [['flat_id', 'Flat ID'], ['flat_number', 'Flat Number'], ['block_name', 'Block'], ['floor_number', 'Floor'], ['flat_type', 'Type'], ['occupancy_status', 'Occupancy', 'badge']],
    fields: [
      { name: 'flat_number', label: 'Flat Number', placeholder: 'e.g. 101', required: true },
      { name: 'block_name', label: 'Block', placeholder: 'e.g. A', required: true },
      { name: 'floor_number', label: 'Floor', type: 'number', required: true },
      { name: 'flat_type', label: 'Flat Type', type: 'select', options: select(['1BHK', '2BHK', '3BHK', '4BHK']), required: true },
      { name: 'occupancy_status', label: 'Occupancy', type: 'select', options: select(['Occupied', 'Vacant']), required: true },
    ], filters: ['block_name', 'floor_number', 'occupancy_status'],
  },
  residents: {
    title: 'Residents', subtitle: 'Manage society residents and their apartment information.', idField: 'resident_id', itemName: 'Resident', avatar: true,
    columns: [['resident_name', 'Resident'], ['email', 'Email'], ['phone', 'Phone'], ['flat_id', 'Flat', 'flat'], ['resident_type', 'Type', 'badge'], ['role', 'Role']],
    fields: [
      { name: 'resident_name', label: 'Name', required: true, placeholder: 'Full name' }, { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'tel', required: true, pattern: '[0-9]{10,15}' }, { name: 'password', label: 'Password', type: 'password', required: true },
      { name: 'role', label: 'Role', type: 'select', options: select(['Resident', 'Committee', 'Treasurer', 'Secretary']), required: true },
      { name: 'resident_type', label: 'Resident Type', type: 'select', options: select(['Owner', 'Tenant']), required: true },
      { name: 'flat_id', label: 'Flat', type: 'flat', required: true },
    ], stats: [['Total residents', 'all'], ['Owners', 'Owner'], ['Tenants', 'Tenant'], ['Active residents', 'all']], statusField: 'resident_type',
  },
  visitors: {
    title: 'Visitors', subtitle: 'Track guests, deliveries, and entries at the gate.', idField: 'visitor_id', itemName: 'Visitor',
    columns: [['visitor_name', 'Visitor'], ['phone', 'Phone'], ['purpose', 'Purpose'], ['flat_id', 'Flat', 'flat'], ['entry_time', 'Entry Time', 'datetime'], ['exit_time', 'Exit Time', 'datetime'], ['status', 'Status', 'badge']],
    fields: [{ name: 'visitor_name', label: 'Visitor Name', required: true }, { name: 'phone', label: 'Phone', type: 'tel', required: true }, { name: 'purpose', label: 'Purpose', required: true }, { name: 'flat_id', label: 'Flat', type: 'flat', required: true }, { name: 'entry_time', label: 'Entry Time', type: 'datetime-local', required: true }, { name: 'exit_time', label: 'Exit Time', type: 'datetime-local' }, { name: 'status', label: 'Status', type: 'select', options: select(['Inside', 'Exited', 'Expected']), required: true }],
    stats: [['Visitors Today', 'all'], ['Currently Inside', 'Inside'], ['Expected Visitors', 'Expected'], ['Completed Visits', 'Exited']], statusField: 'status',
  },
  staff: {
    title: 'Staff', subtitle: 'Manage society employees and service personnel.', idField: 'staff_id', itemName: 'Staff member',
    columns: [['staff_id', 'Staff ID'], ['staff_name', 'Name'], ['phone', 'Phone'], ['staff_type', 'Staff Type', 'badge'], ['address', 'Address']],
    fields: [{ name: 'staff_name', label: 'Staff Name', required: true }, { name: 'phone', label: 'Phone', type: 'tel', required: true }, { name: 'staff_type', label: 'Staff Type', type: 'select', options: select(['Security', 'Housekeeping', 'Maintenance', 'Gardener']), required: true }, { name: 'address', label: 'Address', type: 'textarea', required: true }],
    stats: [['Total Staff', 'all'], ['Security', 'Security'], ['Housekeeping', 'Housekeeping'], ['Maintenance', 'Maintenance']], statusField: 'staff_type',
  },
  maintenance: {
    title: 'Maintenance', subtitle: 'Track monthly bills and outstanding society dues.', idField: 'bill_id', itemName: 'Bill',
    columns: [['bill_id', 'Bill ID'], ['flat_id', 'Flat', 'flat'], ['bill_month', 'Month'], ['amount', 'Amount', 'currency'], ['due_date', 'Due Date', 'date'], ['bill_status', 'Status', 'badge']],
    fields: [{ name: 'flat_id', label: 'Flat', type: 'flat', required: true }, { name: 'bill_month', label: 'Bill Month', required: true, placeholder: 'September 2026' }, { name: 'amount', label: 'Amount', type: 'number', required: true }, { name: 'due_date', label: 'Due Date', type: 'date', required: true }, { name: 'bill_status', label: 'Status', type: 'select', options: select(['Paid', 'Pending', 'Overdue']), required: true }],
    stats: [['Total Bills', 'all'], ['Paid', 'Paid'], ['Pending', 'Pending'], ['Overdue', 'Overdue']], statusField: 'bill_status',
  },
  payments: {
    title: 'Payments', subtitle: 'Review collections and payment transaction status.', idField: 'payment_id', itemName: 'Payment',
    columns: [['payment_id', 'Payment ID'], ['resident_id', 'Resident', 'resident'], ['bill_id', 'Bill ID'], ['payment_date', 'Payment Date', 'date'], ['amount', 'Amount', 'currency'], ['payment_method', 'Method'], ['transaction_id', 'Transaction ID'], ['payment_status', 'Status', 'badge']],
    fields: [{ name: 'bill_id', label: 'Bill', type: 'bill', required: true }, { name: 'resident_id', label: 'Resident', type: 'resident', required: true }, { name: 'payment_date', label: 'Payment Date', type: 'date', required: true }, { name: 'amount', label: 'Amount', type: 'number', required: true }, { name: 'payment_method', label: 'Payment Method', type: 'select', options: select(['UPI', 'Card', 'Net Banking', 'Cheque']), required: true }, { name: 'transaction_id', label: 'Transaction ID', required: true }, { name: 'payment_status', label: 'Status', type: 'select', options: select(['Successful', 'Pending', 'Failed']), required: true }],
    stats: [['Total Collection', 'sum'], ['Successful Payments', 'Successful'], ['Pending Payments', 'Pending'], ['Failed Payments', 'Failed']], statusField: 'payment_status',
  },
  complaints: {
    title: 'Complaints', subtitle: 'Resolve resident concerns and service requests.', idField: 'complaint_id', itemName: 'Complaint', detail: true,
    columns: [['complaint_id', 'Complaint ID'], ['resident_id', 'Resident', 'resident'], ['complaint_title', 'Title'], ['complaint_description', 'Description', 'truncate'], ['complaint_date', 'Date', 'date'], ['complaint_status', 'Status', 'badge']],
    fields: [{ name: 'resident_id', label: 'Resident', type: 'resident', required: true }, { name: 'complaint_title', label: 'Complaint Title', required: true }, { name: 'complaint_description', label: 'Description', type: 'textarea', required: true }, { name: 'complaint_date', label: 'Date', type: 'date', required: true }, { name: 'complaint_status', label: 'Status', type: 'select', options: select(['Open', 'In Progress', 'Resolved']), required: true }],
    stats: [['Total Complaints', 'all'], ['Open', 'Open'], ['In Progress', 'In Progress'], ['Resolved', 'Resolved']], statusField: 'complaint_status',
  },
  bookings: {
    title: 'Amenity Bookings', subtitle: 'Manage reservations across shared society spaces.', idField: 'booking_id', itemName: 'Booking',
    columns: [['booking_id', 'Booking ID'], ['resident_id', 'Resident', 'resident'], ['amenity_id', 'Amenity', 'amenity'], ['booking_date', 'Booking Date', 'date'], ['start_time', 'Start Time'], ['end_time', 'End Time'], ['booking_status', 'Status', 'badge']],
    fields: [{ name: 'resident_id', label: 'Resident', type: 'resident', required: true }, { name: 'amenity_id', label: 'Amenity', type: 'amenity', required: true }, { name: 'booking_date', label: 'Booking Date', type: 'date', required: true }, { name: 'start_time', label: 'Start Time', type: 'time', required: true }, { name: 'end_time', label: 'End Time', type: 'time', required: true }, { name: 'booking_status', label: 'Status', type: 'select', options: select(['Confirmed', 'Pending', 'Completed', 'Cancelled']), required: true }],
    stats: [["Today's Bookings", 'today'], ['Upcoming', 'upcoming'], ['Completed', 'Completed'], ['Cancelled', 'Cancelled']], statusField: 'booking_status',
  },
}
