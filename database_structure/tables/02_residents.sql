USE society_management;

CREATE TABLE residents (
  resident_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  resident_name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(15) NOT NULL,
  role ENUM('Resident', 'Committee', 'Secretary') NOT NULL DEFAULT 'Resident',
  resident_type ENUM('Owner', 'Tenant') NOT NULL,
  flat_id INT UNSIGNED NOT NULL,
  UNIQUE KEY uq_resident_flat (flat_id),
  CONSTRAINT fk_resident_flat FOREIGN KEY (flat_id) REFERENCES flats(flat_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);