# NYUMBA LINK - SYSTEM DOCUMENTATION
## Nyumba Link - Mfumo wa Nyumba Tanzania

### SYSTEM OVERVIEW / MUHTASARI WA MFUMO

**Nyumba Link** is a comprehensive housing platform for Tanzania that connects property seekers with landlords. The system provides search, filtering, and management capabilities for rental properties across Tanzania.

**Nyumba Link** ni jukwaa kamili la nyumba kwa Tanzania linalounganisha watafutaji wa nyumba na wenye nyumba. Mfumo unatatoa utafutaji, vichujio, na uwezo wa usimamizi wa nyumba za kukodi kote Tanzania.

---

## ARCHITECTURE / MUUNDO WA MFUMO

### Core Technologies / Teknolojia za Msingi
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn UI Components
- **Routing**: React Router DOM
- **State Management**: React Hooks + URL Parameters
- **Backend**: Supabase (Database + Authentication)
- **Deployment**: Lovable Platform

### Component Hierarchy / Mpangilio wa Vipengele

```
App.tsx (Root Component)
├── Navigation.tsx (Global Navigation)
├── Pages/
│   ├── Index.tsx (Homepage)
│   │   ├── HeroSection.tsx (Search Interface)
│   │   ├── PopularDestinations.tsx (Featured Cities)
│   │   ├── FeaturedProperties.tsx (Property Highlights)
│   │   ├── FeaturesSection.tsx (Platform Benefits)
│   │   └── Footer.tsx (Site Information)
│   ├── Browse.tsx (Property Listings)
│   ├── PropertyDetail.tsx (Individual Property)
│   ├── Favorites.tsx (Saved Properties)
│   ├── Dashboard.tsx (Host Panel)
│   ├── SignIn.tsx (Authentication)
│   ├── SignUp.tsx (Registration)
│   └── NotFound.tsx (404 Error)
└── Components/
    ├── PropertyCard.tsx (Property Display)
    └── UI Components (Shadcn Library)
```

---

## DATA FLOW / MTIRIRIKO WA DATA

### 1. User Journey / Safari ya Mtumiaji

**Homepage → Search → Browse → Property Details → Authentication**

1. **Landing (Index.tsx)**
   - User arrives on homepage
   - Sees hero search interface
   - Views popular destinations and featured properties

2. **Search (HeroSection.tsx)**
   - User enters search criteria (location, price range)
   - System builds URL with search parameters
   - Navigates to Browse page with filters

3. **Browse (Browse.tsx)**
   - Receives URL parameters from search
   - Filters properties based on criteria
   - Displays results in grid/list view
   - Allows further filtering and sorting

4. **Property Details (PropertyDetail.tsx)**
   - Shows detailed property information
   - Provides contact information for landlord
   - Allows adding to favorites

5. **Authentication (SignIn/SignUp.tsx)**
   - User registration and login
   - Access to favorites and host dashboard

---

## KEY COMPONENT INTERACTIONS / MWINGILIANO WA VIPENGELE VIKUU

### Search Flow / Mtiririko wa Utafutaji

```
HeroSection.tsx → URL Parameters → Browse.tsx
- buildSearchUrl() creates filtered URL
- Browse.tsx reads searchParams
- Properties filtered by location, price, type
```

### City Navigation / Uongozaji wa Miji

```
PopularDestinations.tsx → Browse.tsx
- City links pass location parameter
- Browse.tsx filters by city name
- Shows all properties in that city
```

### Favorites Management / Usimamizi wa Vipendwa

```
PropertyCard.tsx → Favorites.tsx
- Toggle favorite status
- Persist across pages
- Display in dedicated favorites page
```

---

## FILTERING LOGIC / MANTIKI YA KUCHUJA

### Location Filtering / Kuchuja kwa Eneo
- Partial string matching for city names
- Supports both full names ("Dar es Salaam") and short forms ("Dar")
- Includes sub-areas (Mikocheni, Mwananyamala, etc.)

### Price Filtering / Kuchuja kwa Bei
- Custom min/max price inputs
- Predefined price ranges
- Supports both URL parameters and form inputs

### Advanced Filters / Vichujio vya Kirefu
- Utilities: Electricity, Water
- Nearby Services: Schools, Hospitals, Markets
- Property Types: Houses, Apartments, Rooms, Offices

---

## STATE MANAGEMENT / USIMAMIZI WA HALI

### URL Parameters / Vigezo vya URL
- `location`: Search location
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `type`: Property type filter

### Local State / Hali ya Ndani
- Search form inputs
- Filter selections
- View mode preferences
- Mobile menu visibility
- Language selection

---

## RESPONSIVE DESIGN / MUUNDO UNAOJIBU

### Breakpoints / Vipimo vya Mabadiliko
- **Mobile**: < 768px - Stack layout, hamburger menu
- **Tablet**: 768px - 1024px - Adaptive grid
- **Desktop**: > 1024px - Full horizontal layout

### Mobile Optimizations / Maboresho ya Simu
- Collapsible navigation menu
- Touch-friendly buttons
- Optimized image sizes
- Simplified layouts

---

## INTERNATIONALIZATION / KIMATAIFA

### Supported Languages / Lugha Zinazosaidika
- **Kiswahili (sw)**: Default language for local users
- **English (en)**: International users

### Translation System / Mfumo wa Tafsiri
- Component-level translations
- Centralized translation objects
- Dynamic language switching
- Persistent language preference

---

## PERFORMANCE OPTIMIZATIONS / MABORESHO YA UTENDAJI

### Code Organization / Mpangilio wa Msimbo
- Component separation for reusability
- Efficient state management
- Optimized image loading
- Minimal re-renders

### Loading Strategies / Mikakati ya Kupakia
- Lazy loading for images
- Component-based code splitting
- Efficient filtering algorithms
- Cached search results

---

## SECURITY CONSIDERATIONS / MAMBO YA USALAMA

### Data Protection / Ulinzi wa Data
- URL parameter sanitization
- Input validation
- Secure authentication flows
- Protected routes for user data

### User Privacy / Faragha ya Mtumiaji
- No sensitive data in URLs
- Secure favorite storage
- Protected user information
- GDPR compliance considerations

---

## DEPLOYMENT / UWEKAJI

### Build Process / Mchakato wa Kujenga
- Vite build system
- TypeScript compilation
- Tailwind CSS optimization
- Asset optimization

### Environment Configuration / Mipangilio ya Mazingira
- Production builds
- Environment variables
- API endpoint configuration
- Performance monitoring

---

## FUTURE ENHANCEMENTS / MABORESHO YA BAADAYE

### Planned Features / Vipengele Vilivyopangwa
- Real-time messaging system
- Advanced map integration
- Payment processing
- Property management tools
- Mobile app development

### Scalability / Uwezekano wa Kukua
- Database optimization
- Caching strategies
- CDN integration
- Microservices architecture

---

**For technical support / Kwa msaada wa kiufundi: Contact development team**