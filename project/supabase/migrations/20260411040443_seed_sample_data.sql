
/*
  # Seed Sample Store and Product Data

  ## Purpose
  Adds initial sample stores and products so the app is usable immediately after setup.

  ## Data Added
  - 2 sample stores (ScaniMart Main Branch, ScaniMart West Wing)
  - 10 sample products with barcodes, pricing, and expiry dates across both stores
*/

INSERT INTO stores (id, name, address, phone, is_active) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'ScaniMart Main Branch', '123 Market Street, Downtown', '+1-555-0101', true),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'ScaniMart West Wing', '456 Commerce Ave, Westside', '+1-555-0202', true),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Delhi Super Market', '12 Connaught Place, Delhi', '+91-11-1234-5678', true),
  ('d4e5f6a7-b8c9-0123-def1-234567890123', 'Smart Point Grocery', '78 Nehru Nagar, Gurgaon', '+91-124-2345-6789', true),
  ('e5f6a7b8-c9d0-1234-ef12-345678901234', 'V-Mart Plaza', '34 Sector 19, Noida', '+91-120-3456-7890', true),
  ('f6a7b8c9-d0e1-2345-f123-456789012345', 'FamilyMart Express', '56 MG Road, Bangalore', '+91-80-4567-8901', true)
ON CONFLICT DO NOTHING;

INSERT INTO products (store_id, barcode, name, description, price, category, stock_quantity, manufacturing_date, expiry_date) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '8901234567890', 'Whole Wheat Bread', 'Freshly baked whole wheat loaf', 3.49, 'Bakery', 50, '2026-04-08', '2026-04-15'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '8902345678901', 'Full Cream Milk 1L', 'Farm fresh pasteurized milk', 1.99, 'Dairy', 120, '2026-04-10', '2026-04-17'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '8903456789012', 'Greek Yogurt 500g', 'Thick and creamy plain yogurt', 4.29, 'Dairy', 75, '2026-04-01', '2026-04-20'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '8904567890123', 'Orange Juice 2L', 'Fresh squeezed 100% orange juice', 5.49, 'Beverages', 60, '2026-04-05', '2026-04-19'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '8905678901234', 'Cheddar Cheese 400g', 'Aged sharp cheddar cheese block', 6.99, 'Dairy', 40, '2026-02-15', '2026-07-15'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', '8906789012345', 'Brown Rice 2kg', 'Organic long grain brown rice', 7.99, 'Grains', 200, '2025-10-01', '2027-10-01'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', '8907890123456', 'Pasta 500g', 'Italian durum wheat spaghetti', 2.49, 'Grains', 150, '2025-08-01', '2027-08-01'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', '8908901234567', 'Tomato Ketchup 500ml', 'Classic tomato ketchup sauce', 3.29, 'Condiments', 90, '2025-11-01', '2027-05-01'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', '8909012345678', 'Almonds 250g', 'Raw unsalted premium almonds', 9.99, 'Snacks', 55, '2026-01-01', '2026-10-01'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', '8900123456789', 'Mineral Water 500ml', 'Pure natural spring water', 0.99, 'Beverages', 300, '2026-03-01', '2028-03-01'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', '8910123456789', 'Masala Chai 1kg', 'Premium Indian tea masala blend', 5.99, 'Beverages', 80, '2026-03-20', '2027-03-20'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', '8911123456789', 'Atta Flour 5kg', 'Shakti Bhog whole wheat flour', 12.49, 'Grocery', 90, '2026-03-15', '2027-03-15'),
  ('d4e5f6a7-b8c9-0123-def1-234567890123', '8912123456789', 'Fresh Paneer 500g', 'Homemade cottage cheese block', 4.99, 'Dairy', 65, '2026-04-10', '2026-04-18'),
  ('d4e5f6a7-b8c9-0123-def1-234567890123', '8913123456789', 'Masala Dosa Batter 1kg', 'Ready-to-cook dosa batter', 3.29, 'Frozen', 40, '2026-04-05', '2026-04-14'),
  ('e5f6a7b8-c9d0-1234-ef12-345678901234', '8914123456789', 'Soya Chunks 200g', 'High-protein soya nuggets', 2.79, 'Grocery', 120, '2026-03-25', '2027-03-25'),
  ('e5f6a7b8-c9d0-1234-ef12-345678901234', '8915123456789', 'Lentils 1kg', 'Premium split masoor dal', 3.69, 'Grains', 140, '2026-03-18', '2027-03-18'),
  ('f6a7b8c9-d0e1-2345-f123-456789012345', '8916123456789', 'Organic Honey 250g', 'Natural wildflower honey jar', 8.99, 'Grocery', 50, '2026-02-20', '2028-02-20'),
  ('f6a7b8c9-d0e1-2345-f123-456789012345', '8917123456789', 'Coffee Powder 200g', 'Strong Indian coffee blend', 4.49, 'Beverages', 70, '2026-03-05', '2027-03-05')
ON CONFLICT DO NOTHING;
