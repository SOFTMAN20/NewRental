-- Fix the handle_new_user function to copy full_name and phone from metadata
-- This ensures that when users sign up, their full name and phone are saved to profiles

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_type TEXT;
  v_email_domain TEXT;
  v_university_id UUID;
BEGIN
  -- Extract email domain
  v_email_domain := split_part(NEW.email, '@', 2);
  
  -- Check if email domain matches a university
  SELECT id INTO v_university_id
  FROM public.universities
  WHERE v_email_domain = ANY(email_domains)
  LIMIT 1;
  
  -- Get user type from metadata, or determine from email domain
  v_user_type := COALESCE(
    NEW.raw_user_meta_data ->> 'user_type',
    CASE WHEN v_university_id IS NOT NULL THEN 'student' ELSE 'landlord' END
  );
  
  -- Insert profile with full_name and phone from metadata
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    phone, 
    user_type, 
    university_id, 
    verification_status
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'phone',
    v_user_type,
    v_university_id,
    CASE 
      WHEN v_user_type = 'student' THEN 'unverified'
      ELSE 'pending'
    END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sync existing users' data from metadata to profiles
UPDATE public.profiles p
SET 
  full_name = COALESCE(p.full_name, u.raw_user_meta_data ->> 'full_name'),
  phone = COALESCE(p.phone, u.raw_user_meta_data ->> 'phone'),
  user_type = COALESCE(u.raw_user_meta_data ->> 'user_type', p.user_type)
FROM auth.users u
WHERE p.id = u.id
  AND (
    p.full_name IS NULL 
    OR p.phone IS NULL 
    OR (u.raw_user_meta_data ->> 'user_type' IS NOT NULL AND u.raw_user_meta_data ->> 'user_type' != p.user_type)
  )
  AND u.raw_user_meta_data IS NOT NULL;
