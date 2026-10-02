USE society_management;

CREATE TABLE amenities (
  amenity_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  amenity_name VARCHAR(100) NOT NULL UNIQUE,
  location VARCHAR(100) NOT NULL,
  availability_status ENUM('Available', 'Maintenance') NOT NULL
);