-- Migration for databases created before the Treasurer role was removed.
USE society_management;

START TRANSACTION;
DELETE FROM app_users WHERE role = 'Treasurer';
UPDATE residents SET role = 'Resident' WHERE role = 'Treasurer';
COMMIT;

-- Fresh installations do not allow Treasurer in the role ENUM definitions.
