# Requirements Document

## Introduction

This document specifies the requirements for transforming NyumbaLink, a general housing platform for Tanzania, into a specialized student housing platform similar to Student.com. The transformed platform will focus exclusively on connecting verified students with verified landlords offering student-appropriate accommodation near universities and colleges in Tanzania. The system will maintain the existing React + TypeScript + Supabase technology stack while adding student-specific features including email domain verification, university-based search, academic year lease periods, student amenities, and room booking capabilities.

## Glossary

- **Student_Housing_Platform**: The transformed system connecting verified students with student accommodation
- **Student_User**: A verified user with a valid university/college email address (@ac.tz, @udsm.ac.tz, etc.)
- **Landlord_User**: A property owner verified to offer student accommodation
- **Student_Property**: A property listing specifically configured for student housing with student-appropriate room types
- **University_Record**: A database entry representing a Tanzanian university or college with location data
- **Verification_System**: The email domain validation subsystem that confirms student status
- **Room_Type**: Classification of accommodation (single room, shared room, studio, dormitory)
- **Academic_Year**: The standard lease period aligned with university calendars (typically 9-12 months)
- **Student_Amenity**: Facilities specifically relevant to students (WiFi, study areas, proximity to campus, libraries)
- **Booking_System**: The reservation subsystem allowing students to reserve rooms before move-in
- **Campus_Search**: Location-based search functionality centered on university campuses
- **Auth_System**: The Supabase authentication subsystem
- **Database**: The PostgreSQL database managed by Supabase
- **Storage**: The Supabase Storage subsystem for images and documents
- **Profile**: User account data including verification status

## Requirements

### Requirement 1: Student Email Verification

**User Story:** As a student, I want to register using my university email address, so that I can access student housing listings with verified student status.

#### Acceptance Criteria

1. WHEN a user registers, THE Verification_System SHALL validate the email domain against a list of approved Tanzanian university domains (@ac.tz, @udsm.ac.tz, @uit.ac.tz, @duce.ac.tz, etc.)
2. IF the email domain is not a recognized university domain, THEN THE Verification_System SHALL reject the registration and display an error message indicating valid domains
3. WHEN a valid university email is provided, THE Verification_System SHALL send a verification email with a confirmation link
4. WHEN the user clicks the verification link, THE Auth_System SHALL mark the Profile as verified and grant access to the platform
5. THE Database SHALL store the university domain and verification status in the Profile record
6. WHILE a user's email is unverified, THE Student_Housing_Platform SHALL restrict access to property listings and display a verification reminder

### Requirement 2: University and Campus Database

**User Story:** As a student, I want to search for housing near my university campus, so that I can find accommodation within convenient distance of my classes.

#### Acceptance Criteria

1. THE Database SHALL contain a universities table with columns for university_id, name, abbreviation, city, region, campus_locations (array), latitude, and longitude
2. THE Database SHALL include all major Tanzanian universities including UDSM, OUT, SUA, UDOM, MU, ARU, DIT, and others
3. WHEN the Student_Housing_Platform initializes, THE Database SHALL be populated with at least 20 Tanzanian universities and colleges
4. THE Database SHALL store multiple campus locations for universities with multiple campuses (e.g., UDSM Mlimani and UDSM Mbeya)
5. WHEN a Student_Property is created, THE Landlord_User SHALL select the nearest university/campus from a dropdown populated from the universities table
6. THE Database SHALL store the associated university_id as a foreign key in the properties table

### Requirement 3: Student-Specific Property Listings

**User Story:** As a landlord, I want to create property listings specifically for students, so that I can attract the right tenant demographic with appropriate room configurations.

#### Acceptance Criteria

1. WHEN a Landlord_User creates a Student_Property, THE Student_Housing_Platform SHALL provide room type options: single_room, shared_room, studio, dormitory
2. THE Student_Housing_Platform SHALL require the Landlord_User to specify the number of available beds for shared rooms and dormitories
3. THE Student_Housing_Platform SHALL require the Landlord_User to specify gender restrictions: male_only, female_only, mixed
4. WHEN creating a Student_Property, THE Landlord_User SHALL select student-focused amenities from a checklist: WiFi, study_room, library_access, 24_hour_security, laundry, meal_plan, proximity_to_campus, proximity_to_library, quiet_hours
5. THE Student_Housing_Platform SHALL require the Landlord_User to specify the distance from the selected university campus in kilometers
6. THE Database SHALL store all student-specific property attributes in the properties table with appropriate data types
7. WHEN displaying a Student_Property, THE Student_Housing_Platform SHALL show all student-specific information including room type, bed count, gender restrictions, and amenities

### Requirement 4: Academic Year Lease Periods

**User Story:** As a student, I want to book accommodation for academic year periods, so that my lease aligns with my university schedule.

#### Acceptance Criteria

1. WHEN a Landlord_User creates a Student_Property, THE Student_Housing_Platform SHALL provide lease period options: semester (4-6 months), academic_year (9-12 months), short_term (1-3 months), flexible
2. THE Student_Housing_Platform SHALL allow the Landlord_User to specify available move-in dates aligned with common university start dates (August, September, January)
3. THE Database SHALL store lease_type and available_move_in_dates in the properties table
4. WHEN a Student_User searches properties, THE Campus_Search SHALL provide filters for lease duration
5. WHEN displaying a Student_Property, THE Student_Housing_Platform SHALL prominently show the lease period options and available move-in dates

### Requirement 5: Campus-Based Search and Filtering

**User Story:** As a student, I want to filter properties by my university and preferred amenities, so that I can find suitable accommodation near my campus.

#### Acceptance Criteria

1. WHEN a Student_User accesses the search page, THE Campus_Search SHALL display a prominent university/campus selector as the primary filter
2. WHEN a university is selected, THE Campus_Search SHALL filter properties to show only those associated with the selected university
3. THE Campus_Search SHALL provide filters for: room_type, price_range, distance_from_campus, gender_restrictions, lease_period
4. THE Campus_Search SHALL provide an amenities filter with checkboxes for: WiFi, study_room, library_access, security, laundry, meal_plan
5. WHEN filters are applied, THE Campus_Search SHALL update the URL query parameters to create shareable links
6. THE Campus_Search SHALL sort results by distance from the selected campus by default
7. THE Campus_Search SHALL display distance from campus in kilometers on each property card
8. WHEN no university is selected, THE Campus_Search SHALL show all properties grouped by university

### Requirement 6: Student-Focused User Interface

**User Story:** As a student, I want a modern, mobile-friendly interface designed for student housing search, so that I can easily find accommodation on my phone.

#### Acceptance Criteria

1. THE Student_Housing_Platform SHALL update the branding from "NyumbaLink" to "Student Housing Tanzania" or similar student-focused name
2. THE Student_Housing_Platform SHALL use a color scheme appealing to students (modern, vibrant, trustworthy)
3. WHEN a Student_User visits the homepage, THE Student_Housing_Platform SHALL display a hero section with university-focused messaging (e.g., "Find Your Perfect Student Home Near Campus")
4. THE Student_Housing_Platform SHALL replace generic property terminology with student-focused language (e.g., "Student Rooms" instead of "Properties")
5. THE Student_Housing_Platform SHALL maintain the mobile-first responsive design from the existing platform
6. THE Student_Housing_Platform SHALL display student-relevant statistics on the homepage (e.g., "500+ Student Rooms Near UDSM")
7. WHEN displaying properties, THE Student_Housing_Platform SHALL use student-oriented visual elements (icons for campus proximity, study areas, WiFi, etc.)

### Requirement 7: Landlord Verification for Student Properties

**User Story:** As a student, I want to know that landlords are verified, so that I can trust the property listings are legitimate.

#### Acceptance Criteria

1. WHEN a Landlord_User registers to list student properties, THE Student_Housing_Platform SHALL require additional verification information: business_registration_number, physical_address, government_ID_number
2. THE Database SHALL add a verification_status field to the Profile table with values: unverified, pending, verified, rejected
3. THE Student_Housing_Platform SHALL mark new Landlord_User accounts as "pending" verification by default
4. WHILE a Landlord_User is unverified, THE Student_Housing_Platform SHALL allow property creation but mark listings as "Pending Verification"
5. WHEN displaying properties from unverified landlords, THE Student_Housing_Platform SHALL show a "Verification Pending" badge
6. WHERE a Landlord_User is verified, THE Student_Housing_Platform SHALL display a "Verified Landlord" badge on all their properties
7. THE Student_Housing_Platform SHALL provide an admin interface for reviewing landlord verification documents (future implementation, placeholder in schema)

### Requirement 8: Room Booking and Reservation System

**User Story:** As a student, I want to reserve a room before move-in, so that I can secure accommodation for the upcoming semester.

#### Acceptance Criteria

1. WHEN a Student_User views a Student_Property with available rooms, THE Booking_System SHALL display a "Book Now" or "Reserve Room" button
2. WHEN the Student_User clicks the booking button, THE Booking_System SHALL show available move-in dates and room/bed availability
3. WHEN the Student_User selects a move-in date, THE Booking_System SHALL create a booking record in a bookings table with status "pending"
4. THE Database SHALL create a bookings table with fields: booking_id, property_id, student_user_id, room_type, move_in_date, booking_date, status (pending, confirmed, cancelled), confirmation_code
5. WHEN a booking is created, THE Booking_System SHALL send a notification to the Landlord_User via email
6. THE Booking_System SHALL generate a unique confirmation_code for each booking
7. WHEN a booking exists, THE Student_Housing_Platform SHALL display the booking status on the Student_User's dashboard
8. WHEN a Landlord_User views their dashboard, THE Student_Housing_Platform SHALL show all pending bookings for their properties with options to confirm or decline
9. IF a booking is confirmed by the Landlord_User, THEN THE Booking_System SHALL update the status to "confirmed" and send a confirmation email to the Student_User
10. THE Booking_System SHALL prevent double-booking by checking existing confirmed bookings before creating new ones

### Requirement 9: Student Dashboard and Profile

**User Story:** As a student, I want a personalized dashboard showing my bookings and favorite properties, so that I can manage my housing search efficiently.

#### Acceptance Criteria

1. WHEN a verified Student_User logs in, THE Student_Housing_Platform SHALL display a student-specific dashboard
2. THE Student_Housing_Platform SHALL show the Student_User's university affiliation based on their email domain
3. THE Student_Housing_Platform SHALL display active bookings with confirmation codes, move-in dates, and landlord contact information
4. THE Student_Housing_Platform SHALL provide a "Saved Properties" section showing favorited Student_Property listings
5. THE Student_Housing_Platform SHALL display a search shortcut pre-filtered to the Student_User's university
6. THE Student_Housing_Platform SHALL allow the Student_User to update their profile with: course_of_study, year_of_study, preferred_roommate_gender, budget_range
7. THE Database SHALL add student-specific profile fields: university_id, course_of_study, year_of_study, preferred_roommate_gender, budget_range

### Requirement 10: Landlord Dashboard for Student Properties

**User Story:** As a landlord, I want a dashboard to manage my student property listings and bookings, so that I can efficiently handle student tenants.

#### Acceptance Criteria

1. WHEN a Landlord_User logs in, THE Student_Housing_Platform SHALL display the existing landlord dashboard with student-specific enhancements
2. THE Student_Housing_Platform SHALL show total_bookings, pending_bookings, confirmed_bookings, and available_rooms statistics
3. THE Student_Housing_Platform SHALL display a bookings management section with filters: pending, confirmed, cancelled
4. WHEN a Landlord_User views a booking, THE Student_Housing_Platform SHALL show: student name, university, move-in date, room type, booking date, and student contact information
5. THE Student_Housing_Platform SHALL provide "Confirm Booking" and "Decline Booking" actions for pending bookings
6. THE Student_Housing_Platform SHALL update the PropertyForm component to include all student-specific fields: room_type, bed_count, gender_restrictions, amenities, nearest_university, distance_from_campus, lease_periods
7. WHEN a Landlord_User creates or edits a Student_Property, THE Student_Housing_Platform SHALL validate that all required student-specific fields are completed

### Requirement 11: Data Migration and Transformation

**User Story:** As a system administrator, I want to migrate existing NyumbaLink data to the student housing schema, so that we can preserve existing property data where applicable.

#### Acceptance Criteria

1. THE Database SHALL create new columns in the properties table: room_type, bed_count, gender_restrictions, amenities (JSONB), university_id, distance_from_campus, lease_periods (array), property_type (set to "student_housing")
2. THE Database SHALL create a new universities table with the schema specified in Requirement 2
3. THE Database SHALL create a new bookings table with the schema specified in Requirement 8
4. THE Database SHALL add student-specific fields to the profiles table: university_id, course_of_study, year_of_study, preferred_roommate_gender, budget_range, verification_status
5. WHERE existing properties can be classified as student-suitable, THE Database SHALL allow manual or admin-flagged migration to student properties
6. THE Database SHALL maintain backward compatibility by keeping existing property fields intact
7. THE Student_Housing_Platform SHALL only display properties where property_type = 'student_housing' on the main search interface

### Requirement 12: Mobile-First Student Experience

**User Story:** As a student primarily using a mobile device, I want an optimized mobile experience for browsing and booking student housing, so that I can search for accommodation on my phone.

#### Acceptance Criteria

1. THE Student_Housing_Platform SHALL maintain the existing mobile-first responsive design
2. WHEN a Student_User accesses the platform on mobile, THE Student_Housing_Platform SHALL display touch-friendly filter controls with bottom sheets for filter selection
3. THE Student_Housing_Platform SHALL use the existing MobileBottomNav component for student navigation: Search, Saved, Bookings, Profile
4. WHEN a Student_User views properties on mobile, THE Student_Housing_Platform SHALL display property cards optimized for small screens with campus distance prominently shown
5. THE Booking_System SHALL provide a mobile-optimized booking flow with clear step indicators
6. THE Student_Housing_Platform SHALL maintain PWA capabilities for installability on student mobile devices
7. THE Student_Housing_Platform SHALL optimize image loading for mobile networks using the existing OptimizedImage component

### Requirement 13: Search and Discovery Optimization

**User Story:** As a student, I want to quickly find relevant accommodation without complex filtering, so that I can find housing suitable for my needs efficiently.

#### Acceptance Criteria

1. WHEN a Student_User first visits the platform, THE Campus_Search SHALL display a simplified search interface with only: university selector and "Search" button
2. THE Campus_Search SHALL provide quick filter chips for common student preferences: "Under 200,000 TZS", "Single Room", "WiFi Included", "Within 2km"
3. WHEN a Student_User selects their university, THE Campus_Search SHALL display recommended properties based on popularity and proximity
4. THE Campus_Search SHALL implement URL-based search state persistence (maintaining existing functionality)
5. THE Student_Housing_Platform SHALL show "Popular Near [University Name]" sections on the homepage
6. THE Campus_Search SHALL provide map view integration (leveraging existing Mapbox integration) showing properties relative to the selected campus
7. WHEN no search filters are applied, THE Campus_Search SHALL show featured student properties with "Verified Landlord" badges prioritized

### Requirement 14: Communication and Contact Enhancement

**User Story:** As a student, I want easy ways to contact landlords about student properties, so that I can ask questions and arrange viewings.

#### Acceptance Criteria

1. THE Student_Housing_Platform SHALL maintain existing WhatsApp and phone call integration
2. WHEN a Student_User contacts a landlord, THE Student_Housing_Platform SHALL include a pre-filled message template: "Hi, I'm interested in your [room_type] near [university_name]. Is it still available for [move_in_date]?"
3. THE Student_Housing_Platform SHALL provide an inquiry form for students to send structured questions to landlords
4. THE Database SHALL create a property_inquiries table (if not existing) storing: inquiry_id, property_id, student_user_id, landlord_user_id, message, inquiry_date, status (pending, responded)
5. WHEN a Student_User sends an inquiry, THE Student_Housing_Platform SHALL notify the Landlord_User via email
6. WHEN a Landlord_User responds to an inquiry, THE Student_Housing_Platform SHALL notify the Student_User via email
7. THE Student_Housing_Platform SHALL display inquiry history on both student and landlord dashboards

### Requirement 15: Price Transparency and Payment Terms

**User Story:** As a student, I want clear information about rent costs and payment terms, so that I can budget for accommodation expenses.

#### Acceptance Criteria

1. WHEN a Landlord_User creates a Student_Property, THE Student_Housing_Platform SHALL require specification of: monthly_rent, deposit_amount, utilities_included (boolean), additional_fees (JSONB)
2. THE Student_Housing_Platform SHALL display total upfront costs calculated as: deposit_amount + first_month_rent + additional_fees
3. WHERE utilities are not included, THE Student_Housing_Platform SHALL display estimated monthly utility costs
4. THE Student_Housing_Platform SHALL show payment terms: accepted_payment_methods (mobile_money, bank_transfer, cash), payment_schedule (monthly, semester, annual)
5. WHEN displaying a Student_Property, THE Student_Housing_Platform SHALL show a cost breakdown in an expandable section
6. THE Student_Housing_Platform SHALL calculate and display cost per semester and cost per academic year based on lease_type
7. THE Campus_Search SHALL provide price range filters calibrated for student budgets: "Under 150,000 TZS", "150,000-300,000 TZS", "300,000-500,000 TZS", "Above 500,000 TZS"

### Requirement 16: Student Amenities and Facilities Focus

**User Story:** As a student, I want to easily see which properties have student-essential amenities, so that I can find accommodation that supports my academic success.

#### Acceptance Criteria

1. THE Student_Housing_Platform SHALL define a standardized amenities taxonomy: WiFi (boolean), WiFi_Speed (Mbps), Study_Room (boolean), Library_Access (boolean), 24_Hour_Security (boolean), Laundry_Facilities (boolean), Meal_Plan (boolean), Quiet_Hours (boolean), Backup_Generator (boolean), Study_Desk_In_Room (boolean)
2. WHEN creating a Student_Property, THE Landlord_User SHALL select amenities from the standardized list using checkboxes
3. THE Database SHALL store amenities as a JSONB column in the properties table
4. WHEN displaying a Student_Property card, THE Student_Housing_Platform SHALL show icons for the top 4 amenities
5. WHEN displaying a Student_Property detail page, THE Student_Housing_Platform SHALL show all amenities in a dedicated section with icons and descriptions
6. THE Campus_Search SHALL provide an amenities filter allowing multiple selections with AND logic (property must have all selected amenities)
7. THE Student_Housing_Platform SHALL display amenity availability statistics (e.g., "82% of our properties have WiFi")

### Requirement 17: Security and Privacy for Students

**User Story:** As a student, I want my personal information protected, so that I feel safe using the platform.

#### Acceptance Criteria

1. THE Database SHALL maintain existing Row Level Security (RLS) policies for the properties table
2. THE Database SHALL create RLS policies for the bookings table ensuring Student_User can only view their own bookings and Landlord_User can only view bookings for their properties
3. THE Student_Housing_Platform SHALL not display Student_User contact information to Landlord_User until a booking is confirmed or inquiry is sent
4. THE Student_Housing_Platform SHALL hash and store sensitive verification documents securely in Supabase Storage with access restricted to admin users
5. THE Auth_System SHALL implement rate limiting on login attempts (5 attempts per 15 minutes)
6. THE Student_Housing_Platform SHALL not display full Student_User names publicly, only first name and last initial (e.g., "John M.")
7. THE Database SHALL log all access to sensitive student data for audit purposes

### Requirement 18: Performance and Scalability

**User Story:** As a student on a slow mobile connection, I want the platform to load quickly, so that I can browse properties even with limited internet speed.

#### Acceptance Criteria

1. THE Student_Housing_Platform SHALL maintain the existing image optimization using OptimizedImage component
2. THE Student_Housing_Platform SHALL implement lazy loading for property images below the fold
3. THE Database SHALL create indexes on: properties.university_id, properties.room_type, properties.property_type, bookings.student_user_id, bookings.status
4. THE Campus_Search SHALL implement pagination with 20 properties per page
5. THE Student_Housing_Platform SHALL use React Query caching for university data and user profile data
6. WHEN a Student_User navigates between pages, THE Student_Housing_Platform SHALL prefetch likely next pages (e.g., property details when hovering over property cards on desktop)
7. THE Student_Housing_Platform SHALL achieve a Lighthouse performance score of at least 80 on mobile devices

### Requirement 19: Accessibility and Inclusivity

**User Story:** As a student with accessibility needs, I want the platform to be usable with assistive technologies, so that I can independently search for housing.

#### Acceptance Criteria

1. THE Student_Housing_Platform SHALL maintain WCAG 2.1 Level AA compliance for all interactive elements
2. THE Student_Housing_Platform SHALL provide alt text for all property images describing room type and key features
3. THE Student_Housing_Platform SHALL ensure all form inputs have associated labels for screen readers
4. THE Student_Housing_Platform SHALL provide keyboard navigation for all interactive features
5. THE Campus_Search SHALL announce filter changes to screen readers using ARIA live regions
6. THE Student_Housing_Platform SHALL maintain sufficient color contrast (4.5:1 minimum) for all text
7. THE Student_Housing_Platform SHALL provide focus indicators for keyboard navigation

### Requirement 20: Analytics and Monitoring

**User Story:** As a system administrator, I want to monitor platform usage and identify issues, so that I can ensure the platform serves students effectively.

#### Acceptance Criteria

1. THE Student_Housing_Platform SHALL integrate with existing Vercel Speed Insights
2. THE Student_Housing_Platform SHALL track key events: user_registration, email_verification, property_view, booking_created, booking_confirmed, inquiry_sent
3. THE Database SHALL create an analytics_events table storing: event_id, event_type, user_id, property_id, timestamp, metadata (JSONB)
4. THE Student_Housing_Platform SHALL provide an admin dashboard showing: total_students, total_landlords, total_properties, total_bookings, verification_rate, popular_universities
5. THE Student_Housing_Platform SHALL implement error tracking for failed verification emails, booking errors, and payment processing errors
6. THE Student_Housing_Platform SHALL log slow database queries (>500ms) for optimization
7. THE Student_Housing_Platform SHALL provide weekly summary reports via email to administrators

## Summary

This requirements document specifies the transformation of NyumbaLink into a student-focused housing platform. The system will verify students via university email domains, provide university-based search and filtering, support student-specific room types and lease periods, implement a booking system, and maintain the existing mobile-first React + Supabase architecture. All requirements follow EARS patterns and INCOSE quality rules to ensure clarity, testability, and completeness.
