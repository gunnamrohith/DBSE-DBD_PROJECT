USE society_management;

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
  (18, 'Sandeep Patil', 'sandeep.patil@havenwoods.in', '$2b$10$NEEZLwwK5fEv/sGE74tGGemYzlZBU95cgzxMVk80HgU63.Ivu0G.W', 'Maintenance Staff', 'staff', NULL, 8, NULL);