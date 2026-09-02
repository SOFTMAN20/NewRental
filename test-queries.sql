-- Useful SQL Queries for Testing Student Housing Platform

-- ============================================
-- PROPERTY QUERIES
-- ============================================

-- Get all active properties with university info
SELECT 
  p.id,
  p.title,
  p.room_type,
  p.monthly_rent,
  p.available_beds,
  p.distance_from_campus,
  p.gender_restrictions,
  u.abbreviation as university,
  u.name as university_name,
  p.city
FROM properties p
JOIN universities u ON p.university_id = u.id
WHERE p.status = 'active'
ORDER BY u.abbreviation, p.monthly_rent;

-- Get properties by price range
SELECT title, monthly_rent, room_type, gender_restrictions
FROM properties
WHERE monthly_rent BETWEEN 100000 AND 200000
AND status = 'active'
ORDER BY monthly_rent;

-- Get closest properties to campus
SELECT title, distance_from_campus, monthly_rent, room_type
FROM properties
WHERE status = 'active'
ORDER BY distance_from_campus
LIMIT 10;

-- Get properties with WiFi and Study Room
SELECT title, monthly_rent, amenities->'WiFi' as wifi, amenities->'Study_Room' as study_room
FROM properties
WHERE amenities->>'WiFi' = 'true'
AND amenities->>'Study_Room' = 'true'
AND status = 'active';

-- Get female-only properties
SELECT title, room_type, monthly_rent, available_beds
FROM properties
WHERE gender_restrictions = 'female_only'
AND status = 'active';

-- ============================================
-- UNIVERSITY QUERIES
-- ============================================

-- List all universities with email domains
SELECT abbreviation, name, city, email_domains
FROM universities
ORDER BY name;

-- Count properties per university
SELECT 
  u.abbreviation,
  u.name,
  COUNT(p.id) as property_count,
  SUM(p.available_beds) as total_beds
FROM universities u
LEFT JOIN properties p ON u.id = p.university_id
GROUP BY u.id, u.abbreviation, u.name
ORDER BY property_count DESC;

-- ============================================
-- LANDLORD QUERIES
-- ============================================

-- Get all verified landlords with property count
SELECT 
  pr.full_name,
  pr.email,
  pr.phone,
  pr.verification_status,
  COUNT(p.id) as property_count
FROM profiles pr
LEFT JOIN properties p ON pr.id = p.landlord_id
WHERE pr.user_type = 'landlord'
GROUP BY pr.id, pr.full_name, pr.email, pr.phone, pr.verification_status
ORDER BY property_count DESC;

-- Get landlord properties
SELECT 
  pr.full_name as landlord,
  p.title,
  p.monthly_rent,
  p.room_type,
  p.status
FROM properties p
JOIN profiles pr ON p.landlord_id = pr.id
WHERE pr.email = 'john.landlord@gmail.com';

-- ============================================
-- STATISTICS QUERIES
-- ============================================

-- Overall platform statistics
SELECT 
  COUNT(DISTINCT CASE WHEN user_type = 'student' THEN id END) as total_students,
  COUNT(DISTINCT CASE WHEN user_type = 'landlord' THEN id END) as total_landlords,
  COUNT(DISTINCT CASE WHEN user_type = 'landlord' AND verification_status = 'verified' THEN id END) as verified_landlords
FROM profiles;

-- Property statistics
SELECT 
  COUNT(*) as total_properties,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_properties,
  SUM(available_beds) as total_beds_available,
  AVG(monthly_rent) as average_rent,
  MIN(monthly_rent) as cheapest_rent,
  MAX(monthly_rent) as most_expensive_rent
FROM properties;

-- Properties by room type
SELECT 
  room_type,
  COUNT(*) as count,
  AVG(monthly_rent) as avg_rent,
  SUM(available_beds) as total_beds
FROM properties
WHERE status = 'active'
GROUP BY room_type
ORDER BY count DESC;

-- Properties by city
SELECT 
  city,
  COUNT(*) as property_count,
  AVG(monthly_rent) as avg_rent
FROM properties
WHERE status = 'active'
GROUP BY city
ORDER BY property_count DESC;

-- ============================================
-- AMENITIES ANALYSIS
-- ============================================

-- Count properties with specific amenities
SELECT 
  COUNT(CASE WHEN amenities->>'WiFi' = 'true' THEN 1 END) as with_wifi,
  COUNT(CASE WHEN amenities->>'Study_Room' = 'true' THEN 1 END) as with_study_room,
  COUNT(CASE WHEN amenities->>'24_Hour_Security' = 'true' THEN 1 END) as with_security,
  COUNT(CASE WHEN amenities->>'Meal_Plan' = 'true' THEN 1 END) as with_meal_plan,
  COUNT(CASE WHEN amenities->>'Backup_Generator' = 'true' THEN 1 END) as with_generator,
  COUNT(*) as total_properties
FROM properties
WHERE status = 'active';

-- ============================================
-- DASHBOARD QUERIES
-- ============================================

-- Student dashboard stats (replace with actual student ID)
SELECT * FROM student_dashboard_stats
WHERE student_id = '66666666-6666-6666-6666-666666666666';

-- Landlord dashboard stats (replace with actual landlord ID)
SELECT * FROM landlord_dashboard_stats
WHERE landlord_id = '11111111-1111-1111-1111-111111111111';

-- Property stats
SELECT * FROM property_stats
ORDER BY favorites_count DESC, views_count DESC
LIMIT 10;

-- ============================================
-- SEARCH QUERIES
-- ============================================

-- Search properties by title or description
SELECT title, description, monthly_rent, room_type
FROM properties
WHERE (title ILIKE '%UDSM%' OR description ILIKE '%UDSM%')
AND status = 'active';

-- Advanced search: UDSM, under 250K, with WiFi
SELECT 
  p.title,
  p.monthly_rent,
  p.room_type,
  p.distance_from_campus,
  u.abbreviation
FROM properties p
JOIN universities u ON p.university_id = u.id
WHERE u.abbreviation = 'UDSM'
AND p.monthly_rent <= 250000
AND p.amenities->>'WiFi' = 'true'
AND p.status = 'active'
ORDER BY p.distance_from_campus;

-- ============================================
-- BOOKING QUERIES (for when bookings exist)
-- ============================================

-- Get all bookings (currently empty)
SELECT 
  b.confirmation_code,
  b.status,
  b.move_in_date,
  p.title as property_title,
  ps.full_name as student_name,
  pl.full_name as landlord_name
FROM bookings b
JOIN properties p ON b.property_id = p.id
JOIN profiles ps ON b.student_user_id = ps.id
JOIN profiles pl ON b.landlord_user_id = pl.id
ORDER BY b.booking_date DESC;

-- ============================================
-- DATA VALIDATION
-- ============================================

-- Check for properties without universities
SELECT * FROM properties
WHERE university_id IS NULL;

-- Check for properties with invalid status
SELECT * FROM properties
WHERE status NOT IN ('active', 'inactive', 'pending_verification');

-- Verify all landlords are verified
SELECT full_name, email, verification_status
FROM profiles
WHERE user_type = 'landlord';

-- Check available beds don't exceed total beds
SELECT title, bed_count, available_beds
FROM properties
WHERE available_beds > bed_count;
