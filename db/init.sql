-- Create the database
CREATE DATABASE IF NOT EXISTS hospital_management;

-- Use the database
USE hospital_management;

-- Create the medicines table with appropriate data types
CREATE TABLE IF NOT EXISTS medicines (id VARCHAR(255) , name VARCHAR(255) NOT NULL, arrivalTime VARCHAR(255) NOT NULL, departureTime VARCHAR(255) NOT NULL, expireDate VARCHAR(255) NOT NULL, arrivalDate VARCHAR(255) NOT NULL, departureDate VARCHAR(255) NOT NULL, amount VARCHAR(255) NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB;

-- -- Grant privileges to the user
-- GRANT ALL PRIVILEGES ON hospital_management.* TO 'myuser'@'%' IDENTIFIED BY 'mysql';
-- GRANT ALL PRIVILEGES ON hospital_management.* TO 'myuser'@'localhost' IDENTIFIED BY 'mysql';

-- Insert data into the medicines table
INSERT INTO medicines (id, name, arrivalTime, departureTime, expireDate, arrivalDate, departureDate, amount) VALUES ('1', 'adasd', '08:00:00', '17:00:00', '2024-12-31', '2024-01-01', '2024-01-02', '100.00');