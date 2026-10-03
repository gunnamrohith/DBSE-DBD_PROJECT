# Haven Society Management

A full-stack DBMS project using React, Express, and MySQL. It includes JWT authentication, bcrypt password hashing, server-side role authorization, dashboard analytics, reusable CRUD interfaces, relational forms, and persistent database records.

## Run locally

1. Create the database. MySQL prompts for the password directly:

```bash
mysql -u root -p < backend/sql/schema.sql
mysql -u root -p < backend/sql/seed.sql
mysql -u root -p < backend/sql/expand_society_directory.sql
```

2. Create local configuration and set `DB_PASSWORD` and `JWT_SECRET` in `.env`:

```bash
cp .env.example .env
```

3. Start the API and frontend in separate terminals:

```bash
npm install
npm run dev:server
```

```bash
npm run dev
```

Open `http://localhost:5174`. Port `5174` is reserved for this project. The API health endpoint is `http://localhost:3001/api/health`.

Build and lint before deployment:

```bash
npm run build
npm run lint
```

The login page includes a Demo Role selector that fills the matching credentials automatically.

The Role selector filters Block and Member selectors. Resident-based choices include their linked block and flat, and selecting any member fills that account's saved demo credentials. Fresh databases receive the base records through `seed.sql` and the full directory through `expand_society_directory.sql`. For an existing database, apply the account expansions once:

```bash
mysql -u root -p < backend/sql/expand_demo_accounts.sql
mysql -u root -p < backend/sql/expand_society_directory.sql
```

The login directory is loaded from MySQL through `GET /api/auth/accounts`. Blocks A, B, and C each contain 15 resident-based accounts: 10 residents, 3 committee members, and 2 secretaries.

| Role | Person | Email | Password | Primary access |
| --- | --- | --- | --- | --- |
| Admin | Admin User | `admin@havenwoods.in` | `admin123` | All modules and actions |
| Committee | Vikram Singh | `vikram@example.com` | `demo123` | Society operations and community management |
| Secretary | Isha Verma | `isha@example.com` | `demo123` | Residents, visitors, complaints, notices, amenities, and bookings |
| Resident | Rahul Kumar | `rahul@gmail.com` | `rahul123` | Records belonging to Rahul or Flat A-101 |
| Security | Mahesh Yadav | `security@havenwoods.in` | `security123` | Visitor management and notices |
| Housekeeping | Lata Pawar | `housekeeping@havenwoods.in` | `staff123` | Staff dashboard and notices |
| Maintenance Staff | Ganesh More | `maintenance@havenwoods.in` | `staff123` | Complaint resolution and notices |

The browser sends credentials to `POST /api/auth/login`. Express checks the bcrypt hash in `app_users` and returns an eight-hour JWT. Subsequent requests send that token in the `Authorization` header. Express verifies the role and record ownership before executing parameterized MySQL queries. The frontend never receives MySQL credentials.

Role permissions are mirrored in `frontend/src/config/permissions.js` for navigation and `backend/config/resources.js` for authoritative server checks.

## Architecture

- `frontend`: Vite entry point, public assets, and the complete React application.
- `frontend/src/components`: shared navigation, tables, forms, modals, badges, stat cards, toasts, and route protection.
- `frontend/src/pages`: dashboard plus Flats, Residents, Visitors, Staff, Maintenance, Payments, Complaints, Notices, Amenities, Bookings, Login, and Settings pages.
- `frontend/src/config/resources.js`: declarative fields, columns, filters, and summary-card definitions for reusable CRUD pages.
- `frontend/src/services/api.js`: authenticated HTTP client for the Express API.
- `frontend/src/context`: application state that consumes the service layer and exposes mutations to the UI.
- `backend/index.js`: login, health, CRUD, authorization, and error-handling API.
- `backend/sql`: rerunnable schema, seed data, and Treasurer-removal migration.
- `postman`: importable API collection with automated authentication and CRUD requests.
- `postman`: importable collection with automated JWT and CRUD tests.

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

## Postman

Import `postman/Haven-Society-API.postman_collection.json`, then run the collection in order. Login automatically stores the JWT; the remaining requests verify database connectivity and a complete notice create/update/delete cycle.

## Treasurer removal

Treasurer is absent from the frontend, API permission maps, demo accounts, seeded users, and allowed MySQL role values. For an older database, run `mysql -u root -p < backend/sql/remove_treasurer.sql` before applying the new constrained schema.
