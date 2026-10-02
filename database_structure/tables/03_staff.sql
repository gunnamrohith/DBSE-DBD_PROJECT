USE society_management;

CREATE TABLE staff (
  staff_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  staff_name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  staff_type ENUM('Security', 'Housekeeping', 'Maintenance', 'Gardener') NOT NULL,
  address VARCHAR(200) NOT NULL
);