USE society_management;

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