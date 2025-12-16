-- Database: blue_space_coffee
-- Sistem Pemesanan dan Reservasi Blue Space Coffee

CREATE DATABASE IF NOT EXISTS blue_space_coffee;
USE blue_space_coffee;

-- Tabel Kategori Menu
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Menu Items
CREATE TABLE menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    preparation_time INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tabel Meja
CREATE TABLE tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_number VARCHAR(10) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    location ENUM('indoor', 'outdoor', 'window') DEFAULT 'indoor',
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Pelanggan
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Reservasi
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    table_id INT,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    party_size INT NOT NULL,
    special_requests TEXT,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (table_id) REFERENCES tables(id)
);

-- Tabel Pesanan
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    order_type ENUM('dine_in', 'takeaway', 'delivery') NOT NULL,
    table_id INT NULL,
    delivery_address TEXT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'qris') NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    order_status ENUM('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (table_id) REFERENCES tables(id)
);

-- Tabel Detail Pesanan
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    menu_item_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Insert data kategori
INSERT INTO categories (name, description) VALUES
('Kopi', 'Berbagai macam kopi premium'),
('Makanan', 'Makanan ringan dan berat'),
('Minuman Non-Kopi', 'Teh, jus, dan minuman segar lainnya'),
('Dessert', 'Kue dan makanan penutup');

-- Insert data menu items
INSERT INTO menu_items (category_id, name, description, price, image_url, preparation_time) VALUES
(1, 'Espresso', 'Kopi hitam pekat dengan rasa yang kuat', 15000, 'espresso.jpg', 5),
(1, 'Cappuccino', 'Espresso dengan susu steamed dan foam', 25000, 'cappuccino.jpg', 8),
(1, 'Latte', 'Espresso dengan susu steamed dan sedikit foam', 28000, 'latte.jpg', 8),
(1, 'Americano', 'Espresso dengan air panas', 18000, 'americano.jpg', 5),
(1, 'Cold Brew', 'Kopi dingin dengan rasa smooth', 22000, 'coldbrew.jpg', 3),
(2, 'Sandwich Club', 'Sandwich dengan ayam, sayuran segar', 35000, 'sandwich.jpg', 12),
(2, 'Pasta Carbonara', 'Pasta dengan saus krim dan bacon', 45000, 'pasta.jpg', 15),
(2, 'Nasi Goreng Spesial', 'Nasi goreng dengan telur dan ayam', 32000, 'nasigoreng.jpg', 12),
(3, 'Teh Tarik', 'Teh dengan susu yang ditarik', 12000, 'tehtarik.jpg', 5),
(3, 'Jus Jeruk Segar', 'Jus jeruk murni tanpa gula tambahan', 15000, 'jusjeruk.jpg', 3),
(4, 'Tiramisu', 'Dessert Italia dengan kopi dan mascarpone', 28000, 'tiramisu.jpg', 2),
(4, 'Cheesecake', 'Kue keju dengan topping berry', 25000, 'cheesecake.jpg', 2);

-- Insert data meja
INSERT INTO tables (table_number, capacity, location) VALUES
('A1', 2, 'window'),
('A2', 2, 'window'),
('B1', 4, 'indoor'),
('B2', 4, 'indoor'),
('B3', 4, 'indoor'),
('C1', 6, 'indoor'),
('C2', 6, 'indoor'),
('D1', 2, 'outdoor'),
('D2', 4, 'outdoor'),
('D3', 6, 'outdoor');
