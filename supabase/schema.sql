-- ==============================================================================
-- NEXACARE — SMART VEHICLE SERVICE & MANAGEMENT SYSTEM (VSMS)
-- SUPABASE POSTGRESQL DATABASE SCHEMA & RLS POLICIES
-- Copy and paste this directly into your Supabase project's SQL Editor and click RUN.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. DROP EXISTING TABLES (FOR CLEAN MIGRATION IF RERUN)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reminders CASCADE;
DROP TABLE IF EXISTS parts_requests CASCADE;
DROP TABLE IF EXISTS service_progress CASCADE;
DROP TABLE IF EXISTS service_records CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS spare_parts CASCADE;
DROP TABLE IF EXISTS technicians CASCADE;
DROP TABLE IF EXISTS staff_requests CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 3. TABLE: PROFILES (Extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('ADMIN', 'CUSTOMER', 'SERVICE_PROVIDER', 'TECHNICIAN', 'INVENTORY_MANAGER')),
  avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  address TEXT,
  city TEXT DEFAULT 'Coimbatore',
  specialty TEXT,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'SUSPENDED', 'INACTIVE')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3b. TABLE: STAFF_REQUESTS (For Staff Registration Requests awaiting Admin Approval)
CREATE TABLE IF NOT EXISTS staff_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('TECHNICIAN', 'SERVICE_PROVIDER', 'INVENTORY_MANAGER')),
  specialty TEXT,
  experience_years INT DEFAULT 1,
  qualifications TEXT,
  address TEXT,
  city TEXT DEFAULT 'Coimbatore',
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

-- 4. TABLE: VEHICLES
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  owner_name TEXT,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT,
  registration_number TEXT NOT NULL UNIQUE,
  fuel_type TEXT DEFAULT 'Petrol' CHECK (fuel_type IN ('Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid')),
  mileage TEXT,
  last_service_date DATE,
  insurance_expiry DATE,
  puc_expiry DATE,
  image TEXT DEFAULT 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'IN_SERVICE', 'INACTIVE')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABLE: TECHNICIANS
CREATE TABLE technicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  specialty TEXT NOT NULL,
  experience_years INT DEFAULT 3,
  rating NUMERIC(3,2) DEFAULT 4.85,
  active_jobs_count INT DEFAULT 0,
  completed_jobs INT DEFAULT 0,
  certifications TEXT DEFAULT 'ASE Certified Automotive Specialist',
  avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TABLE: SPARE_PARTS (NexaCare Inventory)
CREATE TABLE spare_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  compatible_models TEXT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  available_quantity INT NOT NULL DEFAULT 0,
  minimum_stock INT NOT NULL DEFAULT 5,
  location TEXT DEFAULT 'Shelf A-1',
  supplier TEXT DEFAULT 'NexaCare OEM Direct',
  status TEXT DEFAULT 'IN_STOCK' CHECK (status IN ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK')),
  image TEXT DEFAULT 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=80',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. TABLE: APPOINTMENTS
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT UNIQUE,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  vehicle_name TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  provider_id TEXT DEFAULT 'usr-prov-1',
  provider_name TEXT DEFAULT 'NexaCare Service Center',
  technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
  technician_name TEXT,
  service_type TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT NOT NULL,
  problem_description TEXT NOT NULL,
  additional_notes TEXT,
  estimated_cost NUMERIC(10,2) DEFAULT 1500.00,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN (
    'PENDING', 'ACCEPTED', 'TECHNICIAN_ASSIGNED', 'VEHICLE_RECEIVED',
    'INSPECTION', 'IN_PROGRESS', 'PARTS_REQUIRED', 'QUALITY_CHECK',
    'COMPLETED', 'VEHICLE_READY', 'REJECTED', 'CANCELLED'
  )),
  progress_percentage INT DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. TABLE: SERVICE_RECORDS (Completed Job Records & Receipts)
CREATE TABLE service_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  inspection_checklist JSONB DEFAULT '{}'::jsonb,
  inspection_notes TEXT,
  work_performed TEXT,
  total_cost NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  completed_date DATE DEFAULT CURRENT_DATE,
  invoice_number TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. TABLE: SERVICE_PROGRESS (Audit Trail of Stage Transitions)
CREATE TABLE service_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  updated_by TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- 10. TABLE: PARTS_REQUESTS (Bay Mechanics -> Inventory Manager)
CREATE TABLE parts_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  technician_name TEXT,
  part_id UUID REFERENCES spare_parts(id) ON DELETE CASCADE,
  part_number TEXT,
  part_name TEXT NOT NULL,
  requested_quantity INT NOT NULL DEFAULT 1,
  issued_quantity INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'ISSUED', 'REJECTED')),
  reason TEXT,
  requested_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  issued_at TIMESTAMPTZ,
  rejection_reason TEXT
);

-- 11. TABLE: REMINDERS
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  vehicle_name TEXT,
  title TEXT NOT NULL,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('SERVICE', 'INSURANCE', 'EMISSION_PUC', 'TYRE_ROTATION', 'BATTERY_CHECK', 'GENERAL')),
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DISMISSED', 'COMPLETED')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. TABLE: NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  badge TEXT DEFAULT 'INFO',
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_vehicles_owner ON vehicles(owner_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_service_records_customer ON service_records(customer_id);
CREATE INDEX IF NOT EXISTS idx_parts_requests_status ON parts_requests(status);
CREATE INDEX IF NOT EXISTS idx_reminders_user ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE spare_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's role from profiles
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 1. PROFILES POLICIES
CREATE POLICY "Public read profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile or admin" ON profiles
  FOR UPDATE USING (auth.uid() = id OR public.get_current_role() = 'ADMIN');

CREATE POLICY "Users and Admin can insert profiles" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR public.get_current_role() = 'ADMIN');

-- 1b. STAFF REQUESTS POLICIES
CREATE POLICY "Anyone can insert staff requests" ON staff_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin and owner can view staff requests" ON staff_requests
  FOR SELECT USING (auth.uid() = user_id OR public.get_current_role() = 'ADMIN');

CREATE POLICY "Admin can update staff requests" ON staff_requests
  FOR UPDATE USING (public.get_current_role() = 'ADMIN');

-- 2. VEHICLES POLICIES
CREATE POLICY "Users can view own vehicles or staff can view all" ON vehicles
  FOR SELECT USING (
    auth.uid() = owner_id OR
    public.get_current_role() IN ('ADMIN', 'SERVICE_PROVIDER', 'TECHNICIAN')
  );

CREATE POLICY "Users can insert own vehicles" ON vehicles
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id OR
    public.get_current_role() = 'ADMIN'
  );

CREATE POLICY "Users can update own vehicles" ON vehicles
  FOR UPDATE USING (
    auth.uid() = owner_id OR
    public.get_current_role() = 'ADMIN'
  );

CREATE POLICY "Users can delete own vehicles" ON vehicles
  FOR DELETE USING (
    auth.uid() = owner_id OR
    public.get_current_role() = 'ADMIN'
  );

-- 3. TECHNICIANS POLICIES
CREATE POLICY "Everyone can view technicians" ON technicians
  FOR SELECT USING (true);

CREATE POLICY "Staff and Admin can manage technicians" ON technicians
  FOR ALL USING (
    public.get_current_role() IN ('ADMIN', 'SERVICE_PROVIDER')
  );

-- 4. SPARE PARTS POLICIES
CREATE POLICY "Everyone can view spare parts" ON spare_parts
  FOR SELECT USING (true);

CREATE POLICY "Inventory Manager and Admin can manage spare parts" ON spare_parts
  FOR ALL USING (
    public.get_current_role() IN ('ADMIN', 'INVENTORY_MANAGER')
  );

-- 5. APPOINTMENTS POLICIES
CREATE POLICY "Users view own appointments or staff view all" ON appointments
  FOR SELECT USING (
    auth.uid() = customer_id OR
    public.get_current_role() IN ('ADMIN', 'SERVICE_PROVIDER', 'TECHNICIAN', 'INVENTORY_MANAGER')
  );

CREATE POLICY "Customers and Admin can create appointments" ON appointments
  FOR INSERT WITH CHECK (
    auth.uid() = customer_id OR
    public.get_current_role() IN ('ADMIN', 'CUSTOMER')
  );

CREATE POLICY "Customers and Staff can update appointments" ON appointments
  FOR UPDATE USING (
    auth.uid() = customer_id OR
    public.get_current_role() IN ('ADMIN', 'SERVICE_PROVIDER', 'TECHNICIAN')
  );

-- 6. SERVICE RECORDS POLICIES
CREATE POLICY "Users view own records or staff view all" ON service_records
  FOR SELECT USING (
    auth.uid() = customer_id OR
    public.get_current_role() IN ('ADMIN', 'SERVICE_PROVIDER', 'TECHNICIAN')
  );

CREATE POLICY "Staff can manage service records" ON service_records
  FOR ALL USING (
    public.get_current_role() IN ('ADMIN', 'SERVICE_PROVIDER', 'TECHNICIAN')
  );

-- 7. SERVICE PROGRESS POLICIES
CREATE POLICY "Everyone can view service progress" ON service_progress
  FOR SELECT USING (true);

CREATE POLICY "Staff can insert service progress" ON service_progress
  FOR INSERT WITH CHECK (
    public.get_current_role() IN ('ADMIN', 'SERVICE_PROVIDER', 'TECHNICIAN')
  );

-- 8. PARTS REQUESTS POLICIES
CREATE POLICY "Staff can view parts requests" ON parts_requests
  FOR SELECT USING (
    public.get_current_role() IN ('ADMIN', 'SERVICE_PROVIDER', 'TECHNICIAN', 'INVENTORY_MANAGER')
  );

CREATE POLICY "Technicians can create parts requests" ON parts_requests
  FOR INSERT WITH CHECK (
    public.get_current_role() IN ('ADMIN', 'TECHNICIAN')
  );

CREATE POLICY "Inventory Manager and Admin can update parts requests" ON parts_requests
  FOR UPDATE USING (
    public.get_current_role() IN ('ADMIN', 'INVENTORY_MANAGER', 'SERVICE_PROVIDER')
  );

-- 9. REMINDERS POLICIES
CREATE POLICY "Users can manage own reminders" ON reminders
  FOR ALL USING (
    auth.uid() = user_id OR
    public.get_current_role() = 'ADMIN'
  );

-- 10. NOTIFICATIONS POLICIES
CREATE POLICY "Users view own or role notifications" ON notifications
  FOR SELECT USING (
    auth.uid() = user_id OR
    role = public.get_current_role() OR
    public.get_current_role() = 'ADMIN'
  );

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (
    auth.uid() = user_id OR
    public.get_current_role() = 'ADMIN'
  );

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER (ON AUTH.USERS SIGNUP)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, role, city)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone', '+91 98432 00000'),
    COALESCE(new.raw_user_meta_data->>'role', 'CUSTOMER'),
    COALESCE(new.raw_user_meta_data->>'city', 'Coimbatore')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = COALESCE(EXCLUDED.role, profiles.role);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- SEED DATA: REALISTIC INDIAN MOCK DATA FOR NEXACARE
-- ==============================================================================

-- 1. Seed Spare Parts
INSERT INTO spare_parts (part_number, name, category, brand, compatible_models, unit_price, available_quantity, minimum_stock, location, supplier, status)
VALUES
  ('NX-BRK-001', 'Ceramic Front Brake Pads Set', 'Brakes', 'Brembo OEM', 'Hyundai Creta, Kia Seltos, Maruti Brezza', 1450.00, 24, 8, 'Bay 1 / Shelf A', 'NexaCare Direct', 'IN_STOCK'),
  ('NX-OIL-5W30', 'Fully Synthetic 5W-30 Engine Oil (4L)', 'Fluids & Lubricants', 'Castrol EDGE', 'Universal Petrol & Turbo Diesel', 2800.00, 35, 10, 'Bay 2 / Drum Rack', 'Castrol India', 'IN_STOCK'),
  ('NX-FLT-OIL02', 'High Efficiency Spin-on Oil Filter', 'Filters', 'Bosch OE', 'Tata Nexon, Maruti Swift, Hyundai i20', 380.00, 42, 12, 'Shelf B-2', 'Bosch Automotive India', 'IN_STOCK'),
  ('NX-FLT-AIR05', 'Engine Intake Air Filter Cartridge', 'Filters', 'Mann-Filter', 'Honda City, Hyundai Verna, VW Virtus', 550.00, 18, 6, 'Shelf B-3', 'Mann Filters Coimbatore', 'IN_STOCK'),
  ('NX-SPK-IR08', 'Iridium Laser Spark Plugs (Pack of 4)', 'Ignition', 'NGK Laser', 'Maruti Baleno, Swift, Brezza Petrol', 1900.00, 12, 5, 'Shelf C-1', 'NGK Spark Plugs India', 'IN_STOCK'),
  ('NX-BAT-12V45', '12V 45Ah Maintenance Free Car Battery', 'Electrical', 'Exide Mileage', 'Maruti Dzire, Hyundai Venue, Tata Punch', 4200.00, 8, 4, 'Battery Bay E', 'Exide Industries Salem', 'IN_STOCK'),
  ('NX-SUS-LNK01', 'Front Stabilizer Link Rod Assembly', 'Suspension', 'TRW Heavy Duty', 'Toyota Innova Crysta, Fortuner', 1250.00, 4, 5, 'Shelf D-2', 'TRW Automotive Chennai', 'LOW_STOCK'),
  ('NX-BLT-TIM03', 'Timing Belt & Tensioner Pulley Kit', 'Engine Components', 'Gates PowerGrip', 'Mahindra XUV700, Scorpio-N, Thar', 3600.00, 3, 4, 'Shelf D-4', 'Gates India', 'LOW_STOCK'),
  ('NX-WPR-24IN', 'Aerodynamic Silicone Wiper Blades (Pair)', 'Accessories', 'Michelin RainForce', 'Universal 24" + 16" Sizes', 750.00, 28, 8, 'Rack F-1', 'Michelin India', 'IN_STOCK'),
  ('NX-CLT-PLT09', 'Heavy Duty Clutch Plate & Pressure Plate', 'Drivetrain', 'Valeo OE', 'Tata Nexon Diesel, Safari, Harrier', 5800.00, 0, 3, 'Shelf G-1', 'Valeo India Erode', 'OUT_OF_STOCK')
ON CONFLICT (part_number) DO NOTHING;

-- 2. Seed Technicians
INSERT INTO technicians (name, email, phone, specialty, experience_years, rating, active_jobs_count, completed_jobs, certifications, avatar)
VALUES
  ('Vignesh Kumar', 'vignesh@nexacare.in', '+91 96290 45678', 'Engine Diagnostics & Multi-Point Inspection', 6, 4.90, 2, 142, 'Master Automobile Diagnostic Specialist (Bosch Certified)', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'),
  ('Santhosh M', 'santhosh@nexacare.in', '+91 98940 56789', 'Brakes, Suspension & Wheel Alignment', 5, 4.85, 1, 98, 'Certified Chassis & Hydraulic Brakes Engineer', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'),
  ('Dinesh K', 'dinesh@nexacare.in', '+91 98425 67890', 'AC Cooling & Electrical Diagnostics', 4, 4.80, 1, 84, 'HVAC Certified Refrigerant Technician', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'),
  ('Praveen Kumar', 'praveen@nexacare.in', '+91 98436 78901', 'Periodic Maintenance & Quality Check', 7, 4.95, 0, 195, 'Senior Road-Test & Quality Assurance Inspector', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80')
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 3. MANUAL ADMIN ACCOUNT SETUP (SINGLE ADMIN ONLY)
-- ==============================================================================
-- To set up your single Admin account:
-- 1. Sign up once via the app or Supabase Auth dashboard with your admin email (e.g. admin@nexacare.in).
-- 2. Run this SQL command in your Supabase SQL Editor to set the role to ADMIN:
--
--    UPDATE profiles 
--    SET role = 'ADMIN', status = 'ACTIVE' 
--    WHERE email = 'admin@nexacare.in';
-- ==============================================================================
