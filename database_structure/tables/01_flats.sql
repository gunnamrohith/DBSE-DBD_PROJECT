USE society_management;

CREATE TABLE flats (
  flat_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  flat_number VARCHAR(20) NOT NULL,
  block_name VARCHAR(50) NOT NULL,
  floor_number INT NOT NULL,
  flat_type ENUM('1BHK', '2BHK', '3BHK', '4BHK') NOT NULL,
  occupancy_status ENUM('Occupied', 'Vacant') NOT NULL,
  UNIQUE KEY uq_flat (block_name, flat_number)
);