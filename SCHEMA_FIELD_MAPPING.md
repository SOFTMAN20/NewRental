# Database Schema Field Mapping

## Properties Table - Actual Fields

The database uses **student housing schema**, NOT generic property fields!

### ❌ Fields that DON'T EXIST:
- `area_sqm`
- `bedrooms`
- `bathrooms`
- `price` 
- `location`
- `full_address`
- `contact_phone`
- `contact_whatsapp_phone`
- `electricity`, `water`, `furnished`, `parking`, `security`
- `nearby_services`

### ✅ Fields that DO EXIST:
- `title` - Property title
- `description` - Property description
- `monthly_rent` - Monthly rent amount
- `address` - Street address
- `city` - City name
- `region` - Region name
- `room_type` - single_room, shared_room, studio, dormitory
- `bed_count` - Total beds in property
- `available_beds` - Available beds for students
- `gender_restrictions` - male_only, female_only, mixed
- `university_id` - UUID of nearby university
- `distance_from_campus` - Distance in km
- `amenities` - JSONB object with WiFi, Security, etc
- `images` - Array of image URLs
- `landlord_id` - UUID of landlord (profiles.id)
- `status` - active, inactive, pending_verification

## Fix Required

The form is trying to save fields that don't exist in the database!

**Solution:** Map form fields to correct database columns.
