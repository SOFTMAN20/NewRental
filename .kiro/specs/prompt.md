# 🏠 NyumbaLink— FULL DEVELOPMENT BLUEPRINT  
**Tech Stack:** React + Supabase + Tailwind CSS + ShadCN UI + Lucide React  
**Goal:** Build a full-featured rental management platform where tenants can find and book houses, landlords can list and manage properties, and admins can oversee the system.

---

## ⚙️ 1. SYSTEM OVERVIEW

This app will include three user roles:
- **Tenant:** Browse, book, and review properties.
- **Landlord:** Add, edit, and manage property listings.
- **Admin:** Approve/reject properties, manage users, and monitor system analytics.

Supabase will handle:
- Authentication (role-based)
- Database (Postgres)
- File Storage (property images, profile pictures)
- Realtime (bookings, notifications)
- Edge Functions (payment verification)

---

## 👥 2. USER ROLES AND RESPONSIBILITIES

### 🏡 Tenant
- Register and log in.
- Browse available houses.
- Filter by location, price, type.
- Book a property and make payment.
- Manage bookings and leave reviews.

### 👨‍💼 Landlord
- Register and log in.
- Add, edit, delete, or pause property listings.
- Manage incoming booking requests.
- View earnings and property analytics.
- Respond to tenant reviews.

### 🛠️ Admin
- Login using admin credentials.
- Approve/reject properties.
- Manage users (suspend/activate).
- Monitor bookings and payments.
- Access analytics dashboard (revenue, users, properties).

---

## 🧭 3. USER FLOWS

### 🏡 Tenant Flow
1. Signup/Login
2. Browse properties (search, filter)
3. Select a property → view details
4. Book property → make payment
5. Receive confirmation notification
6. View booking history & leave review

### 👨‍💼 Landlord Flow
1. Signup/Login
2. Add property (details + images)
3. Wait for admin approval
4. Manage booking requests (accept/reject)
5. View earnings and reviews

### 🛠️ Admin Flow
1. Login
2. View pending properties → approve/reject
3. Manage users (activate/suspend)
4. View all bookings & payments
5. Access reports (charts & analytics)
6. Send notifications to users

---

## 🔄 4. SYSTEM FLOW SUMMARY

1. User registers → role assigned (tenant or landlord)
2. Landlord adds property → goes to “pending”
3. Admin approves → property visible to tenants
4. Tenant books → payment processed → landlord notified
5. Admin tracks payments, bookings, and revenue
6. Tenant reviews property → landlord sees feedback

---

## 🧱 5. ROLE-SPECIFIC BEHAVIOR

| Role | Access | Key Actions |
|------|---------|-------------|
| Tenant | Public pages + user dashboard | Browse, book, pay, review |
| Landlord | Authenticated dashboard | Add property, manage bookings |
| Admin | Admin panel | Approve listings, manage users, analytics |

---

## 🧩 6. COMPONENT STRUCTURE BREAKDOWN (TESTABLE BLOCKS)

Each task should be modular, independently testable, and reusable.

### 🧱 PHASE 1 — PROJECT SETUP
**Goal:** Initialize React app and connect Supabase.
- Setup React + Vite + Tailwind CSS + ShadCN.
- Configure Supabase client.
- Setup routes: `/`, `/login`, `/register`, `/dashboard`.
- Implement role-based access (Tenant, Landlord, Admin).

### 🧱 PHASE 2 — AUTHENTICATION
**Goal:** Enable login/signup using Supabase Auth.
- Create signup & login forms.
- Implement user roles with Supabase policies.
- Redirect users based on role:
  - Tenant → `/tenant/dashboard`
  - Landlord → `/landlord/dashboard`
  - Admin → `/admin/dashboard`

### 🧱 PHASE 3 — PROPERTY MANAGEMENT (LANDLORD)
**Goal:** CRUD operations for properties.
- Components:
  - `PropertyForm` → Add/Edit property
  - `PropertyList` → Display all landlord properties
  - `PropertyCard` → Single property display
- Upload images to Supabase Storage.
- Submit for admin approval.

### 🧱 PHASE 4 — PROPERTY BROWSING (TENANT)
**Goal:** Display all approved properties.
- Components:
  - `SearchBar`, `FilterSidebar`, `PropertyGrid`
- Show only approved properties.
- Add “Book Now” button → triggers booking flow.

### 🧱 PHASE 5 — BOOKINGS & PAYMENTS
**Goal:** Implement booking and payment flow.
- Tables: `bookings`, `payments`
- Supabase Realtime for booking status updates.
- Integrate payment gateway (e.g., M-Pesa/Azampay via Edge Functions).
- Update booking status automatically after payment.

### 🧱 PHASE 6 — REVIEWS & RATINGS
**Goal:** Allow tenants to leave feedback.
- Components:
  - `ReviewForm`, `ReviewList`, `RatingStars`
- Tenants can only review after completed stay.
- Display reviews under property details.

### 🧱 PHASE 7 — ADMIN DASHBOARD
**Goal:** Control system management and analytics.
- Sections:
  - Overview cards (Total Users, Properties, Bookings, Revenue)
  - Property approval table
  - User management table
  - Bookings & payments table
  - Revenue chart (Recharts)
- Edge Function for commission calculations.

### 🧱 PHASE 8 — NOTIFICATIONS & REALTIME UPDATES
**Goal:** Keep users updated instantly.
- Use Supabase Realtime for:
  - New bookings
  - Property status updates
  - Payment confirmations
- UI Components:
  - Toasts (ShadCN)
  - Bell icon (Lucide)
  - Notification drawer

### 🧱 PHASE 9 — FINAL POLISH & DEPLOYMENT
**Goal:** Optimize and deploy.
- Add loading states, error boundaries.
- Optimize image loading.
- Responsive design.
- Deploy via Vercel .
- Connect Supabase production instance.

---

## 🔒 7. SECURITY & PERFORMANCE
- Use Supabase RLS (Row Level Security) for user-based data access.
- Validate roles before allowing CRUD operations.
- Optimize queries with indexes.
- Store images in separate public bucket with signed URLs.

---

## 🧠 8. DEVELOPMENT GUIDELINES FOR CURSOR/Kiro AI

1. Build one module at a time (e.g., Auth → Property CRUD → Bookings).  
2. Follow component-based architecture with `/components`, `/pages`, `/hooks`, `/lib`.  
3. For each phase:
   - Generate TypeScript interfaces for data models.
   - Connect to Supabase via SDK.
   - Create minimal UI using ShadCN + Tailwind.
4. Test Supabase functions using mock data before integration.
5. Implement global role-based route protection.

---

## ✅ 9. SUCCESS CRITERIA
- User signup, property creation, and booking flow fully functional.
- Admin can approve/reject listings.
- Landlord sees confirmed bookings & revenue.
- Tenant can pay, view receipts, and review properties.
- Dashboard analytics update in real-time.

---

### 🧠 Example Command for Cursor Prompt:
> You are a senior React + Supabase developer. Implement the project described above **phase by phase**.  
> Start with **Phase 1: Project Setup**, create folder structure, Tailwind + ShadCN config, and Supabase client setup.  
> Make sure each phase ends with working and testable components before moving to the next.

---

**End of Prompt File.**
