-- Add 'professional' to user_type constraint
-- This migration allows users to register as professionals in addition to tenants and landlords
-- Also keeps 'student' for backwards compatibility

-- Drop the existing constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- Add new constraint allowing student, tenant, landlord, and professional
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type IN ('student', 'tenant', 'landlord', 'professional'));
