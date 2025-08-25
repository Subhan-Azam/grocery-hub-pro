-- Fix RLS policies for categories table to allow INSERT/UPDATE operations
DROP POLICY IF EXISTS "Authenticated users can view all data" ON public.categories;

-- Create separate policies for different operations
CREATE POLICY "Authenticated users can select categories" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories" 
ON public.categories 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories" 
ON public.categories 
FOR DELETE 
USING (true);

-- Fix RLS policies for products table to allow INSERT/UPDATE operations
DROP POLICY IF EXISTS "Authenticated users can view all data" ON public.products;

-- Create separate policies for different operations
CREATE POLICY "Authenticated users can select products" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" 
ON public.products 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products" 
ON public.products 
FOR DELETE 
USING (true);

-- Fix RLS policies for suppliers table
DROP POLICY IF EXISTS "Authenticated users can view all data" ON public.suppliers;

CREATE POLICY "Authenticated users can select suppliers" 
ON public.suppliers 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert suppliers" 
ON public.suppliers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update suppliers" 
ON public.suppliers 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete suppliers" 
ON public.suppliers 
FOR DELETE 
USING (true);

-- Fix RLS policies for orders table
DROP POLICY IF EXISTS "Authenticated users can view all data" ON public.orders;

CREATE POLICY "Authenticated users can select orders" 
ON public.orders 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders" 
ON public.orders 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete orders" 
ON public.orders 
FOR DELETE 
USING (true);