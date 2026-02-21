CREATE TABLE IF NOT EXISTS measurements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device VARCHAR(255) NOT NULL,
    sensor VARCHAR(255) NOT NULL,
    payload VARCHAR(255) NOT NULL,
    received_at TIMESTAMP NOT NULL
);

CREATE USER 'system'@'%' IDENTIFIED BY 'supersecret_system';

GRANT SELECT, INSERT ON iot_db.measurements TO 'system'@'%';

FLUSH PRIVILEGES;