-- Vendor Types
     CREATE TABLE vendor_types (
         id SERIAL PRIMARY KEY,
         name VARCHAR(50) NOT NULL UNIQUE,
         description TEXT,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     -- Vendors
     CREATE TABLE vendors (
         id SERIAL PRIMARY KEY,
         vendor_type_id INTEGER NOT NULL REFERENCES vendor_types(id) ON DELETE RESTRICT,
         name VARCHAR(255) NOT NULL,
         email VARCHAR(255) UNIQUE NOT NULL,
         password VARCHAR(255) NOT NULL,
         shop_name VARCHAR(255) NOT NULL,
         commission_rate DECIMAL(5, 2) DEFAULT 0.00,
         rating DECIMAL(3, 2) DEFAULT 0.00,
         branch_count INTEGER DEFAULT 1,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     -- Branches
     CREATE TABLE branches (
         id SERIAL PRIMARY KEY,
         vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
         name VARCHAR(255) NOT NULL,
         address TEXT NOT NULL,
         contact_number VARCHAR(20),
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     -- Customers (managed by Supabase Auth, but we'll create for custom fields)
     CREATE TABLE customers (
         id SERIAL PRIMARY KEY,
         name VARCHAR(255) NOT NULL,
         email VARCHAR(255) UNIQUE NOT NULL,
         password VARCHAR(255) NOT NULL,
         wallet DECIMAL(15, 2) DEFAULT 0.00,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     -- Products
     CREATE TABLE products (
         id SERIAL PRIMARY KEY,
         vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
         branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL,
         name VARCHAR(255) NOT NULL,
         description TEXT,
         base_price DECIMAL(15, 2) NOT NULL,
         stock INTEGER NOT NULL,
         category_id INTEGER,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     -- Product Variants
     CREATE TABLE product_variants (
         id SERIAL PRIMARY KEY,
         product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
         variant_name VARCHAR(50) NOT NULL,
         variant_value VARCHAR(50) NOT NULL,
         price_adjustment DECIMAL(15, 2) DEFAULT 0.00,
         stock INTEGER NOT NULL,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     -- Categories
     CREATE TABLE categories (
         id SERIAL PRIMARY KEY,
         name VARCHAR(255) NOT NULL,
         parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     -- Orders
     CREATE TABLE orders (
         id SERIAL PRIMARY KEY,
         customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
         vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
         branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL,
         status VARCHAR(50) NOT NULL,
         total DECIMAL(15, 2) NOT NULL,
         expected_delivery_date DATE,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     -- Order Details
     CREATE TABLE order_details (
         id SERIAL PRIMARY KEY,
         order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
         product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
         variant_id INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
         quantity INTEGER NOT NULL,
         price DECIMAL(15, 2) NOT NULL,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     -- Transactions
     CREATE TABLE transactions (
         id SERIAL PRIMARY KEY,
         order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
         vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
         amount DECIMAL(15, 2) NOT NULL,
         payment_method VARCHAR(50) NOT NULL,
         payment_details TEXT,
         status VARCHAR(50) NOT NULL,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     -- Shipping Methods
     CREATE TABLE shipping_methods (
         id SERIAL PRIMARY KEY,
         name VARCHAR(50) NOT NULL,
         cost DECIMAL(15, 2) NOT NULL,
         is_active BOOLEAN DEFAULT TRUE,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     -- Order Shipping
     CREATE TABLE order_shipping (
         id SERIAL PRIMARY KEY,
         order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
         shipping_method_id INTEGER NOT NULL REFERENCES shipping_methods(id) ON DELETE RESTRICT,
         tracking_number VARCHAR(50),
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     -- Notifications
     CREATE TABLE notifications (
         id SERIAL PRIMARY KEY,
         user_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
         type VARCHAR(50) NOT NULL,
         message TEXT NOT NULL,
         is_read BOOLEAN DEFAULT FALSE,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     -- Analytics
     CREATE TABLE analytics (
         id SERIAL PRIMARY KEY,
         vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
         metric_type VARCHAR(50) NOT NULL,
         value DECIMAL(15, 2) NOT NULL,
         date_recorded DATE NOT NULL,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     -- Reviews
     CREATE TABLE reviews (
         id SERIAL PRIMARY KEY,
         customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
         product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
         rating INTEGER NOT NULL,
         comment TEXT,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     -- Support Tickets
     CREATE TABLE support_tickets (
         id SERIAL PRIMARY KEY,
         customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
         vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
         subject VARCHAR(255) NOT NULL,
         description TEXT,
         status VARCHAR(50) NOT NULL,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

     -- Trigger for updated_at
     CREATE OR REPLACE FUNCTION update_updated_at_column()
     RETURNS TRIGGER AS $$
     BEGIN
         NEW.updated_at = CURRENT_TIMESTAMP;
         RETURN NEW;
     END;
     $$ language 'plpgsql';

     CREATE TRIGGER update_vendors_updated_at
         BEFORE UPDATE ON vendors
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();

     CREATE TRIGGER update_branches_updated_at
         BEFORE UPDATE ON branches
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();

     CREATE TRIGGER update_customers_updated_at
         BEFORE UPDATE ON customers
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();

     CREATE TRIGGER update_products_updated_at
         BEFORE UPDATE ON products
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();

     CREATE TRIGGER update_categories_updated_at
         BEFORE UPDATE ON categories
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();

     CREATE TRIGGER update_orders_updated_at
         BEFORE UPDATE ON orders
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();

     CREATE TRIGGER update_support_tickets_updated_at
         BEFORE UPDATE ON support_tickets
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();