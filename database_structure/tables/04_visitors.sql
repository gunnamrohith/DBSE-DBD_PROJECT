USE society_management;

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