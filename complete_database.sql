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
  UNIQUE KEY uq_resident_flat (flat_id),
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
);USE society_management;

INSERT INTO flats (flat_id, flat_number, block_name, floor_number, flat_type, occupancy_status) VALUES
  (1, '101', 'A', 1, '2BHK', 'Occupied'),
  (2, '102', 'A', 1, '3BHK', 'Occupied'),
  (3, '201', 'A', 2, '2BHK', 'Occupied'),
  (4, '202', 'A', 2, '3BHK', 'Occupied'),
  (5, '101', 'B', 1, '2BHK', 'Occupied'),
  (6, '102', 'B', 1, '2BHK', 'Occupied'),
  (7, '201', 'B', 2, '3BHK', 'Occupied'),
  (8, '202', 'B', 2, '2BHK', 'Occupied'),
  (9, '301', 'C', 3, '3BHK', 'Occupied'),
  (10, '302', 'C', 3, '2BHK', 'Occupied'),
  (11, '401', 'C', 4, '4BHK', 'Occupied'),
  (12, '402', 'C', 4, '3BHK', 'Occupied');

INSERT INTO residents (resident_id, resident_name, email, phone, role, resident_type, flat_id) VALUES
  (1, 'Rahul Kumar', 'rahul@gmail.com', '9876543210', 'Resident', 'Owner', 1),
  (2, 'Ananya Rao', 'ananya@example.com', '9876500021', 'Resident', 'Tenant', 3),
  (3, 'Vikram Singh', 'vikram@example.com', '9876500022', 'Committee', 'Owner', 4),
  (4, 'Meera Shah', 'meera@example.com', '9876500023', 'Committee', 'Owner', 5),
  (5, 'Kabir Joshi', 'kabir@example.com', '9876500024', 'Resident', 'Tenant', 7),
  (6, 'Nisha Patel', 'nisha@example.com', '9876500025', 'Committee', 'Owner', 8),
  (7, 'Arjun Nair', 'arjun@example.com', '9876500026', 'Secretary', 'Owner', 9),
  (8, 'Sara Khan', 'sara@example.com', '9876500027', 'Resident', 'Tenant', 11),
  (9, 'Rohan Das', 'rohan@example.com', '9876500028', 'Resident', 'Owner', 12),
  (10, 'Isha Verma', 'isha@example.com', '9876500029', 'Secretary', 'Owner', 2);

INSERT INTO staff (staff_id, staff_name, phone, staff_type, address) VALUES
  (1, 'Mahesh Yadav', '9822000011', 'Security', 'Andheri East, Mumbai'),
  (2, 'Lata Pawar', '9822000012', 'Housekeeping', 'Powai, Mumbai'),
  (3, 'Ganesh More', '9822000013', 'Maintenance', 'Vikhroli, Mumbai'),
  (4, 'Ramesh Kale', '9822000014', 'Security', 'Bhandup, Mumbai'),
  (5, 'Sunita Devi', '9822000015', 'Housekeeping', 'Saki Naka, Mumbai'),
  (6, 'Imran Sheikh', '9822000016', 'Gardener', 'Kurla, Mumbai'),
  (7, 'Pooja Kulkarni', '9822000017', 'Maintenance', 'Thane West, Mumbai'),
  (8, 'Sandeep Patil', '9822000018', 'Maintenance', 'Mulund West, Mumbai');

INSERT INTO visitors (visitor_id, visitor_name, phone, purpose, flat_id, entry_time, exit_time, status) VALUES
  (1, 'Amit Sharma', '9811100001', 'Family visit', 1, '2026-09-08 09:15:00', NULL, 'Inside'),
  (2, 'Neha Gupta', '9811100002', 'Delivery', 2, '2026-09-08 10:05:00', '2026-09-08 10:20:00', 'Exited'),
  (3, 'Suresh R', '9811100003', 'Plumber', 4, '2026-09-08 11:30:00', NULL, 'Inside'),
  (4, 'Priya Menon', '9811100004', 'Guest', 5, '2026-09-08 14:00:00', NULL, 'Expected'),
  (5, 'Dev Malhotra', '9811100005', 'Courier', 7, '2026-09-07 16:20:00', '2026-09-07 16:28:00', 'Exited'),
  (6, 'Kiran Bose', '9811100006', 'Tutor', 8, '2026-09-08 17:00:00', NULL, 'Expected'),
  (7, 'Sameer Ali', '9811100007', 'Friend', 9, '2026-09-08 08:40:00', '2026-09-08 09:55:00', 'Exited'),
  (8, 'Ritu Jain', '9811100008', 'Housekeeping', 11, '2026-09-08 12:10:00', NULL, 'Inside');

INSERT INTO maintenance_bills (bill_id, flat_id, bill_month, amount, due_date, bill_status) VALUES
  (1, 1, 'September 2026', 5000, '2026-09-10', 'Paid'),
  (2, 2, 'September 2026', 6500, '2026-09-10', 'Pending'),
  (3, 3, 'September 2026', 5000, '2026-09-10', 'Pending'),
  (4, 4, 'August 2026', 6500, '2026-08-10', 'Overdue'),
  (5, 5, 'September 2026', 5000, '2026-09-10', 'Paid'),
  (6, 6, 'September 2026', 5000, '2026-09-10', 'Pending'),
  (7, 7, 'September 2026', 6500, '2026-09-10', 'Paid'),
  (8, 8, 'August 2026', 5000, '2026-08-10', 'Overdue'),
  (9, 9, 'September 2026', 6500, '2026-09-10', 'Paid'),
  (10, 11, 'September 2026', 8000, '2026-09-10', 'Pending'),
  (11, 12, 'September 2026', 6500, '2026-09-10', 'Paid');

INSERT INTO payments (payment_id, bill_id, resident_id, payment_date, amount, payment_method, transaction_id, payment_status) VALUES
  (1, 1, 1, '2026-09-03', 5000, 'UPI', 'TXN260903001', 'Successful'),
  (2, 2, 2, '2026-09-08', 6500, 'Card', 'TXN260908002', 'Pending'),
  (3, 5, 4, '2026-09-04', 5000, 'Net Banking', 'TXN260904003', 'Successful'),
  (4, 7, 5, '2026-09-05', 6500, 'UPI', 'TXN260905004', 'Successful'),
  (5, 8, 6, '2026-08-11', 5000, 'Card', 'TXN260811005', 'Failed'),
  (6, 9, 7, '2026-09-05', 6500, 'UPI', 'TXN260905006', 'Successful'),
  (7, 10, 8, '2026-09-08', 8000, 'Cheque', 'CHQ26090807', 'Pending'),
  (8, 11, 9, '2026-09-06', 6500, 'Net Banking', 'TXN260906008', 'Successful');

INSERT INTO complaints (complaint_id, resident_id, complaint_title, complaint_description, complaint_date, complaint_status) VALUES
  (1, 1, 'Lift not working', 'Block A lift stops intermittently on the second floor.', '2026-09-08', 'Open'),
  (2, 2, 'Water pressure issue', 'Low water pressure in the kitchen during mornings.', '2026-09-07', 'In Progress'),
  (3, 4, 'Parking light', 'Parking bay B12 light needs replacement.', '2026-09-05', 'Resolved'),
  (4, 5, 'Noise after hours', 'Construction noise heard after permitted hours.', '2026-09-06', 'Open'),
  (5, 7, 'Intercom issue', 'The security intercom is not ringing in the flat.', '2026-09-04', 'In Progress'),
  (6, 8, 'Pool cleanliness', 'Pool deck requires additional cleaning.', '2026-09-02', 'Resolved');

INSERT INTO notices (notice_id, notice_title, notice_description, notice_date) VALUES
  (1, 'Water Supply Maintenance', 'Water supply will be temporarily unavailable from 10:00 AM to 1:00 PM for tank cleaning.', '2026-09-08'),
  (2, 'Annual General Meeting', 'The AGM will be held in the clubhouse. All owners are requested to attend.', '2026-09-12'),
  (3, 'Ganesh Festival Celebration', 'Join the community celebration in the central courtyard this Saturday evening.', '2026-09-06'),
  (4, 'Parking Sticker Renewal', 'Vehicle parking stickers must be renewed at the society office before month-end.', '2026-09-04'),
  (5, 'Pest Control Schedule', 'Common-area pest control is scheduled block-wise from September 14 to 16.', '2026-09-03');

INSERT INTO amenities (amenity_id, amenity_name, location, availability_status) VALUES
  (1, 'Swimming Pool', 'Block A', 'Available'),
  (2, 'Fitness Studio', 'Clubhouse', 'Available'),
  (3, 'Badminton Court', 'Block B', 'Maintenance'),
  (4, 'Community Hall', 'Clubhouse', 'Available'),
  (5, 'Children''s Play Area', 'Central Garden', 'Available');

INSERT INTO amenity_bookings (booking_id, resident_id, amenity_id, booking_date, start_time, end_time, booking_status) VALUES
  (1, 1, 1, '2026-09-08', '07:00', '08:00', 'Completed'),
  (2, 2, 2, '2026-09-08', '18:00', '19:00', 'Confirmed'),
  (3, 3, 4, '2026-09-12', '17:00', '20:00', 'Confirmed'),
  (4, 4, 1, '2026-09-09', '08:00', '09:00', 'Pending'),
  (5, 5, 2, '2026-09-05', '19:00', '20:00', 'Completed'),
  (6, 6, 4, '2026-09-15', '10:00', '13:00', 'Cancelled'),
  (7, 7, 5, '2026-09-08', '16:00', '17:00', 'Confirmed'),
  (8, 8, 1, '2026-09-10', '07:00', '08:00', 'Pending');

INSERT INTO app_users (user_id, name, email, password_hash, role, account_type, resident_id, staff_id, flat_id) VALUES
  (1, 'Admin User', 'admin@havenwoods.in', '$2b$10$PFFMq3Bcf8RZ0583XSnygOTNYUkil5SjLfsEcgXs8gHVFMCaZn6ku', 'Admin', 'admin', NULL, NULL, NULL),
  (2, 'Rahul Kumar', 'rahul@gmail.com', '$2b$10$6mZE29TbPYMYy8V/oJX.1ORr4XvCPi67dkqojk7kTaR0fLM/Af1f2', 'Resident', 'resident', 1, NULL, 1),
  (3, 'Vikram Singh', 'vikram@example.com', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Committee', 'resident', 3, NULL, 4),
  (4, 'Isha Verma', 'isha@example.com', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Secretary', 'resident', 10, NULL, 2),
  (5, 'Mahesh Yadav', 'security@havenwoods.in', '$2b$10$QQuXq4CqvxHckOkGVn4M2./WbO9W.FvO7wjCaw9WVcTBj52bdrAjO', 'Security', 'staff', NULL, 1, NULL),
  (6, 'Lata Pawar', 'housekeeping@havenwoods.in', '$2b$10$NEEZLwwK5fEv/sGE74tGGemYzlZBU95cgzxMVk80HgU63.Ivu0G.W', 'Housekeeping', 'staff', NULL, 2, NULL),
  (7, 'Ganesh More', 'maintenance@havenwoods.in', '$2b$10$NEEZLwwK5fEv/sGE74tGGemYzlZBU95cgzxMVk80HgU63.Ivu0G.W', 'Maintenance Staff', 'staff', NULL, 3, NULL),
  (8, 'Ananya Rao', 'ananya@example.com', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 2, NULL, 3),
  (9, 'Meera Shah', 'meera@example.com', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Committee', 'resident', 4, NULL, 5),
  (10, 'Kabir Joshi', 'kabir@example.com', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 5, NULL, 7),
  (11, 'Nisha Patel', 'nisha@example.com', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Committee', 'resident', 6, NULL, 8),
  (12, 'Arjun Nair', 'arjun@example.com', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Secretary', 'resident', 7, NULL, 9),
  (13, 'Sara Khan', 'sara@example.com', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 8, NULL, 11),
  (14, 'Rohan Das', 'rohan@example.com', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 9, NULL, 12),
  (15, 'Ramesh Kale', 'ramesh.kale@havenwoods.in', '$2b$10$QQuXq4CqvxHckOkGVn4M2./WbO9W.FvO7wjCaw9WVcTBj52bdrAjO', 'Security', 'staff', NULL, 4, NULL),
  (16, 'Sunita Devi', 'sunita.devi@havenwoods.in', '$2b$10$NEEZLwwK5fEv/sGE74tGGemYzlZBU95cgzxMVk80HgU63.Ivu0G.W', 'Housekeeping', 'staff', NULL, 5, NULL),
  (17, 'Pooja Kulkarni', 'pooja.kulkarni@havenwoods.in', '$2b$10$NEEZLwwK5fEv/sGE74tGGemYzlZBU95cgzxMVk80HgU63.Ivu0G.W', 'Maintenance Staff', 'staff', NULL, 7, NULL),
  (18, 'Sandeep Patil', 'sandeep.patil@havenwoods.in', '$2b$10$NEEZLwwK5fEv/sGE74tGGemYzlZBU95cgzxMVk80HgU63.Ivu0G.W', 'Maintenance Staff', 'staff', NULL, 8, NULL);USE society_management;

START TRANSACTION;

UPDATE residents SET flat_id = 3 WHERE resident_id = 2;
UPDATE app_users SET flat_id = 3 WHERE resident_id = 2;
UPDATE flats SET occupancy_status = 'Occupied' WHERE flat_id IN (3, 6, 10);

INSERT INTO flats (flat_id, flat_number, block_name, floor_number, flat_type, occupancy_status) VALUES
  (13, '103', 'A', 1, '2BHK', 'Occupied'),
  (14, '104', 'A', 1, '3BHK', 'Occupied'),
  (15, '105', 'A', 1, '2BHK', 'Occupied'),
  (16, '203', 'A', 2, '3BHK', 'Occupied'),
  (17, '204', 'A', 2, '2BHK', 'Occupied'),
  (18, '205', 'A', 2, '3BHK', 'Occupied'),
  (19, '301', 'A', 3, '2BHK', 'Occupied'),
  (20, '302', 'A', 3, '3BHK', 'Occupied'),
  (21, '303', 'A', 3, '2BHK', 'Occupied'),
  (22, '304', 'A', 3, '3BHK', 'Occupied'),
  (23, '305', 'A', 3, '2BHK', 'Occupied'),
  (24, '103', 'B', 1, '2BHK', 'Occupied'),
  (25, '104', 'B', 1, '3BHK', 'Occupied'),
  (26, '105', 'B', 1, '2BHK', 'Occupied'),
  (27, '203', 'B', 2, '3BHK', 'Occupied'),
  (28, '204', 'B', 2, '2BHK', 'Occupied'),
  (29, '205', 'B', 2, '3BHK', 'Occupied'),
  (30, '301', 'B', 3, '2BHK', 'Occupied'),
  (31, '302', 'B', 3, '3BHK', 'Occupied'),
  (32, '303', 'B', 3, '2BHK', 'Occupied'),
  (33, '304', 'B', 3, '3BHK', 'Occupied'),
  (34, '305', 'B', 3, '2BHK', 'Occupied'),
  (35, '101', 'C', 1, '2BHK', 'Occupied'),
  (36, '102', 'C', 1, '3BHK', 'Occupied'),
  (37, '103', 'C', 1, '2BHK', 'Occupied'),
  (38, '104', 'C', 1, '3BHK', 'Occupied'),
  (39, '105', 'C', 1, '2BHK', 'Occupied'),
  (40, '201', 'C', 2, '3BHK', 'Occupied'),
  (41, '202', 'C', 2, '2BHK', 'Occupied'),
  (42, '203', 'C', 2, '3BHK', 'Occupied'),
  (43, '204', 'C', 2, '2BHK', 'Occupied'),
  (44, '205', 'C', 2, '3BHK', 'Occupied'),
  (45, '303', 'C', 3, '2BHK', 'Occupied')
ON DUPLICATE KEY UPDATE
  floor_number = VALUES(floor_number),
  flat_type = VALUES(flat_type),
  occupancy_status = VALUES(occupancy_status);

INSERT INTO residents (resident_id, resident_name, email, phone, role, resident_type, flat_id) VALUES
  (11, 'Aaditya Sharma', 'aaditya.sharma@havenwoods.in', '9876600011', 'Resident', 'Owner', 13),
  (12, 'Priya Reddy', 'priya.reddy@havenwoods.in', '9876600012', 'Resident', 'Tenant', 14),
  (13, 'Karthik Iyer', 'karthik.iyer@havenwoods.in', '9876600013', 'Committee', 'Owner', 15),
  (14, 'Sneha Gupta', 'sneha.gupta@havenwoods.in', '9876600014', 'Resident', 'Owner', 16),
  (15, 'Rohan Kulkarni', 'rohan.kulkarni@havenwoods.in', '9876600015', 'Resident', 'Tenant', 17),
  (16, 'Deepika Menon', 'deepika.menon@havenwoods.in', '9876600016', 'Secretary', 'Owner', 18),
  (17, 'Harish Babu', 'harish.babu@havenwoods.in', '9876600017', 'Resident', 'Owner', 19),
  (18, 'Kavya Joshi', 'kavya.joshi@havenwoods.in', '9876600018', 'Resident', 'Tenant', 20),
  (19, 'Manish Agarwal', 'manish.agarwal@havenwoods.in', '9876600019', 'Committee', 'Owner', 21),
  (20, 'Neha Kapoor', 'neha.kapoor@havenwoods.in', '9876600020', 'Resident', 'Owner', 22),
  (21, 'Suresh Naidu', 'suresh.naidu@havenwoods.in', '9876600021', 'Resident', 'Tenant', 23),
  (22, 'Ajay Deshmukh', 'ajay.deshmukh@havenwoods.in', '9876600022', 'Resident', 'Owner', 24),
  (23, 'Bhavna Shah', 'bhavna.shah@havenwoods.in', '9876600023', 'Resident', 'Tenant', 25),
  (24, 'Chetan Rao', 'chetan.rao@havenwoods.in', '9876600024', 'Committee', 'Owner', 26),
  (25, 'Divya Nair', 'divya.nair@havenwoods.in', '9876600025', 'Resident', 'Owner', 27),
  (26, 'Eshwar Reddy', 'eshwar.reddy@havenwoods.in', '9876600026', 'Secretary', 'Owner', 28),
  (27, 'Farah Khan', 'farah.khan@havenwoods.in', '9876600027', 'Resident', 'Tenant', 29),
  (28, 'Gaurav Mehta', 'gaurav.mehta@havenwoods.in', '9876600028', 'Resident', 'Owner', 30),
  (29, 'Hema Patil', 'hema.patil@havenwoods.in', '9876600029', 'Resident', 'Tenant', 31),
  (30, 'Ishaan Verma', 'ishaan.verma@havenwoods.in', '9876600030', 'Secretary', 'Owner', 32),
  (31, 'Jyoti Singh', 'jyoti.singh@havenwoods.in', '9876600031', 'Resident', 'Owner', 33),
  (32, 'Krish Malhotra', 'krish.malhotra@havenwoods.in', '9876600032', 'Resident', 'Tenant', 34),
  (33, 'Lakshmi Pillai', 'lakshmi.pillai@havenwoods.in', '9876600033', 'Resident', 'Owner', 6),
  (34, 'Madhav Joshi', 'madhav.joshi@havenwoods.in', '9876600034', 'Committee', 'Owner', 35),
  (35, 'Nandini Rao', 'nandini.rao@havenwoods.in', '9876600035', 'Resident', 'Tenant', 36),
  (36, 'Omkar Shinde', 'omkar.shinde@havenwoods.in', '9876600036', 'Committee', 'Owner', 37),
  (37, 'Pooja Mehra', 'pooja.mehra@havenwoods.in', '9876600037', 'Resident', 'Owner', 38),
  (38, 'Qadir Ali', 'qadir.ali@havenwoods.in', '9876600038', 'Resident', 'Tenant', 39),
  (39, 'Ritu Sharma', 'ritu.sharma@havenwoods.in', '9876600039', 'Secretary', 'Owner', 40),
  (40, 'Siddharth Jain', 'siddharth.jain@havenwoods.in', '9876600040', 'Resident', 'Owner', 41),
  (41, 'Tanvi Reddy', 'tanvi.reddy@havenwoods.in', '9876600041', 'Resident', 'Tenant', 42),
  (42, 'Uday Kumar', 'uday.kumar@havenwoods.in', '9876600042', 'Committee', 'Owner', 43),
  (43, 'Vaishnavi Nair', 'vaishnavi.nair@havenwoods.in', '9876600043', 'Resident', 'Owner', 44),
  (44, 'Wasim Khan', 'wasim.khan@havenwoods.in', '9876600044', 'Resident', 'Tenant', 45),
  (45, 'Yamini Desai', 'yamini.desai@havenwoods.in', '9876600045', 'Resident', 'Owner', 10)
ON DUPLICATE KEY UPDATE
  resident_name = VALUES(resident_name),
  email = VALUES(email),
  phone = VALUES(phone),
  role = VALUES(role),
  resident_type = VALUES(resident_type),
  flat_id = VALUES(flat_id);

INSERT INTO app_users (name, email, password_hash, role, account_type, resident_id, flat_id) VALUES
  ('Aaditya Sharma', 'aaditya.sharma@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 11, 13),
  ('Priya Reddy', 'priya.reddy@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 12, 14),
  ('Karthik Iyer', 'karthik.iyer@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Committee', 'resident', 13, 15),
  ('Sneha Gupta', 'sneha.gupta@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 14, 16),
  ('Rohan Kulkarni', 'rohan.kulkarni@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 15, 17),
  ('Deepika Menon', 'deepika.menon@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Secretary', 'resident', 16, 18),
  ('Harish Babu', 'harish.babu@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 17, 19),
  ('Kavya Joshi', 'kavya.joshi@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 18, 20),
  ('Manish Agarwal', 'manish.agarwal@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Committee', 'resident', 19, 21),
  ('Neha Kapoor', 'neha.kapoor@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 20, 22),
  ('Suresh Naidu', 'suresh.naidu@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 21, 23),
  ('Ajay Deshmukh', 'ajay.deshmukh@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 22, 24),
  ('Bhavna Shah', 'bhavna.shah@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 23, 25),
  ('Chetan Rao', 'chetan.rao@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Committee', 'resident', 24, 26),
  ('Divya Nair', 'divya.nair@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 25, 27),
  ('Eshwar Reddy', 'eshwar.reddy@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Secretary', 'resident', 26, 28),
  ('Farah Khan', 'farah.khan@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 27, 29),
  ('Gaurav Mehta', 'gaurav.mehta@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 28, 30),
  ('Hema Patil', 'hema.patil@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 29, 31),
  ('Ishaan Verma', 'ishaan.verma@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Secretary', 'resident', 30, 32),
  ('Jyoti Singh', 'jyoti.singh@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 31, 33),
  ('Krish Malhotra', 'krish.malhotra@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 32, 34),
  ('Lakshmi Pillai', 'lakshmi.pillai@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 33, 6),
  ('Madhav Joshi', 'madhav.joshi@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Committee', 'resident', 34, 35),
  ('Nandini Rao', 'nandini.rao@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 35, 36),
  ('Omkar Shinde', 'omkar.shinde@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Committee', 'resident', 36, 37),
  ('Pooja Mehra', 'pooja.mehra@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 37, 38),
  ('Qadir Ali', 'qadir.ali@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 38, 39),
  ('Ritu Sharma', 'ritu.sharma@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Secretary', 'resident', 39, 40),
  ('Siddharth Jain', 'siddharth.jain@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 40, 41),
  ('Tanvi Reddy', 'tanvi.reddy@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 41, 42),
  ('Uday Kumar', 'uday.kumar@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Committee', 'resident', 42, 43),
  ('Vaishnavi Nair', 'vaishnavi.nair@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 43, 44),
  ('Wasim Khan', 'wasim.khan@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 44, 45),
  ('Yamini Desai', 'yamini.desai@havenwoods.in', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 45, 10)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  account_type = VALUES(account_type),
  resident_id = VALUES(resident_id),
  flat_id = VALUES(flat_id),
  is_active = TRUE;

COMMIT;
