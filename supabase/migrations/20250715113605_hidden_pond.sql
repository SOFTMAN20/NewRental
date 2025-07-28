/*
  # Fix Properties RLS Policies

  1. Issue
    - Current RLS policies are preventing landlords from creating properties
    - Error: "new row violates row-level security policy for table 'properties'"
    
  2. Solution
    - Drop existing problematic policies
    - Recreate simplified and working RLS policies
    - Ensure landlords can create, read, update, and delete their own properties
    - Allow public read access to active properties for browsing
    
  3. Security
    - Maintains security by ensuring users can only manage their own properties
    - Allows public viewing of active properties for the browse functionality
    - Prevents unauthorized access to inactive or other users' properties
*/

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Landlords can view their own properties" ON public.properties;
DROP POLICY IF EXISTS "Landlords can create properties" ON public.properties;
DROP POLICY IF EXISTS "Landlords can update their own properties" ON public.properties;
DROP POLICY IF EXISTS "Landlords can delete their own properties" ON public.properties;
DROP POLICY IF EXISTS "Anyone can view active properties" ON public.properties;

-- Create new, simplified RLS policies

-- Allow landlords to view their own properties
CREATE POLICY "Users can view their own properties" 
ON public.properties 
FOR SELECT 
USING (auth.uid() = landlord_id);

-- Allow authenticated users to create properties (they become the landlord)
CREATE POLICY "Authenticated users can create properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (auth.uid() = landlord_id AND auth.uid() IS NOT NULL);

-- Allow landlords to update their own properties
CREATE POLICY "Users can update their own properties" 
ON public.properties 
FOR UPDATE 
USING (auth.uid() = landlord_id);

-- Allow landlords to delete their own properties
CREATE POLICY "Users can delete their own properties" 
ON public.properties 
FOR DELETE 
USING (auth.uid() = landlord_id);

-- Allow anyone to view active properties (for public browsing)
CREATE POLICY "Public can view active properties" 
ON public.properties 
FOR SELECT 
USING (status = 'active');