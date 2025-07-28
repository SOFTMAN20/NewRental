-- Add foreign key constraint between properties and profiles
ALTER TABLE public.properties 
ADD CONSTRAINT fk_landlord_profile 
FOREIGN KEY (landlord_id) 
REFERENCES public.profiles(user_id) 
ON DELETE CASCADE;