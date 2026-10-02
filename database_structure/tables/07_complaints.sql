USE society_management;

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