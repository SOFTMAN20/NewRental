
-- First, let's add a sample property for the landlord
INSERT INTO public.properties (
  landlord_id,
  title,
  description,
  price,
  location,
  property_type,
  bedrooms,
  bathrooms,
  electricity,
  water,
  furnished,
  parking,
  security,
  nearby_services,
  images,
  status
) VALUES (
  'fc553283-cfa0-4d19-bf2a-f99203d4a5a0',
  'Modern 2-Bedroom Apartment in Dar es Salaam',
  'Beautiful modern apartment with all amenities, located in a quiet neighborhood with easy access to public transport.',
  450000,
  'Dar es Salaam, Kinondoni',
  'apartment',
  2,
  2,
  true,
  true,
  true,
  true,
  true,
  ARRAY['school', 'hospital', 'market'],
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
  'active'
);

-- Add another property for variety
INSERT INTO public.properties (
  landlord_id,
  title,
  description,
  price,
  location,
  property_type,
  bedrooms,
  bathrooms,
  electricity,
  water,
  furnished,
  parking,
  security,
  nearby_services,
  images,
  status
) VALUES (
  'fc553283-cfa0-4d19-bf2a-f99203d4a5a0',
  'Spacious 3-Bedroom House with Garden',
  'Large family house with beautiful garden, perfect for families. Located in a safe and friendly neighborhood.',
  750000,
  'Dar es Salaam, Mikocheni',
  'house',
  3,
  2,
  true,
  true,
  false,
  true,
  true,
  ARRAY['school', 'market'],
  ARRAY['https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'],
  'active'
);
