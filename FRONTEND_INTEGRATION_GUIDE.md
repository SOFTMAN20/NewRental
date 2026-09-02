# Frontend Integration Guide - Student Housing Platform

## ✅ Database Status

- **20 Properties** created and active
- **6 Landlords** (5 verified + system profiles)
- **20 Universities** with email domains
- **34 Available Beds** across all properties
- **8 Universities** with properties

## Quick Start - Using Supabase Client

### 1. Environment Setup (Already Done ✅)

Your `.env.local` is already configured with:
```env
VITE_SUPABASE_URL=https://tegsmahtigsrgjvsnzef.supabase.co
VITE_SUPABASE_ANON_KEY=[Your key - already set]
```

### 2. Sample Frontend Queries

#### Get All Active Properties
```typescript
import { supabase } from '@/lib/integrations/supabase/client';

// Fetch all properties with university info
const { data: properties, error } = await supabase
  .from('properties')
  .select(`
    *,
    university:universities(id, name, abbreviation, city),
    landlord:profiles!landlord_id(full_name, phone, verification_status)
  `)
  .eq('status', 'active')
  .order('created_at', { ascending: false });
```

#### Filter Properties by University
```typescript
// Get properties near UDSM
const { data: udsmProperties } = await supabase
  .from('properties')
  .select(`
    *,
    university:universities(name, abbreviation)
  `)
  .eq('status', 'active')
  .eq('university.abbreviation', 'UDSM')
  .order('distance_from_campus');
```

#### Filter by Price Range
```typescript
// Get affordable properties (under 200,000 TZS)
const { data: affordableProperties } = await supabase
  .from('properties')
  .select('*')
  .eq('status', 'active')
  .lte('monthly_rent', 200000)
  .order('monthly_rent');
```

#### Filter by Room Type
```typescript
// Get single rooms only
const { data: singleRooms } = await supabase
  .from('properties')
  .select('*')
  .eq('status', 'active')
  .eq('room_type', 'single_room')
  .order('monthly_rent');
```

#### Filter by Gender
```typescript
// Get female-only properties
const { data: femaleProperties } = await supabase
  .from('properties')
  .select('*')
  .eq('status', 'active')
  .eq('gender_restrictions', 'female_only');
```

#### Search with Multiple Filters
```typescript
// Advanced search: UDSM, under 250K, with WiFi, within 2km
const { data: filteredProperties } = await supabase
  .from('properties')
  .select(`
    *,
    university:universities(abbreviation, name)
  `)
  .eq('status', 'active')
  .eq('universities.abbreviation', 'UDSM')
  .lte('monthly_rent', 250000)
  .lte('distance_from_campus', 2.0)
  .filter('amenities->>WiFi', 'eq', 'true');
```

#### Get Property by ID
```typescript
// Get single property details
const { data: property } = await supabase
  .from('properties')
  .select(`
    *,
    university:universities(*),
    landlord:profiles!landlord_id(full_name, phone, email, verification_status)
  `)
  .eq('id', propertyId)
  .single();
```

### 3. University Queries

#### Get All Universities
```typescript
const { data: universities } = await supabase
  .from('universities')
  .select('*')
  .order('name');
```

#### Get Universities with Property Count
```typescript
const { data: universitiesWithCounts } = await supabase
  .from('universities')
  .select(`
    id,
    name,
    abbreviation,
    city,
    properties:properties(count)
  `);
```

### 4. Favorites (Saved Properties)

#### Add to Favorites
```typescript
const { data, error } = await supabase
  .from('favorites')
  .insert({
    user_id: userId,
    property_id: propertyId
  });
```

#### Get User's Favorites
```typescript
const { data: favorites } = await supabase
  .from('favorites')
  .select(`
    id,
    created_at,
    property:properties(*)
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

#### Remove from Favorites
```typescript
const { error } = await supabase
  .from('favorites')
  .delete()
  .eq('user_id', userId)
  .eq('property_id', propertyId);
```

### 5. Bookings

#### Create a Booking
```typescript
// Get landlord ID from property first
const { data: property } = await supabase
  .from('properties')
  .select('landlord_id')
  .eq('id', propertyId)
  .single();

// Create booking
const { data: booking, error } = await supabase
  .from('bookings')
  .insert({
    property_id: propertyId,
    student_user_id: userId,
    landlord_user_id: property.landlord_id,
    room_type: 'single_room',
    move_in_date: '2026-09-01',
    lease_duration: 'academic_year',
    total_amount: 250000,
    status: 'pending'
  })
  .select()
  .single();

// Confirmation code is auto-generated!
console.log('Booking confirmation:', booking.confirmation_code);
```

#### Get User's Bookings
```typescript
const { data: bookings } = await supabase
  .from('bookings')
  .select(`
    *,
    property:properties(title, address, city, monthly_rent, images),
    landlord:profiles!landlord_user_id(full_name, phone, email)
  `)
  .eq('student_user_id', userId)
  .order('booking_date', { ascending: false });
```

#### Update Booking Status (Landlord)
```typescript
const { data, error } = await supabase
  .from('bookings')
  .update({
    status: 'confirmed',
    confirmed_at: new Date().toISOString()
  })
  .eq('id', bookingId)
  .eq('landlord_user_id', landlordId);
```

### 6. Dashboard Stats

#### Student Dashboard
```typescript
const { data: stats } = await supabase
  .from('student_dashboard_stats')
  .select('*')
  .eq('student_id', userId)
  .single();

// Returns: saved_properties_count, active_bookings_count, pending_inquiries_count
```

#### Landlord Dashboard
```typescript
const { data: stats } = await supabase
  .from('landlord_dashboard_stats')
  .select('*')
  .eq('landlord_id', userId)
  .single();

// Returns: total_properties, total_available_beds, pending_bookings, confirmed_bookings
```

### 7. Property Inquiries

#### Send Inquiry
```typescript
// Get landlord ID from property
const { data: property } = await supabase
  .from('properties')
  .select('landlord_id')
  .eq('id', propertyId)
  .single();

// Create inquiry
const { data, error } = await supabase
  .from('property_inquiries')
  .insert({
    property_id: propertyId,
    student_user_id: userId,
    landlord_user_id: property.landlord_id,
    message: 'Hi, I\'m interested in this property. Is it still available?',
    status: 'pending'
  });
```

#### Get User's Inquiries
```typescript
const { data: inquiries } = await supabase
  .from('property_inquiries')
  .select(`
    *,
    property:properties(title, monthly_rent),
    landlord:profiles!landlord_user_id(full_name, phone, email)
  `)
  .eq('student_user_id', userId)
  .order('inquiry_date', { ascending: false });
```

### 8. Authentication

#### Sign Up (Student with University Email)
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'student@udsm.ac.tz',
  password: 'SecurePassword123!',
});

// Profile will be auto-created as 'student' type!
// University will be auto-detected from email domain
```

#### Sign Up (Landlord)
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'landlord@gmail.com',
  password: 'SecurePassword123!',
});

// Profile will be auto-created as 'landlord' type
// Status will be 'pending' for verification
```

#### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'student@udsm.ac.tz',
  password: 'SecurePassword123!',
});
```

#### Get Current User Profile
```typescript
const { data: { user } } = await supabase.auth.getUser();

if (user) {
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      university:universities(name, abbreviation)
    `)
    .eq('id', user.id)
    .single();
  
  console.log('User type:', profile.user_type); // 'student' or 'landlord'
  console.log('Verification:', profile.verification_status);
}
```

### 9. Real-time Subscriptions

#### Listen to New Properties
```typescript
const subscription = supabase
  .channel('properties-channel')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'properties',
      filter: 'status=eq.active'
    },
    (payload) => {
      console.log('New property added:', payload.new);
      // Update your UI
    }
  )
  .subscribe();
```

#### Listen to Booking Updates
```typescript
const bookingSubscription = supabase
  .channel('bookings-channel')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'bookings',
      filter: `student_user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Booking updated:', payload.new);
      // Show notification if status changed to 'confirmed'
    }
  )
  .subscribe();
```

### 10. Analytics Events

#### Track Property View
```typescript
await supabase
  .from('analytics_events')
  .insert({
    event_type: 'property_view',
    user_id: userId,
    property_id: propertyId,
    metadata: {
      source: 'search',
      timestamp: new Date().toISOString()
    }
  });
```

## Sample Data for Testing

### Test Universities
- **UDSM**: 8 properties (most variety)
- **DIT**: 3 properties (tech-focused)
- **OUT**: 2 properties (budget-friendly)
- **ARU**: 2 properties (premium)
- **UDOM**: 2 properties (Dodoma)
- **SUA**: 1 property (Morogoro)
- **MUHAS**: 1 property (medical students)
- **MU**: 1 property

### Price Ranges to Test
- **Budget** (< 150K): 3 properties
- **Affordable** (150K - 200K): 7 properties
- **Mid-range** (200K - 300K): 6 properties
- **Premium** (300K - 400K): 3 properties
- **Luxury** (> 400K): 1 property

### Test Scenarios

#### Scenario 1: Budget Student
```typescript
// Search: UDSM, under 200K, shared room
const { data } = await supabase
  .from('properties')
  .select('*, university:universities(abbreviation)')
  .eq('status', 'active')
  .eq('universities.abbreviation', 'UDSM')
  .lte('monthly_rent', 200000)
  .in('room_type', ['shared_room', 'dormitory'])
  .order('monthly_rent');
// Expected: 3-4 results
```

#### Scenario 2: Female Student
```typescript
// Search: Female-only, any university
const { data } = await supabase
  .from('properties')
  .select('*, university:universities(name)')
  .eq('status', 'active')
  .eq('gender_restrictions', 'female_only')
  .order('monthly_rent');
// Expected: 5 results
```

#### Scenario 3: Premium Student
```typescript
// Search: Studios with high-speed WiFi
const { data } = await supabase
  .from('properties')
  .select('*')
  .eq('status', 'active')
  .eq('room_type', 'studio')
  .order('monthly_rent', { ascending: false });
// Expected: 2-3 results
```

## Component Integration Examples

### Property Card Component
```typescript
interface PropertyCardProps {
  property: Tables<'properties'> & {
    university: Tables<'universities'>;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const amenities = property.amenities as Record<string, any>;
  
  return (
    <Card>
      <img src={property.images?.[0]} alt={property.title} />
      <h3>{property.title}</h3>
      <p>{property.room_type.replace('_', ' ')} - {property.gender_restrictions}</p>
      <p>{property.monthly_rent.toLocaleString()} TZS/month</p>
      <p>{property.university.abbreviation} - {property.distance_from_campus}km</p>
      <div>
        {amenities.WiFi && <Badge>WiFi</Badge>}
        {amenities['24_Hour_Security'] && <Badge>24/7 Security</Badge>}
        {amenities.Meal_Plan && <Badge>Meals</Badge>}
      </div>
    </Card>
  );
}
```

### Filter Component
```typescript
function PropertyFilters() {
  const [filters, setFilters] = useState({
    universityId: '',
    maxRent: 500000,
    roomType: '',
    gender: ''
  });
  
  // Apply filters
  let query = supabase
    .from('properties')
    .select('*, university:universities(*)')
    .eq('status', 'active');
  
  if (filters.universityId) {
    query = query.eq('university_id', filters.universityId);
  }
  if (filters.maxRent) {
    query = query.lte('monthly_rent', filters.maxRent);
  }
  if (filters.roomType) {
    query = query.eq('room_type', filters.roomType);
  }
  if (filters.gender) {
    query = query.eq('gender_restrictions', filters.gender);
  }
  
  const { data } = await query;
}
```

## TypeScript Types

All types are auto-generated in `src/lib/integrations/supabase/types.ts`:

```typescript
import type { Tables, TablesInsert, TablesUpdate } from '@/lib/integrations/supabase/types';

type Property = Tables<'properties'>;
type PropertyInsert = TablesInsert<'properties'>;
type PropertyUpdate = TablesUpdate<'properties'>;
type University = Tables<'universities'>;
type Profile = Tables<'profiles'>;
type Booking = Tables<'bookings'>;
```

## Next Steps

1. ✅ **Test Authentication**: Try signing up as a student with `test@udsm.ac.tz`
2. ✅ **Browse Properties**: Use the queries above to fetch and display properties
3. ✅ **Test Filters**: Implement university, price, and amenity filters
4. ✅ **Create Bookings**: Test the booking workflow
5. ✅ **Test Dashboards**: Display stats using the views

## Support

- **Supabase Dashboard**: https://supabase.com/dashboard/project/tegsmahtigsrgjvsnzef
- **Documentation**: https://supabase.com/docs
- **Database Schema**: See `SUPABASE_SETUP_COMPLETE.md`

---

**Status**: ✅ Ready for Frontend Development  
**Last Updated**: September 1, 2026
