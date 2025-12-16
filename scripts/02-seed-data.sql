-- Seed data for Blue Space Coffee

-- Insert menu categories
INSERT INTO menu_categories (name, description, display_order) VALUES
('Coffee', 'Premium coffee beverages made with locally roasted beans', 1),
('Tea & Non-Coffee', 'Refreshing teas and non-caffeinated beverages', 2),
('Pastries & Desserts', 'Fresh baked goods and sweet treats', 3),
('Light Meals', 'Sandwiches, salads, and light dining options', 4),
('Breakfast', 'Morning favorites to start your day right', 5);

-- Insert sample menu items
INSERT INTO menu_items (category_id, name, description, price, is_available, preparation_time) VALUES
-- Coffee
(1, 'Blue Space Signature Blend', 'Our house blend with notes of chocolate and caramel', 25000, true, 5),
(1, 'Espresso', 'Rich and bold single shot', 18000, true, 3),
(1, 'Cappuccino', 'Perfect balance of espresso, steamed milk, and foam', 28000, true, 6),
(1, 'Latte', 'Smooth espresso with steamed milk and light foam', 30000, true, 6),
(1, 'Americano', 'Espresso with hot water for a clean, strong taste', 22000, true, 4),
(1, 'Mocha', 'Espresso with chocolate syrup and steamed milk', 35000, true, 7),
(1, 'Cold Brew', 'Smooth, less acidic coffee brewed cold for 12 hours', 32000, true, 2),

-- Tea & Non-Coffee
(2, 'Earl Grey Tea', 'Classic bergamot-flavored black tea', 20000, true, 5),
(2, 'Green Tea Latte', 'Matcha powder with steamed milk', 28000, true, 6),
(2, 'Chamomile Tea', 'Relaxing herbal tea perfect for evening', 18000, true, 5),
(2, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 25000, true, 3),
(2, 'Iced Chocolate', 'Rich chocolate drink served cold', 30000, true, 5),

-- Pastries & Desserts
(3, 'Croissant', 'Buttery, flaky French pastry', 15000, true, 2),
(3, 'Blueberry Muffin', 'Fresh baked muffin with real blueberries', 18000, true, 2),
(3, 'Chocolate Cake Slice', 'Rich chocolate cake with ganache', 35000, true, 2),
(3, 'Cheesecake Slice', 'Creamy New York style cheesecake', 38000, true, 2),
(3, 'Cookies (3 pieces)', 'Assorted freshly baked cookies', 20000, true, 1),

-- Light Meals
(4, 'Club Sandwich', 'Triple-decker with chicken, bacon, lettuce, tomato', 45000, true, 12),
(4, 'Caesar Salad', 'Fresh romaine with parmesan and croutons', 38000, true, 8),
(4, 'Grilled Chicken Wrap', 'Grilled chicken with vegetables in tortilla wrap', 42000, true, 10),
(4, 'Tuna Sandwich', 'Fresh tuna salad on artisan bread', 35000, true, 8),

-- Breakfast
(5, 'Pancakes (3 pieces)', 'Fluffy pancakes with maple syrup and butter', 40000, true, 15),
(5, 'Eggs Benedict', 'Poached eggs on English muffin with hollandaise', 48000, true, 18),
(5, 'Avocado Toast', 'Smashed avocado on sourdough with seasoning', 35000, true, 8),
(5, 'Breakfast Burrito', 'Scrambled eggs, cheese, and vegetables in tortilla', 42000, true, 12);

-- Insert restaurant tables
INSERT INTO restaurant_tables (table_number, capacity, location) VALUES
('T01', 2, 'window'),
('T02', 2, 'window'),
('T03', 4, 'indoor'),
('T04', 4, 'indoor'),
('T05', 6, 'indoor'),
('T06', 2, 'outdoor'),
('T07', 2, 'outdoor'),
('T08', 4, 'outdoor'),
('T09', 8, 'indoor'),
('T10', 2, 'indoor');

-- Insert sample customer (for testing)
INSERT INTO customers (name, email, phone) VALUES
('John Doe', 'john.doe@example.com', '+62812345678'),
('Jane Smith', 'jane.smith@example.com', '+62887654321');
