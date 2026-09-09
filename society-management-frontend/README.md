# Haven Society Management

A responsive React and Vite frontend for the `society_management` MySQL schema. It includes dashboard analytics, reusable CRUD interfaces, relationship-aware forms, global search, notifications, profile settings, and frontend-only demo authentication.

## Run locally

```bash
npm install
npm run dev
```

Build and lint before deployment:

```bash
npm run build
npm run lint
```

The login page includes a Demo Role selector that fills the matching credentials automatically.

| Role | Person | Email | Password | Primary access |
| --- | --- | --- | --- | --- |
| Admin | Admin User | `admin@havenwoods.in` | `admin123` | All modules and actions |
| Committee | Vikram Singh | `vikram@example.com` | `demo123` | Society operations and community management |
| Treasurer | Nisha Patel | `nisha@example.com` | `demo123` | Flats, residents, maintenance, and payments |
| Secretary | Isha Verma | `isha@example.com` | `demo123` | Residents, visitors, complaints, notices, amenities, and bookings |
| Resident | Rahul Kumar | `rahul@gmail.com` | `rahul123` | Records belonging to Rahul or Flat A-101 |
| Security | Mahesh Yadav | `security@havenwoods.in` | `security123` | Visitor management and notices |
| Housekeeping | Lata Pawar | `housekeeping@havenwoods.in` | `staff123` | Staff dashboard and notices |
| Maintenance Staff | Ganesh More | `maintenance@havenwoods.in` | `staff123` | Complaint resolution and notices |

Authentication and data persistence are browser-only demonstrations and are not production security features.

Role permissions are centralized in `src/config/permissions.js`, while demo identities and sessions are handled by `src/services/auth.js`. A real backend must re-check every permission server-side; hidden navigation alone is not authorization.

## Architecture

- `src/components`: shared navigation, tables, forms, modals, badges, stat cards, toasts, and route protection.
- `src/pages`: dashboard plus Flats, Residents, Visitors, Staff, Maintenance, Payments, Complaints, Notices, Amenities, Bookings, Login, and Settings pages.
- `src/config/resources.js`: declarative fields, columns, filters, and summary-card definitions for reusable CRUD pages.
- `src/data/mockData.js`: realistic records matching the MySQL columns and foreign-key relationships.
- `src/services/api.js`: asynchronous in-memory CRUD service. Replace these methods with HTTP requests when a backend is available.
- `src/context`: application state that consumes the service layer and exposes mutations to the UI.

## Database mapping

| Route | MySQL table |
| --- | --- |
| `/flats` | `flats` |
| `/residents` | `residents` |
| `/visitors` | `visitors` |
| `/staff` | `staff` |
| `/maintenance` | `maintenance_bills` |
| `/payments` | `payments` |
| `/complaints` | `complaints` |
| `/notices` | `notices` |
| `/amenities` | `amenities` |
| `/bookings` | `amenity_bookings` |

