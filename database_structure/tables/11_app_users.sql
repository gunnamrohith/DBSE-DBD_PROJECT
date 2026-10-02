USE society_management;

CREATE TABLE app_users (
  user_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Committee', 'Secretary', 'Resident', 'Security', 'Housekeeping', 'Maintenance Staff') NOT NULL,
  account_type ENUM('admin', 'resident', 'staff') NOT NULL,
  resident_id INT UNSIGNED NULL UNIQUE,
  staff_id INT UNSIGNED NULL UNIQUE,
  flat_id INT UNSIGNED NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT fk_user_resident FOREIGN KEY (resident_id) REFERENCES residents(resident_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_user_staff FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_user_flat FOREIGN KEY (flat_id) REFERENCES flats(flat_id)
    ON UPDATE CASCADE ON DELETE SET NULL
);