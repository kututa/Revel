CREATE DATABASE IF NOT EXISTS bus_booking;

USE bus_booking;

-- Cities table
CREATE TABLE IF NOT EXISTS cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Buses table
CREATE TABLE IF NOT EXISTS buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate_number VARCHAR(20) NOT NULL UNIQUE,
    model VARCHAR(100) NOT NULL,
    from_city_id INT NOT NULL,
    to_city_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    departure_time TIME NOT NULL,
    duration VARCHAR(20) NOT NULL,
    total_seats INT NOT NULL,
    FOREIGN KEY (from_city_id) REFERENCES cities(id),
    FOREIGN KEY (to_city_id) REFERENCES cities(id)
);

-- Seats table
CREATE TABLE IF NOT EXISTS seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    seat_number INT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    UNIQUE KEY (bus_id, seat_number),
    FOREIGN KEY (bus_id) REFERENCES buses(id)
);

-- M-Pesa Transactions table (updated with JSON instead of JSONB)
CREATE TABLE IF NOT EXISTS mpesa_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  checkout_request_id VARCHAR(255),
  result_code INT,
  callback_metadata JSON,
  result_desc TEXT,
  raw_data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    travel_date DATE NOT NULL,
    customer_phone VARCHAR(20),
    payment_method ENUM('mpesa', 'card') NOT NULL,
    payment_reference VARCHAR(100),
    total_amount DECIMAL(10, 2) NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id)
);

-- Booking seats (junction table)
CREATE TABLE IF NOT EXISTS booking_seats (
    booking_id INT NOT NULL,
    seat_number INT NOT NULL,
    PRIMARY KEY (booking_id, seat_number),
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(20) NOT NULL UNIQUE,
    bus_id INT NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_phone VARCHAR(20) NOT NULL,
    seat_number INT NOT NULL,
    seat_type ENUM('Normal', 'VIP') NOT NULL,
    departure_city_id INT NOT NULL,
    destination_city_id INT NOT NULL,
    travel_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id),
    FOREIGN KEY (departure_city_id) REFERENCES cities(id),
    FOREIGN KEY (destination_city_id) REFERENCES cities(id)
);

-- Parcel sizes table
CREATE TABLE IF NOT EXISTS parcel_sizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(100) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL
);

-- Parcel deliveries table
CREATE TABLE IF NOT EXISTS parcel_deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tracking_number VARCHAR(20) NOT NULL UNIQUE,
    pickup_location_id INT NOT NULL,
    delivery_location_id INT NOT NULL,
    parcel_size_id INT NOT NULL,
    delivery_date DATE NOT NULL,
    receiver_name VARCHAR(100) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    estimated_cost DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Processing', 'In Transit', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pickup_location_id) REFERENCES cities(id),
    FOREIGN KEY (delivery_location_id) REFERENCES cities(id),
    FOREIGN KEY (parcel_size_id) REFERENCES parcel_sizes(id)
);

-- Parcel payments table
CREATE TABLE IF NOT EXISTS parcel_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    delivery_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('mpesa', 'card') NOT NULL,
    payment_reference VARCHAR(100),
    status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (delivery_id) REFERENCES parcel_deliveries(id)
);

-- Insert parcel sizes
INSERT IGNORE INTO parcel_sizes (name, description, base_price) VALUES
('Small', 'Small (up to 1 kg)', 200),
('Medium', 'Medium (1-3 kg)', 350),
('Large', 'Large (3-5 kg)', 500);