USE society_management;

START TRANSACTION;

UPDATE residents SET role = 'Committee' WHERE resident_id IN (4, 6);
UPDATE residents SET role = 'Secretary' WHERE resident_id = 7;

INSERT INTO staff (staff_id, staff_name, phone, staff_type, address) VALUES
  (7, 'Pooja Kulkarni', '9822000017', 'Maintenance', 'Thane West, Mumbai'),
  (8, 'Sandeep Patil', '9822000018', 'Maintenance', 'Mulund West, Mumbai')
ON DUPLICATE KEY UPDATE
  staff_name = VALUES(staff_name),
  phone = VALUES(phone),
  staff_type = VALUES(staff_type),
  address = VALUES(address);

INSERT INTO app_users (name, email, password_hash, role, account_type, resident_id, staff_id, flat_id) VALUES
  ('Ananya Rao', 'ananya@example.com', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 2, NULL, 3),
  ('Meera Shah', 'meera@example.com', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Committee', 'resident', 4, NULL, 5),
  ('Kabir Joshi', 'kabir@example.com', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 5, NULL, 7),
  ('Nisha Patel', 'nisha@example.com', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Committee', 'resident', 6, NULL, 8),
  ('Arjun Nair', 'arjun@example.com', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Secretary', 'resident', 7, NULL, 9),
  ('Sara Khan', 'sara@example.com', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 8, NULL, 11),
  ('Rohan Das', 'rohan@example.com', '$2b$10$zkQDrVWlKzsi/kgD6NEK.uzXU4uyRnZFfKaZ7yyKzvP1tE4Ig.07a', 'Resident', 'resident', 9, NULL, 12),
  ('Ramesh Kale', 'ramesh.kale@havenwoods.in', '$2b$10$QQuXq4CqvxHckOkGVn4M2./WbO9W.FvO7wjCaw9WVcTBj52bdrAjO', 'Security', 'staff', NULL, 4, NULL),
  ('Sunita Devi', 'sunita.devi@havenwoods.in', '$2b$10$NEEZLwwK5fEv/sGE74tGGemYzlZBU95cgzxMVk80HgU63.Ivu0G.W', 'Housekeeping', 'staff', NULL, 5, NULL),
  ('Pooja Kulkarni', 'pooja.kulkarni@havenwoods.in', '$2b$10$NEEZLwwK5fEv/sGE74tGGemYzlZBU95cgzxMVk80HgU63.Ivu0G.W', 'Maintenance Staff', 'staff', NULL, 7, NULL),
  ('Sandeep Patil', 'sandeep.patil@havenwoods.in', '$2b$10$NEEZLwwK5fEv/sGE74tGGemYzlZBU95cgzxMVk80HgU63.Ivu0G.W', 'Maintenance Staff', 'staff', NULL, 8, NULL)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  account_type = VALUES(account_type),
  resident_id = VALUES(resident_id),
  staff_id = VALUES(staff_id),
  flat_id = VALUES(flat_id),
  is_active = TRUE;

COMMIT;