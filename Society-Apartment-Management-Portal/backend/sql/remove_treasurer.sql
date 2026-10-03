USE society_management;

START TRANSACTION;
DELETE FROM app_users WHERE role = 'Treasurer';
UPDATE residents SET role = 'Resident' WHERE role = 'Treasurer';
COMMIT;

-- On a fresh installation, schema.sql makes Treasurer impossible by using
-- role ENUMs that do not include it.