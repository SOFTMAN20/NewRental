# 🧩 Component Library - Nyumba Link UI System

## Overview
A comprehensive collection of reusable UI components built with the new color system, typography, and design tokens. This library provides consistent, accessible, and beautiful components for the entire Nyumba Link application.

## 🌟 What's Included

### 1. **Button Components**
- Multiple variants (Primary, Secondary, Success, Warning, Destructive, Ghost, Link)
- Different sizes (Small, Medium, Large, Extra Large)
- States (Normal, Disabled, Loading)
- Icon support (Left, Right positioning)

### 2. **Card Components**
- Variants (Default, Elevated, Outlined, Glass)
- Specialized cards (Feature, Stats, Testimonial)
- Responsive design with hover effects

### 3. **Form Components**
- Input fields with validation states
- Labels and error handling
- Accessible form controls

### 4. **Feedback Components**
- Alert messages (Default, Success, Warning, Destructive, Info)
- Badge components with multiple variants
- Toast notifications and progress indicators

### 5. **Layout Components**
- Container system with responsive breakpoints
- Grid layouts and spacing utilities
- Responsive design patterns

### 6. **Color System Integration**
- Full integration with new HSL color variables
- Semantic color usage
- Tanzanian-inspired color palette

## 🚀 Quick Start

### Installation
All components are available in `src/components/ui/ComponentLibrary.tsx` and can be imported directly.

### Basic Usage
```tsx
import { Button, Card, Input, Alert, Badge } from '@/components/ui/ComponentLibrary';

// Use components
<Button variant="primary" size="lg">Click Me</Button>
<Card variant="elevated">Content here</Card>
<Input label="Name" placeholder="Enter your name" />
<Alert variant="success">Success message</Alert>
<Badge variant="primary">New</Badge>
```

## 📝 Component Reference

### Button Component

#### Props
```tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  className?: string;
}
```

#### Variants
```tsx
// Primary Button (Default)
<Button>Primary Button</Button>

// Secondary Button
<Button variant="secondary">Secondary Button</Button>

// Success Button
<Button variant="success">Success Button</Button>

// Warning Button
<Button variant="warning">Warning Button</Button>

// Destructive Button
<Button variant="destructive">Delete</Button>

// Ghost Button
<Button variant="ghost">Ghost Button</Button>

// Link Button
<Button variant="link">Link Button</Button>
```

#### Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

#### States
```tsx
// Normal state
<Button>Normal Button</Button>

// Disabled state
<Button disabled>Disabled Button</Button>

// Loading state
<Button loading>Loading Button</Button>

// With icon
<Button icon={<Heart className="h-4 w-4" />}>With Icon</Button>

// Icon on right
<Button icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
  With Right Icon
</Button>
```

### Card Component

#### Props
```tsx
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  className?: string;
}
```

#### Variants
```tsx
// Default Card
<Card>
  <h3>Default Card</h3>
  <p>Basic card with subtle shadow and border</p>
</Card>

// Elevated Card
<Card variant="elevated">
  <h3>Elevated Card</h3>
  <p>Card with enhanced shadow and hover effects</p>
</Card>

// Outlined Card
<Card variant="outlined">
  <h3>Outlined Card</h3>
  <p>Card with border only, no background</p>
</Card>

// Glass Card
<Card variant="glass">
  <h3>Glass Card</h3>
  <p>Modern glassmorphism effect with backdrop blur</p>
</Card>
```

#### Specialized Cards
```tsx
// Feature Card
<Card variant="elevated" className="text-center">
  <div className="w-12 h-12 bg-gradient-to-br from-primary to-serengeti-500 rounded-xl flex items-center justify-center mx-auto mb-4">
    <Home className="h-6 w-6 text-white" />
  </div>
  <h3 className="text-heading-3 mb-2">Feature Title</h3>
  <p className="text-body-small text-muted-foreground mb-4">
    Description of the amazing feature
  </p>
  <Badge variant="primary">New</Badge>
</Card>

// Stats Card
<Card variant="outlined" className="text-center">
  <div className="text-4xl font-bold text-primary mb-2">1,234</div>
  <div className="text-body-medium text-muted-foreground mb-2">Total Properties</div>
  <div className="flex items-center justify-center text-success text-sm">
    <TrendingUp className="h-4 w-4 mr-1" />
    +12% from last month
  </div>
</Card>

// Testimonial Card
<Card variant="glass" className="text-center">
  <div className="w-16 h-16 bg-gradient-to-br from-safari-500 to-kilimanjaro-500 rounded-full mx-auto mb-4 flex items-center justify-center">
    <User className="h-8 w-8 text-white" />
  </div>
  <p className="text-body-medium text-muted-foreground mb-4 italic">
    "Amazing platform! Found my dream house in just a few days."
  </p>
  <div className="text-sm font-semibold">John Doe</div>
  <div className="text-xs text-muted-foreground">Dar es Salaam</div>
</Card>
```

### Input Component

#### Props
```tsx
interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  error?: string;
  disabled?: boolean;
  className?: string;
}
```

#### Usage
```tsx
// Basic Input
<Input placeholder="Enter your name" />

// With Label
<Input label="Full Name" placeholder="Enter your full name" />

// With Error
<Input 
  label="Email" 
  type="email" 
  placeholder="Enter your email"
  error="Please enter a valid email address"
/>

// Disabled Input
<Input 
  label="Username" 
  placeholder="Username" 
  disabled 
/>
```

### Alert Component

#### Props
```tsx
interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
  className?: string;
}
```

#### Variants
```tsx
// Default Alert
<Alert>
  This is a default alert message with important information.
</Alert>

// Success Alert
<Alert variant="success">
  <div className="flex items-center">
    <Check className="h-4 w-4 mr-2" />
    Success! Your action was completed successfully.
  </div>
</Alert>

// Warning Alert
<Alert variant="warning">
  <div className="flex items-center">
    <Shield className="h-4 w-4 mr-2" />
    Warning: Please review your input before proceeding.
  </div>
</Alert>

// Destructive Alert
<Alert variant="destructive">
  <div className="flex items-center">
    <X className="h-4 w-4 mr-2" />
    Error: Something went wrong. Please try again.
  </div>
</Alert>

// Info Alert
<Alert variant="info">
  <div className="flex items-center">
    <Clock className="h-4 w-4 mr-2" />
    Info: System maintenance scheduled for tonight.
  </div>
</Alert>
```

### Badge Component

#### Props
```tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

#### Variants
```tsx
<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

#### Sizes
```tsx
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

### Container Component

#### Props
```tsx
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}
```

#### Sizes
```tsx
// Small Container (max-w-3xl)
<Container size="sm">
  <p>Content for small containers</p>
</Container>

// Medium Container (max-w-4xl)
<Container size="md">
  <p>Content for medium containers</p>
</Container>

// Large Container (max-w-6xl) - Default
<Container size="lg">
  <p>Content for large containers</p>
</Container>

// Extra Large Container (max-w-7xl)
<Container size="xl">
  <p>Content for extra large containers</p>
</Container>

// Full Width Container
<Container size="full">
  <p>Content that spans full width</p>
</Container>
```

## 🎨 Color System Integration

### Using Semantic Colors
```tsx
// Primary colors
<Button className="bg-primary text-primary-foreground">Primary Button</Button>

// Success colors
<Alert variant="success" className="bg-success/10 text-success border-success/20">
  Success message
</Alert>

// Warning colors
<Badge variant="warning" className="bg-warning text-warning-foreground">
  Warning
</Badge>

// Destructive colors
<Button variant="destructive" className="bg-destructive text-destructive-foreground">
  Delete
</Button>
```

### Using Tanzanian Colors
```tsx
// Safari colors
<div className="bg-safari-500 text-white">Safari themed content</div>

// Kilimanjaro colors
<div className="bg-kilimanjaro-600 text-white">Kilimanjaro themed content</div>

// Serengeti colors
<div className="bg-serengeti-700 text-white">Serengeti themed content</div>

// Gradients
<div className="bg-safari-gradient">Safari gradient background</div>
<div className="bg-serengeti-gradient">Serengeti gradient background</div>
```

### Using Custom Shadows
```tsx
// Soft shadow
<div className="shadow-soft">Soft shadow element</div>

// Medium shadow
<div className="shadow-medium">Medium shadow element</div>

// Strong shadow
<div className="shadow-strong">Strong shadow element</div>

// Colored shadow
<div className="shadow-colored">Colored shadow element</div>
```

## 🔧 Advanced Usage

### Custom Styling
```tsx
// Custom button with additional classes
<Button 
  variant="primary" 
  className="w-full md:w-auto transform hover:scale-105"
>
  Custom Button
</Button>

// Custom card with specific styling
<Card 
  variant="elevated" 
  className="max-w-md mx-auto text-center bg-gradient-to-br from-primary/5 to-serengeti-500/5"
>
  <h3>Custom Styled Card</h3>
  <p>This card has custom background and positioning</p>
</Card>
```

### Component Composition
```tsx
// Building complex components
const PropertyCard = ({ property }) => (
  <Card variant="elevated" className="group hover:scale-105 transition-transform duration-300">
    <div className="relative">
      <img src={property.image} alt={property.title} className="w-full h-48 object-cover rounded-lg" />
      <Badge variant="primary" className="absolute top-4 right-4">
        {property.status}
      </Badge>
    </div>
    <div className="p-4">
      <h3 className="text-heading-3 mb-2">{property.title}</h3>
      <p className="text-body-small text-muted-foreground mb-4">{property.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-primary">{property.price}</span>
        <Button size="sm" variant="secondary">
          View Details
        </Button>
      </div>
    </div>
  </Card>
);
```

### Form Validation
```tsx
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.message) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Submit form
      console.log('Form submitted:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Full Name"
        placeholder="Enter your full name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
      />
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
      />
      <Input
        label="Message"
        placeholder="Enter your message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        error={errors.message}
      />
      <Button type="submit" className="w-full">
        Send Message
      </Button>
    </form>
  );
};
```

## 📱 Responsive Design

### Mobile-First Approach
```tsx
// Responsive button
<Button 
  size="sm" 
  className="w-full sm:w-auto px-4 sm:px-6"
>
  Responsive Button
</Button>

// Responsive card grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>

// Responsive container
<Container size="lg" className="px-4 sm:px-6 lg:px-8">
  <div className="text-center sm:text-left">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl">Responsive Title</h1>
  </div>
</Container>
```

## ♿ Accessibility Features

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus states with visible focus rings
- Proper tab order

### Screen Reader Support
- Semantic HTML structure
- ARIA labels where appropriate
- Proper heading hierarchy

### Color Contrast
- All color combinations meet WCAG AA standards
- High contrast ratios for text readability
- Semantic color usage for status indicators

## 🎯 Best Practices

### 1. **Consistent Usage**
- Use the same component variants throughout the application
- Maintain consistent spacing and sizing
- Follow the established design patterns

### 2. **Performance**
- Components are lightweight and optimized
- Minimal re-renders with proper prop handling
- Efficient CSS with Tailwind utilities

### 3. **Maintainability**
- All components are well-documented
- Consistent prop interfaces
- Easy to extend and customize

### 4. **Testing**
- Components are designed for easy testing
- Clear prop interfaces
- Predictable behavior

## 🚀 Getting Started

### 1. **View the Demo**
Visit `/component-library` to see all components in action.

### 2. **Import Components**
```tsx
import { Button, Card, Input, Alert, Badge } from '@/components/ui/ComponentLibrary';
```

### 3. **Start Building**
Use the components in your pages and components:
```tsx
const MyPage = () => (
  <Container>
    <Card variant="elevated">
      <h1 className="text-heading-1 mb-6">Welcome to Nyumba Link</h1>
      <p className="text-body-medium text-muted-foreground mb-6">
        Find your dream home in Tanzania
      </p>
      <div className="flex gap-4">
        <Button variant="primary" size="lg">
          Get Started
        </Button>
        <Button variant="ghost" size="lg">
          Learn More
        </Button>
      </div>
    </Card>
  </Container>
);
```

### 4. **Customize as Needed**
Extend components with additional props and styling:
```tsx
<Button 
  variant="primary" 
  size="lg" 
  className="w-full md:w-auto bg-gradient-to-r from-primary to-serengeti-500"
>
  Custom Styled Button
</Button>
```

## 📚 Resources

- **Component Demo**: `/component-library`
- **Color Palette**: `/color-palette`
- **Typography System**: `/typography`
- **Loading States**: `/loading-states`
- **CSS Variables**: `src/index.css`
- **Tailwind Config**: `tailwind.config.ts`

## 🔮 Future Enhancements

### Planned Components
- **Data Display**: Table, List, Timeline, Avatar
- **Navigation**: Breadcrumbs, Tabs, Pagination, Menu
- **Overlay**: Modal, Drawer, Popover, Tooltip
- **Feedback**: Progress, Skeleton, Toast, Notification
- **Form**: Select, Checkbox, Radio, Toggle, Switch

### Advanced Features
- **Theme Switching**: Dark/Light mode support
- **Animation Library**: Pre-built animation components
- **Icon System**: Comprehensive icon library
- **Layout Components**: Advanced grid and flexbox utilities

---

*This component library is designed to evolve with your application. New components and patterns can be added while maintaining consistency and accessibility. All components follow modern React patterns and are built with TypeScript for type safety.*
