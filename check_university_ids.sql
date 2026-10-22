-- Check university IDs in properties table
SELECT 
  university_id,
  COUNT(*) as property_count,
  universities.name,
  universities.abbreviation
FROM properties
LEFT JOIN universities ON properties.university_id = universities.id
WHERE properties.status = 'active'
  AND properties.is_available = true
GROUP BY university_id, universities.name, universities.abbreviation
ORDER BY property_count DESC;

-- Also check all universities
SELECT id, name, abbreviation FROM universities ORDER BY name;
