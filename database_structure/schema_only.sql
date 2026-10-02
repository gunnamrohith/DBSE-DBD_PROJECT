-- Complete schema-only export for Haven Society Management.
-- This recreates all tables, keys, constraints and relationships without sample data.

CREATE DATABASE IF NOT EXISTS society_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE society_management;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS app_users;
DROP TABLE IF EXISTS amenity_bookings;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS maintenance_bills;
DROP TABLE IF EXISTS visitors;
DROP TABLE IF EXISTS amenities;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS residents;
DROP TABLE IF EXISTS flats;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE flats (
  flat_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  flat_number VARCHAR(20) NOT NULL,
  block_name VARCHAR(50) NOT NULL,
  floor_number INT NOT NULL,
  flat_type ENUM('1BHK', '2BHK', '3BHK', '4BHK') NOT NULL,
  occupancy_status ENUM('Occupied', 'Vacant') NOT NULL,
  UNIQUE KEY uq_flat (block_name, flat_number)
);

CREATE TABLE residents (
  resident_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  resident_name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(15) NOT NULL,
  role ENUM('Resident', 'Committee', 'Secretary') NOT NULL DEFAULT 'Resident',
  resident_type ENUM('Owner', 'Tenant') NOT NULL,
  flat_id INT UNSIGNED NOT NULL,
  CONSTRAINT fk_resident_flat FOREIGN KEY (flat_id) REFERENCES flats(flat_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE staff (
  staff_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  staff_name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  staff_type ENUM('Security', 'Housekeeping', 'Maintenance', 'Gardener') NOT NULL,
  address VARCHAR(200) NOT NULL
);

CREATE TABLE visitors (
  visitor_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  visitor_name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  purpose VARCHAR(100) NOT NULL,
  flat_id INT UNSIGNED NOT NULL,
  entry_time DATETIME NOT NULL,
  exit_time DATETIME NULL,
  status ENUM('Inside', 'Exited', 'Expected') NOT NULL,
  CONSTRAINT fk_visitor_flat FOREIGN KEY (flat_id) REFERENCES flats(flat_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE maintenance_bills (
  bill_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  flat_id INT UNSIGNED NOT NULL,
  bill_month VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2) UNSIGNED NOT NULL,
  due_date DATE NOT NULL,
  bill_status ENUM('Paid', 'Pending', 'Overdue') NOT NULL,
  UNIQUE KEY uq_bill_flat_month (flat_id, bill_month),
  CONSTRAINT fk_bill_flat FOREIGN KEY (flat_id) REFERENCES flats(flat_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE payments (
  payment_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  bill_id INT UNSIGNED NOT NULL,
  resident_id INT UNSIGNED NOT NULL,
  payment_date DATE NOT NULL,
  amount DECIMAL(10,2) UNSIGNED NOT NULL,
  payment_method ENUM('UPI', 'Card', 'Net Banking', 'Cheque') NOT NULL,
  transaction_id VARCHAR(100) NOT NULL UNIQUE,
  payment_status ENUM('Successful', 'Pending', 'Failed') NOT NULL,
  CONSTRAINT fk_payment_bill FOREIGN KEY (bill_id) REFERENCES maintenance_bills(bill_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_payment_resident FOREIGN KEY (resident_id) REFERENCES residents(resident_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE complaints (
  complaint_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  resident_id INT UNSIGNED NOT NULL,
  complaint_title VARCHAR(100) NOT NULL,
  complaint_description VARCHAR(500) NOT NULL,
  complaint_date DATE NOT NULL,
  complaint_status ENUM('Open', 'In Progress', 'Resolved') NOT NULL,
  CONSTRAINT fk_complaint_resident FOREIGN KEY (resident_id) REFERENCES residents(resident_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE notices (
  notice_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  notice_title VARCHAR(100) NOT NULL,
  notice_description VARCHAR(500) NOT NULL,
  notice_date DATE NOT NULL
);

CREATE TABLE amenities (
  amenity_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  amenity_name VARCHAR(100) NOT NULL UNIQUE,
  location VARCHAR(100) NOT NULL,
  availability_status ENUM('Available', 'Maintenance') NOT NULL
);

CREATE TABLE amenity_bookings (
  booking_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  resident_id INT UNSIGNED NOT NULL,
  amenity_id INT UNSIGNED NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  booking_status ENUM('Confirmed', 'Pending', 'Completed', 'Cancelled') NOT NULL,
  CONSTRAINT chk_booking_time CHECK (end_time > start_time),
  CONSTRAINT fk_booking_resident FOREIGN KEY (resident_id) REFERENCES residents(resident_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_booking_amenity FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

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