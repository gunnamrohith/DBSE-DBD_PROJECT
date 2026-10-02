USE society_management;

CREATE TABLE notices (
  notice_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  notice_title VARCHAR(100) NOT NULL,
  notice_description VARCHAR(500) NOT NULL,
  notice_date DATE NOT NULL
);