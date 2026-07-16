-- Textile Shop Manager Pro
-- Supabase / PostgreSQL Schema & RLS Policies

-- 1. Enable UUID Extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'Uncategorized',
    sub_category TEXT DEFAULT '',
    brand TEXT DEFAULT '',
    supplier_id TEXT DEFAULT '',
    purchase_price NUMERIC(12,2) DEFAULT 0.0,
    selling_price NUMERIC(12,2) DEFAULT 0.0,
    mrp NUMERIC(12,2) DEFAULT 0.0,
    discount NUMERIC(12,2) DEFAULT 0.0,
    gst_percent NUMERIC(5,2) DEFAULT 0.0,
    color TEXT DEFAULT '',
    size TEXT DEFAULT '',
    pattern TEXT DEFAULT '',
    fabric TEXT DEFAULT '',
    hsn_code TEXT DEFAULT '',
    stock_quantity INT DEFAULT 0,
    min_stock INT DEFAULT 5,
    rack_number TEXT DEFAULT '',
    remarks TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    last_updated BIGINT NOT NULL DEFAULT (extract(epoch from now()) * 1000)::bigint,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Indexes for products
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products (name);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);

-- 3. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    mobile TEXT DEFAULT '',
    address TEXT DEFAULT '',
    outstanding_balance NUMERIC(12,2) DEFAULT 0.0,
    last_updated BIGINT NOT NULL DEFAULT (extract(epoch from now()) * 1000)::bigint,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Indexes for customers
CREATE INDEX IF NOT EXISTS idx_customers_mobile ON public.customers (mobile);

-- 4. Suppliers Table
CREATE TABLE IF NOT EXISTS public.suppliers (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    contact TEXT DEFAULT '',
    gst_number TEXT DEFAULT '',
    pending_payment NUMERIC(12,2) DEFAULT 0.0,
    last_updated BIGINT NOT NULL DEFAULT (extract(epoch from now()) * 1000)::bigint,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- 5. Sales / Invoices Table
CREATE TABLE IF NOT EXISTS public.sales (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    invoice_number TEXT NOT NULL UNIQUE,
    customer_id TEXT DEFAULT '',
    customer_name TEXT NOT NULL,
    date BIGINT NOT NULL,
    total_amount NUMERIC(12,2) DEFAULT 0.0,
    discount NUMERIC(12,2) DEFAULT 0.0,
    gst_amount NUMERIC(12,2) DEFAULT 0.0,
    grand_total NUMERIC(12,2) DEFAULT 0.0,
    payment_mode TEXT NOT NULL, -- CASH, UPI, CARD, CREDIT, SPLIT
    payment_status TEXT NOT NULL, -- PAID, PENDING
    last_updated BIGINT NOT NULL DEFAULT (extract(epoch from now()) * 1000)::bigint
);

-- 6. Sale Items Table
CREATE TABLE IF NOT EXISTS public.sale_items (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    sale_id TEXT NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,
    quantity INT NOT NULL,
    rate NUMERIC(12,2) NOT NULL,
    total NUMERIC(12,2) NOT NULL
);

-- 7. Purchases Table
CREATE TABLE IF NOT EXISTS public.purchases (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    supplier_id TEXT NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    supplier_name TEXT NOT NULL,
    invoice_number TEXT DEFAULT '',
    date BIGINT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    last_updated BIGINT NOT NULL DEFAULT (extract(epoch from now()) * 1000)::bigint
);

-- 8. Stock Transactions Table
CREATE TABLE IF NOT EXISTS public.stock_transactions (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    type TEXT NOT NULL, -- IN, OUT, ADJUSTMENT, DAMAGED, RETURNED
    quantity INT NOT NULL,
    date BIGINT NOT NULL,
    remarks TEXT DEFAULT '',
    last_updated BIGINT NOT NULL DEFAULT (extract(epoch from now()) * 1000)::bigint
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_transactions ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies allowing authenticated users read/write access
CREATE POLICY "Allow all actions for authenticated owners/employees" 
ON public.products 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all actions for authenticated owners/employees" 
ON public.customers 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all actions for authenticated owners/employees" 
ON public.suppliers 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all actions for authenticated owners/employees" 
ON public.sales 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all actions for authenticated owners/employees" 
ON public.sale_items 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all actions for authenticated owners/employees" 
ON public.purchases 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all actions for authenticated owners/employees" 
ON public.stock_transactions 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
