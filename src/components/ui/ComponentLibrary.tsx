import React, { useState } from 'react';
import { 
  Heart, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Search, 
  Filter, 
  ArrowRight, 
  ChevronDown,
  Check,
  X,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  User,
  Lock,
  Home,
  Building,
  Car,
  Wifi,
  Shield,
  Users,
  Award,
  TrendingUp,
  Zap,
  Sparkles
} from 'lucide-react';

/**
 * COMPONENT LIBRARY - NYUMBA LINK UI SYSTEM
 * ==========================================
 * 
 * A comprehensive showcase of all reusable UI components built with the new color system.
 * This library demonstrates the design tokens, color palette, and component patterns.
 * 
 * COMPONENTS INCLUDED:
 * - Buttons (Primary, Secondary, Success, Warning, Destructive, Ghost, Link)
 * - Cards (Basic, Interactive, Feature, Testimonial, Stats)
 * - Form Elements (Input, Select, Checkbox, Radio, Toggle)
 * - Navigation (Breadcrumbs, Tabs, Pagination)
 * - Feedback (Alert, Badge, Toast, Progress)
 * - Layout (Container, Grid, Divider, Spacer)
 * - Data Display (Table, List, Timeline, Avatar)
 */

// ============================================================================
// BUTTON COMPONENTS
// ============================================================================

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

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  className = ''
}) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary shadow-soft hover:shadow-medium",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary shadow-soft hover:shadow-medium",
    success: "bg-success text-success-foreground hover:bg-success/90 focus:ring-success shadow-soft hover:shadow-medium",
    warning: "bg-warning text-warning-foreground hover:bg-warning/90 focus:ring-warning shadow-soft hover:shadow-medium",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive shadow-soft hover:shadow-medium",
    ghost: "bg-transparent text-foreground hover:bg-muted focus:ring-muted",
    link: "bg-transparent text-primary hover:text-primary/80 underline-offset-4 hover:underline focus:ring-primary"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

// ============================================================================
// CARD COMPONENTS
// ============================================================================

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: "bg-card text-card-foreground border border-border shadow-soft",
    elevated: "bg-card text-card-foreground border border-border shadow-medium hover:shadow-strong transition-shadow duration-300",
    outlined: "bg-transparent text-foreground border-2 border-border",
    glass: "bg-glass-light/80 backdrop-blur-md border border-white/20 shadow-soft"
  };

  return (
    <div className={`rounded-xl p-6 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

// ============================================================================
// FORM COMPONENTS
// ============================================================================

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  error?: string;
  disabled?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  placeholder, 
  type = 'text', 
  error, 
  disabled, 
  className = '' 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-label text-foreground">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-lg border transition-all duration-300
          bg-background text-foreground placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-destructive focus:ring-destructive' : 'border-border'}
          ${className}
        `}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

// ============================================================================
// FEEDBACK COMPONENTS
// ============================================================================

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: "bg-muted text-muted-foreground border border-border",
    success: "bg-success/10 text-success border border-success/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
    destructive: "bg-destructive/10 text-destructive border border-destructive/20",
    info: "bg-info/10 text-info border border-info/20"
  };

  return (
    <div className={`rounded-lg p-4 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '' 
}) => {
  const variants = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary text-primary-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "bg-transparent text-foreground border border-border"
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, size = 'lg', className = '' }) => {
  const sizes = {
    sm: "max-w-3xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full"
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT LIBRARY SHOWCASE
// ============================================================================

const ComponentLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState('buttons');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const tabs = [
    { id: 'buttons', label: 'Buttons', icon: Zap },
    { id: 'cards', label: 'Cards', icon: Building },
    { id: 'forms', label: 'Forms', icon: User },
    { id: 'feedback', label: 'Feedback', icon: Star },
    { id: 'layout', label: 'Layout', icon: Grid },
    { id: 'colors', label: 'Colors', icon: Palette }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Container>
        {/* Header */}
        <div className="py-12 text-center">
          <h1 className="text-display-2 bg-gradient-to-r from-primary to-serengeti-500 bg-clip-text text-transparent mb-4">
            Component Library
          </h1>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            A comprehensive showcase of all reusable UI components built with the new color system, 
            typography, and design tokens for Nyumba Link.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground shadow-medium' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {/* Buttons Section */}
          {activeTab === 'buttons' && (
            <section className="space-y-8">
              <div className="text-center">
                <h2 className="text-heading-1 mb-4">Button Components</h2>
                <p className="text-body-medium text-muted-foreground">
                  Various button styles with different variants, sizes, and states
                </p>
              </div>

              {/* Button Variants */}
              <Card>
                <h3 className="text-heading-3 mb-6">Button Variants</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </Card>

              {/* Button Sizes */}
              <Card>
                <h3 className="text-heading-3 mb-6">Button Sizes</h3>
                <div className="flex flex-wrap gap-4 justify-center items-center">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </Card>

              {/* Button States */}
              <Card>
                <h3 className="text-heading-3 mb-6">Button States</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button>Normal</Button>
                  <Button disabled>Disabled</Button>
                  <Button loading>Loading</Button>
                  <Button icon={<Heart className="h-4 w-4" />}>With Icon</Button>
                  <Button icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
                    With Right Icon
                  </Button>
                </div>
              </Card>
            </section>
          )}

          {/* Cards Section */}
          {activeTab === 'cards' && (
            <section className="space-y-8">
              <div className="text-center">
                <h2 className="text-heading-1 mb-4">Card Components</h2>
                <p className="text-body-medium text-muted-foreground">
                  Different card styles for various content types
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Default Card */}
                <Card>
                  <h3 className="text-heading-3 mb-2">Default Card</h3>
                  <p className="text-body-small text-muted-foreground mb-4">
                    Basic card with subtle shadow and border
                  </p>
                  <Button size="sm">Learn More</Button>
                </Card>

                {/* Elevated Card */}
                <Card variant="elevated">
                  <h3 className="text-heading-3 mb-2">Elevated Card</h3>
                  <p className="text-body-small text-muted-foreground mb-4">
                    Card with enhanced shadow and hover effects
                  </p>
                  <Button size="sm" variant="secondary">Get Started</Button>
                </Card>

                {/* Glass Card */}
                <Card variant="glass">
                  <h3 className="text-heading-3 mb-2">Glass Card</h3>
                  <p className="text-body-small text-muted-foreground mb-4">
                    Modern glassmorphism effect with backdrop blur
                  </p>
                  <Button size="sm" variant="ghost">Explore</Button>
                </Card>

                {/* Feature Card */}
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

                {/* Stats Card */}
                <Card variant="outlined" className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">1,234</div>
                  <div className="text-body-medium text-muted-foreground mb-2">Total Properties</div>
                  <div className="flex items-center justify-center text-success text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12% from last month
                  </div>
                </Card>

                {/* Testimonial Card */}
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
              </div>
            </section>
          )}

          {/* Forms Section */}
          {activeTab === 'forms' && (
            <section className="space-y-8">
              <div className="text-center">
                <h2 className="text-heading-1 mb-4">Form Components</h2>
                <p className="text-body-medium text-muted-foreground">
                  Interactive form elements with validation states
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <Card>
                  <h3 className="text-heading-3 mb-6">Contact Form</h3>
                  <form className="space-y-6">
                    <Input
                      label="Full Name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <Input
                      label="Message"
                      placeholder="Enter your message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                    <div className="flex gap-4">
                      <Button type="submit" className="flex-1">
                        Send Message
                      </Button>
                      <Button variant="ghost" type="button">
                        Reset
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            </section>
          )}

          {/* Feedback Section */}
          {activeTab === 'feedback' && (
            <section className="space-y-8">
              <div className="text-center">
                <h2 className="text-heading-1 mb-4">Feedback Components</h2>
                <p className="text-body-medium text-muted-foreground">
                  Components for user feedback and system status
                </p>
              </div>

              <div className="space-y-6">
                {/* Alerts */}
                <Card>
                  <h3 className="text-heading-3 mb-6">Alert Messages</h3>
                  <div className="space-y-4">
                    <Alert variant="default">
                      This is a default alert message with important information.
                    </Alert>
                    <Alert variant="success">
                      <div className="flex items-center">
                        <Check className="h-4 w-4 mr-2" />
                        Success! Your action was completed successfully.
                      </div>
                    </Alert>
                    <Alert variant="warning">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Warning: Please review your input before proceeding.
                      </div>
                    </Alert>
                    <Alert variant="destructive">
                      <div className="flex items-center">
                        <X className="h-4 w-4 mr-2" />
                        Error: Something went wrong. Please try again.
                      </div>
                    </Alert>
                    <Alert variant="info">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Info: System maintenance scheduled for tonight.
                      </div>
                    </Alert>
                  </div>
                </Card>

                {/* Badges */}
                <Card>
                  <h3 className="text-heading-3 mb-6">Badge Components</h3>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-heading-3 mb-4">Badge Sizes</h4>
                    <div className="flex flex-wrap gap-4 items-center">
                      <Badge size="sm">Small</Badge>
                      <Badge size="md">Medium</Badge>
                      <Badge size="lg">Large</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          )}

          {/* Layout Section */}
          {activeTab === 'layout' && (
            <section className="space-y-8">
              <div className="text-center">
                <h2 className="text-heading-1 mb-4">Layout Components</h2>
                <p className="text-body-medium text-muted-foreground">
                  Structural components for organizing content
                </p>
              </div>

              <div className="space-y-6">
                {/* Container Demo */}
                <Card>
                  <h3 className="text-heading-3 mb-6">Container Sizes</h3>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm font-medium mb-2">Small Container (max-w-3xl)</div>
                      <div className="h-8 bg-primary/20 rounded"></div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm font-medium mb-2">Medium Container (max-w-4xl)</div>
                      <div className="h-8 bg-secondary/20 rounded"></div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm font-medium mb-2">Large Container (max-w-6xl)</div>
                      <div className="h-8 bg-success/20 rounded"></div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm font-medium mb-2">Extra Large Container (max-w-7xl)</div>
                      <div className="h-8 bg-warning/20 rounded"></div>
                    </div>
                  </div>
                </Card>

                {/* Grid Demo */}
                <Card>
                  <h3 className="text-heading-3 mb-6">Grid System</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                      <div key={item} className="h-20 bg-gradient-to-br from-primary/20 to-serengeti-500/20 rounded-lg flex items-center justify-center text-sm font-medium">
                        Item {item}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </section>
          )}

          {/* Colors Section */}
          {activeTab === 'colors' && (
            <section className="space-y-8">
              <div className="text-center">
                <h2 className="text-heading-1 mb-4">Color System</h2>
                <p className="text-body-medium text-muted-foreground">
                  Complete color palette with semantic and Tanzanian-inspired colors
                </p>
              </div>

              <div className="space-y-8">
                {/* Core Colors */}
                <Card>
                  <h3 className="text-heading-3 mb-6">Core Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['primary', 'secondary', 'muted', 'accent'].map((color) => (
                      <div key={color} className="space-y-2">
                        <div className={`h-16 bg-${color} rounded-lg shadow-soft`}></div>
                        <div className="text-center">
                          <div className="text-sm font-medium capitalize">{color}</div>
                          <div className="text-xs text-muted-foreground">bg-{color}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Semantic Colors */}
                <Card>
                  <h3 className="text-heading-3 mb-6">Semantic Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['success', 'warning', 'info', 'destructive'].map((color) => (
                      <div key={color} className="space-y-2">
                        <div className={`h-16 bg-${color} rounded-lg shadow-soft`}></div>
                        <div className="text-center">
                          <div className="text-sm font-medium capitalize">{color}</div>
                          <div className="text-xs text-muted-foreground">bg-{color}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Tanzanian Colors */}
                <Card>
                  <h3 className="text-heading-3 mb-6">Tanzanian-Inspired Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['safari', 'kilimanjaro', 'serengeti'].map((color) => (
                      <div key={color} className="space-y-3">
                        <div className="text-center">
                          <div className="text-lg font-semibold capitalize mb-3">{color}</div>
                        </div>
                        <div className="space-y-2">
                          {[500, 600, 700].map((shade) => (
                            <div key={shade} className="flex items-center space-x-3">
                              <div className={`w-8 h-8 bg-${color}-${shade} rounded shadow-soft`}></div>
                              <div className="text-sm">
                                <div className="font-medium">{color}-{shade}</div>
                                <div className="text-xs text-muted-foreground">bg-{color}-{shade}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Gradients */}
                <Card>
                  <h3 className="text-heading-3 mb-6">Gradient Utilities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="text-sm font-medium mb-2">Primary Gradients</div>
                      <div className="h-16 bg-primary-gradient rounded-lg shadow-soft"></div>
                      <div className="h-16 bg-primary-gradient-light rounded-lg shadow-soft"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm font-medium mb-2">Tanzanian Gradients</div>
                      <div className="h-16 bg-safari-gradient rounded-lg shadow-soft"></div>
                      <div className="h-16 bg-serengeti-gradient rounded-lg shadow-soft"></div>
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="py-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-serengeti-500/10 rounded-2xl p-8">
            <h3 className="text-heading-2 mb-4">Ready to Use These Components?</h3>
            <p className="text-body-medium text-muted-foreground mb-6 max-w-2xl mx-auto">
              All these components are built with the new color system and are ready to be used 
              throughout your Nyumba Link application. They're fully responsive and accessible.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" icon={<Sparkles className="h-5 w-5" />}>
                Start Building
              </Button>
              <Button variant="ghost" size="lg">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ComponentLibrary;
