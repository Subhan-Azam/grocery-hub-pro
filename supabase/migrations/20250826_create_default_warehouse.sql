-- Insert a default warehouse for the grocery hub
INSERT INTO warehouses (
  id,
  name,
  address,
  city,
  state,
  zip_code,
  country,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Main Store',
  '123 Main Street',
  'Springfield',
  'IL',
  '62701',
  'USA',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;
