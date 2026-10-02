USE society_management;

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