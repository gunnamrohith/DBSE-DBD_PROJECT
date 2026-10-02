# Society Management Database Structure

This directory mirrors the table view shown in MySQL Workbench. Open `tables/` to inspect each table's columns, primary keys, unique keys, checks, and foreign-key relationships.

## Tables

| Table | Purpose | References |
| --- | --- | --- |
| `flats` | Flat and occupancy details | - |
| `residents` | Resident profiles and roles | `flats` |
| `staff` | Society employee details | - |
| `visitors` | Visitor entry and exit records | `flats` |
| `maintenance_bills` | Monthly maintenance charges | `flats` |
| `payments` | Bill payment transactions | `maintenance_bills`, `residents` |
| `complaints` | Resident service requests | `residents` |
| `notices` | Society announcements | - |
| `amenities` | Shared amenity catalog | - |
| `amenity_bookings` | Resident amenity reservations | `residents`, `amenities` |
| `app_users` | Login accounts and role access | `residents`, `staff`, `flats` |

Run `schema_only.sql` to create the complete empty structure. Run the repository root `complete_database.sql` to create the same structure with sample records.