
-- Create properties table for landlords to list their houses
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  landlord_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  location TEXT NOT NULL,
  full_address TEXT,
  property_type TEXT CHECK (property_type IN ('apartment', 'house', 'room', 'studio')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqm DECIMAL(8,2),
  electricity BOOLEAN DEFAULT false,
  water BOOLEAN DEFAULT false,
  furnished BOOLEAN DEFAULT false,
  parking BOOLEAN DEFAULT false,
  security BOOLEAN DEFAULT false,
  nearby_services TEXT[], -- Array to store services like 'school', 'hospital', 'market', etc.
  images TEXT[], -- Array to store image URLs
  status TEXT CHECK (status IN ('active', 'inactive', 'rented')) DEFAULT 'active',
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Foreign key constraint to profiles table
  CONSTRAINT fk_landlord_profile 
    FOREIGN KEY (landlord_id) 
    REFERENCES public.profiles(user_id) 
    ON DELETE CASCADE
);

-- Create index for better query performance
CREATE INDEX idx_properties_landlord_id ON public.properties(landlord_id);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_location ON public.properties(location);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policies for properties table
-- Landlords can view their own properties
CREATE POLICY "Landlords can view their own properties" 
ON public.properties 
FOR SELECT 
USING (auth.uid() = landlord_id);

-- Landlords can create properties (only if they are landlord type)
CREATE POLICY "Landlords can create properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (
  auth.uid() = landlord_id 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND user_type = 'landlord'
  )
);

-- Landlords can update their own properties
CREATE POLICY "Landlords can update their own properties" 
ON public.properties 
FOR UPDATE 
USING (auth.uid() = landlord_id);

-- Landlords can delete their own properties  
CREATE POLICY "Landlords can delete their own properties" 
ON public.properties 
FOR DELETE 
USING (auth.uid() = landlord_id);

-- Anyone can view active properties (for browsing)
CREATE POLICY "Anyone can view active properties" 
ON public.properties 
FOR SELECT 
USING (status = 'active');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create inquiries table for tenant-landlord communication
CREATE TABLE public.property_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  landlord_id UUID NOT NULL,
  message TEXT NOT NULL,
  tenant_name TEXT,
  tenant_phone TEXT,
  tenant_email TEXT,
  status TEXT CHECK (status IN ('pending', 'replied', 'closed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Foreign key constraints
  CONSTRAINT fk_inquiry_tenant 
    FOREIGN KEY (tenant_id) 
    REFERENCES public.profiles(user_id) 
    ON DELETE CASCADE,
  CONSTRAINT fk_inquiry_landlord 
    FOREIGN KEY (landlord_id) 
    REFERENCES public.profiles(user_id) 
    ON DELETE CASCADE
);

-- Create indexes for inquiries
CREATE INDEX idx_inquiries_property_id ON public.property_inquiries(property_id);
CREATE INDEX idx_inquiries_tenant_id ON public.property_inquiries(tenant_id);
CREATE INDEX idx_inquiries_landlord_id ON public.property_inquiries(landlord_id);

-- Enable RLS for inquiries
ALTER TABLE public.property_inquiries ENABLE ROW LEVEL SECURITY;

-- Landlords can view inquiries for their properties
CREATE POLICY "Landlords can view inquiries for their properties" 
ON public.property_inquiries 
FOR SELECT 
USING (auth.uid() = landlord_id);

-- Tenants can view their own inquiries
CREATE POLICY "Tenants can view their own inquiries" 
ON public.property_inquiries 
FOR SELECT 
USING (auth.uid() = tenant_id);

-- Tenants can create inquiries
CREATE POLICY "Tenants can create inquiries" 
ON public.property_inquiries 
FOR INSERT 
WITH CHECK (
  auth.uid() = tenant_id 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND user_type = 'tenant'
  )
);

-- Landlords can update inquiry status
CREATE POLICY "Landlords can update inquiry status" 
ON public.property_inquiries 
FOR UPDATE 
USING (auth.uid() = landlord_id);
