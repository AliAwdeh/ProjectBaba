-- Create the database
CREATE DATABASE mak;

-- Use the database
USE mak;

-- Create the Clients table
CREATE TABLE Clients (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    guid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    address VARCHAR(250) DEFAULT NULL,
    reference INT DEFAULT NULL,
    FOREIGN KEY (reference) REFERENCES Clients(client_id)
);

-- Step 2: Create the new `Cars` table
CREATE TABLE Cars (
    car_id INT AUTO_INCREMENT PRIMARY KEY,
    plate_number VARCHAR(20) NOT NULL,
    guid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    Colour VARCHAR(50) NOT NULL,
    vin VARCHAR(20) DEFAULT NULL,
    owner_id INT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES Clients(client_id)
);

-- Create the Appointments table
CREATE TABLE Appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    guid CHAR(36) NOT NULL UNIQUE,
    client_id INT NOT NULL,
    car_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    service_details TEXT,
    FOREIGN KEY (client_id) REFERENCES Clients(client_id),
    FOREIGN KEY (car_id) REFERENCES Cars(car_id)
);

-- Create the OwnershipHistory table
CREATE TABLE OwnershipHistory (
    ownership_id INT AUTO_INCREMENT PRIMARY KEY,
    guid CHAR(36) NOT NULL UNIQUE,
    car_id INT NOT NULL,
    old_owner_id INT,
    new_owner_id INT,
    transfer_date DATE NOT NULL,
    FOREIGN KEY (car_id) REFERENCES Cars(car_id),
    FOREIGN KEY (old_owner_id) REFERENCES Clients(client_id),
    FOREIGN KEY (new_owner_id) REFERENCES Clients(client_id)
);

-- Create the Parts table
CREATE TABLE Parts (
    part_id INT AUTO_INCREMENT PRIMARY KEY,
    guid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Create the Service table
CREATE TABLE Service (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    guid CHAR(36) NOT NULL UNIQUE,
    car_id INT NOT NULL,
    service_date DATE NOT NULL,
    odometre INT NOT NULL,
    description TEXT,
    invoice_id INT,
    paid_status BOOLEAN NOT NULL DEFAULT FALSE,
    price DECIMAL(10, 2),
    FOREIGN KEY (car_id) REFERENCES Cars(car_id)
);

-- Create the PartService table for the many-to-many relationship
CREATE TABLE PartService (
    partservice_id INT AUTO_INCREMENT PRIMARY KEY,
    guid CHAR(36) NOT NULL UNIQUE,
    part_id INT NOT NULL,
    service_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (part_id) REFERENCES Parts(part_id),
    FOREIGN KEY (service_id) REFERENCES Service(service_id),
    total_price DECIMAL(10, 2)
);

-- Create the Invoice table
CREATE TABLE Invoice (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    guid CHAR(36) NOT NULL UNIQUE,
    service_id INT NOT NULL,
    labor_cost DECIMAL(10, 2) NOT NULL,
    partservice_total DECIMAL(10, 2),
    total DECIMAL(10, 2),
    FOREIGN KEY (service_id) REFERENCES Service(service_id)
);

 -- now the second part:

 -- Add foreign key constraint for invoice_id in Service table
ALTER TABLE Service
ADD CONSTRAINT fk_invoice
FOREIGN KEY (invoice_id) REFERENCES Invoice(invoice_id);


 --THEN

 -- Trigger to update partservice_total and total in Invoice table after inserting or updating PartService
DELIMITER //

CREATE TRIGGER update_invoice_after_partservice_change
AFTER INSERT ON PartService
FOR EACH ROW
BEGIN
    UPDATE Invoice
    SET partservice_total = (
        SELECT COALESCE(SUM(total_price), 0)
        FROM PartService
        WHERE service_id = NEW.service_id
    ),
    total = labor_cost + partservice_total
    WHERE service_id = NEW.service_id;
END;
//

DELIMITER ;


--THEN

-- Trigger to update partservice_total and total in Invoice table after updating PartService
DELIMITER //

CREATE TRIGGER update_invoice_after_partservice_update
AFTER UPDATE ON PartService
FOR EACH ROW
BEGIN
    UPDATE Invoice
    SET partservice_total = (
        SELECT COALESCE(SUM(total_price), 0)
        FROM PartService
        WHERE service_id = NEW.service_id
    ),
    total = labor_cost + partservice_total
    WHERE service_id = NEW.service_id;
END;
//

DELIMITER ;
