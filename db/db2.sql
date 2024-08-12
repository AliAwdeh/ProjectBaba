-- Create the database
CREATE DATABASE mak;

-- Use the database
USE mak;

-- Create the Clients table
CREATE TABLE Clients (
    phone VARCHAR(15) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    address VARCHAR(250) DEFAULT NULL,
    reference VARCHAR(15) DEFAULT NULL,
    FOREIGN KEY (reference) REFERENCES Clients(phone)
);

-- Create the Cars table
CREATE TABLE Cars (
    plate_number VARCHAR(20) PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    colour VARCHAR(50) NOT NULL,
    vin VARCHAR(20) DEFAULT NULL,
    odometer INT NOT NULL, -- Odometer reading at the first service
    owner_phone VARCHAR(15) NOT NULL,
    FOREIGN KEY (owner_phone) REFERENCES Clients(phone)
);

-- Create the Appointments table
CREATE TABLE Appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    client_phone VARCHAR(15) NOT NULL,
    plate_number VARCHAR(20) NOT NULL,
    appointment_date DATETIME NOT NULL,
    service_details TEXT,
    FOREIGN KEY (client_phone) REFERENCES Clients(phone),
    FOREIGN KEY (plate_number) REFERENCES Cars(plate_number)
);

-- Create the OwnershipHistory table
CREATE TABLE OwnershipHistory (
    ownership_id INT AUTO_INCREMENT PRIMARY KEY,
    plate_number VARCHAR(20) NOT NULL,
    old_owner_phone VARCHAR(15),
    new_owner_phone VARCHAR(15),
    transfer_date DATE NOT NULL,
    FOREIGN KEY (plate_number) REFERENCES Cars(plate_number),
    FOREIGN KEY (old_owner_phone) REFERENCES Clients(phone),
    FOREIGN KEY (new_owner_phone) REFERENCES Clients(phone)
);

-- Create the Parts table
CREATE TABLE Parts (
    part_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create the Service table
CREATE TABLE Service (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    plate_number VARCHAR(20) NOT NULL,
    service_date DATE NOT NULL,
    odometer INT NOT NULL,
    description TEXT,
    invoice_id INT,
    service_done BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (plate_number) REFERENCES Cars(plate_number)
);

-- Create the PartService table for the many-to-many relationship
CREATE TABLE PartService (
    partservice_id INT AUTO_INCREMENT PRIMARY KEY,
    part_id INT NOT NULL,
    service_id INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (part_id) REFERENCES Parts(part_id),
    FOREIGN KEY (service_id) REFERENCES Service(service_id)
);

-- Create the Invoice table
CREATE TABLE Invoice (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    labor_cost DECIMAL(10, 2) DEFAULT NULL,
    partservice_total DECIMAL(10, 2) DEFAULT NULL,
    total_price DECIMAL(10, 2) DEFAULT NULL,
    FOREIGN KEY (service_id) REFERENCES Service(service_id)
);

-- Add foreign key constraint for invoice_id in Service table
ALTER TABLE Service
ADD CONSTRAINT fk_invoice
FOREIGN KEY (invoice_id) REFERENCES Invoice(invoice_id);

