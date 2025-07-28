# 🏠 NyumbaLink - Tanzania Housing Platform

NyumbaLink is a mobile-first web application that connects tenants looking for rental houses with landlords offering properties in Tanzania. The platform allows landlords to list available houses, while tenants can browse, filter, and contact landlords directly via phone.

## 🎯 Features

### 🏠 For Landlords
- Sign up / Login via Supabase Auth
- Add property listings with title, description, location, rent price, contact phone, and images
- View, edit, delete, and mark properties as "Rented"
- Dashboard to manage all listings
- Image upload to Supabase Storage

### 🔍 For Tenants
- Browse property listings without login
- Filter by location, price range, utilities, and nearby services
- View detailed property information
- Direct phone contact with landlords (tap-to-call)
- Save favorite properties
- Mobile-optimized browsing experience

## 🛠️ Tech Stack

- **Frontend**: React.js with TypeScript
- **Styling**: TailwindCSS with Shadcn UI components
- **Backend**: Supabase (Authentication, Database, Storage)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Routing**: React Router DOM
- **State Management**: React Query + React Hooks
- **Build Tool**: Vite

## 📱 Mobile-First Design

NyumbaLink is built with a mobile-first approach:
- Responsive design that works on all screen sizes
- Touch-friendly interface elements
- Optimized for mobile browsing and interaction
- Fast loading times even on slower connections
- Progressive Web App (PWA) capabilities

## 🔐 Security Features

- Supabase Authentication with email/password
- Row Level Security (RLS) policies
- Landlords can only access their own listings
- Secure image upload and storage
- Input validation and sanitization

## 🌍 Internationalization

- Multi-language support (Swahili and English)
- Localized content and interface
- Cultural adaptation for Tanzanian market

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```sh
git clone https://github.com/your-username/nyumbalink.git
cd nyumbalink
```

2. Install dependencies:
```sh
npm install
```

3. Set up environment variables:
```sh
# Copy the example environment file
cp .env.example .env.local

# Add your Supabase credentials to .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```sh
npm run dev
```

5. Open your browser and navigate to `http://localhost:8080`

## 📊 Database Schema

The application uses the following main tables:

- `profiles`: User information and authentication data
- `properties`: Property listings with details and metadata
- `property_inquiries`: Communication between tenants and landlords

All tables include Row Level Security policies to ensure data privacy and security.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 PWA Features

NyumbaLink includes Progressive Web App features:
- Installable on mobile devices
- Offline-ready capabilities
- App-like experience
- Fast loading and smooth navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the Tanzanian housing market
- Inspired by the need for better tenant-landlord connections
- Designed with mobile-first principles for accessibility

## 📞 Support

For support, email info@nyumbalink.co.tz or join our community discussions.