USE society_management;

CREATE TABLE amenity_bookings (
  booking_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  resident_id INT UNSIGNED NOT NULL,
  amenity_id INT UNSIGNED NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  booking_status ENUM('Confirmed', 'Pending', 'Completed', 'Cancelled') NOT NULL,
  CONSTRAINT chk_booking_time CHECK (end_time > start_time),
  CONSTRAINT fk_booking_resident FOREIGN KEY (resident_id) REFERENCES residents(resident_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_booking_amenity FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);