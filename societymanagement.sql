CREATE DATABASE society_management;
USE society_management;
CREATE TABLE flats (
    flat_id INT PRIMARY KEY AUTO_INCREMENT,
    flat_number VARCHAR(20),
    block_name VARCHAR(50),
    floor_number INT,
    flat_type VARCHAR(30),
    occupancy_status VARCHAR(20)
);
CREATE TABLE residents (
    resident_id INT PRIMARY KEY AUTO_INCREMENT,
    resident_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(15),
    password VARCHAR(100),
    role VARCHAR(30),
    resident_type VARCHAR(30),
    flat_id INT,
    FOREIGN KEY (flat_id) REFERENCES flats(flat_id)
);
CREATE TABLE visitors (
    visitor_id INT PRIMARY KEY AUTO_INCREMENT,
    visitor_name VARCHAR(100),
    phone VARCHAR(15),
    purpose VARCHAR(100),
    flat_id INT,
    entry_time DATETIME,
    exit_time DATETIME,
    status VARCHAR(20),
    FOREIGN KEY (flat_id) REFERENCES flats(flat_id)
);
CREATE TABLE staff (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    staff_name VARCHAR(100),
    phone VARCHAR(15),
    staff_type VARCHAR(50),
    address VARCHAR(200)
);
CREATE TABLE maintenance_bills (
    bill_id INT PRIMARY KEY AUTO_INCREMENT,
    flat_id INT,
    bill_month VARCHAR(20),
    amount DECIMAL(10,2),
    due_date DATE,
    bill_status VARCHAR(20),
    FOREIGN KEY (flat_id) REFERENCES flats(flat_id)
);
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    bill_id INT,
    resident_id INT,
    payment_date DATE,
    amount DECIMAL(10,2),
    payment_method VARCHAR(30),
    transaction_id VARCHAR(100),
    payment_status VARCHAR(20),
    FOREIGN KEY (bill_id) REFERENCES maintenance_bills(bill_id),
    FOREIGN KEY (resident_id) REFERENCES residents(resident_id)
);
CREATE TABLE complaints (
    complaint_id INT PRIMARY KEY AUTO_INCREMENT,
    resident_id INT,
    complaint_title VARCHAR(100),
    complaint_description VARCHAR(300),
    complaint_date DATE,
    complaint_status VARCHAR(30),
    FOREIGN KEY (resident_id) REFERENCES residents(resident_id)
);
CREATE TABLE notices (
    notice_id INT PRIMARY KEY AUTO_INCREMENT,
    notice_title VARCHAR(100),
    notice_description VARCHAR(500),
    notice_date DATE
);
CREATE TABLE amenities (
    amenity_id INT PRIMARY KEY AUTO_INCREMENT,
    amenity_name VARCHAR(100),
    location VARCHAR(100),
    availability_status VARCHAR(20)
);
CREATE TABLE amenity_bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    resident_id INT,
    amenity_id INT,
    booking_date DATE,
    start_time TIME,
    end_time TIME,
    booking_status VARCHAR(20),
    FOREIGN KEY (resident_id) REFERENCES residents(resident_id),
    FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id)
);
SHOW TABLES;
DESC flats;
DESC complaints;
INSERT INTO flats
(flat_number, block_name, floor_number, flat_type, occupancy_status)
VALUES
('101', 'A', 1, '2BHK', 'Occupied');
SELECT * FROM flats;
INSERT INTO residents
(resident_name, email, phone, password, role, resident_type, flat_id)
VALUES
('Rahul Kumar', 'rahul@gmail.com', '9876543210', 'rahul123', 'Resident', 'Owner', 1);
SELECT * FROM residents