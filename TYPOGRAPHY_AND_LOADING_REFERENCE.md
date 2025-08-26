# 📝 Typography System & 🎬 Loading States & Animations - Nyumba Link

## Overview
A comprehensive typography system and loading states & animations designed for consistency, readability, and enhanced user experience. Built with CSS custom properties and modern animation techniques.

## 🌟 What's New

### 1. Typography System
- **Font Family System**: Display, Sans, and Mono fonts for different use cases
- **Font Size Scale**: Consistent scale from xs (12px) to 9xl (128px)
- **Font Weight Scale**: Complete range from thin (100) to black (900)
- **Line Height Scale**: Optimized spacing for readability
- **Letter Spacing Scale**: Precise control over text spacing
- **Typography Component Classes**: Pre-built combinations for consistent usage

### 2. Loading States & Animations
- **Skeleton Loaders**: Placeholder content for different content types
- **Loading Spinners**: Multiple spinner variations
- **Progress Indicators**: Linear and circular progress bars
- **Animation Utilities**: Pre-built animation classes
- **Micro-interactions**: Hover effects and focus states
- **Page Transitions**: Smooth state changes

## 📝 Typography System

### Font Family System
```css
--font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
--font-family-display: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

**Usage:**
```tsx
className="text-display"    // Poppins for headings
className="text-body"       // Inter for body text
className="text-mono"       // JetBrains Mono for code
```

### Font Size Scale
```css
--font-size-xs: 0.75rem;      /* 12px */
--font-size-sm: 0.875rem;     /* 14px */
--font-size-base: 1rem;       /* 16px */
--font-size-lg: 1.125rem;     /* 18px */
--font-size-xl: 1.25rem;      /* 20px */
--font-size-2xl: 1.5rem;      /* 24px */
--font-size-3xl: 1.875rem;    /* 30px */
--font-size-4xl: 2.25rem;     /* 36px */
--font-size-5xl: 3rem;        /* 48px */
--font-size-6xl: 3.75rem;     /* 60px */
--font-size-7xl: 4.5rem;      /* 72px */
--font-size-8xl: 6rem;        /* 96px */
--font-size-9xl: 8rem;        /* 128px */
```

**Usage:**
```tsx
className="text-xs"    // 12px
className="text-sm"    // 14px
className="text-base"  // 16px
className="text-lg"    // 18px
className="text-xl"    // 20px
className="text-2xl"   // 24px
className="text-3xl"   // 30px
className="text-4xl"   // 36px
className="text-5xl"   // 48px
className="text-6xl"   // 60px
className="text-7xl"   // 72px
className="text-8xl"   // 96px
className="text-9xl"   // 128px
```

### Font Weight Scale
```css
--font-weight-thin: 100;
--font-weight-extralight: 200;
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
--font-weight-black: 900;
```

**Usage:**
```tsx
className="font-thin"        // 100
className="font-extralight"  // 200
className="font-light"       // 300
className="font-normal"      // 400
className="font-medium"      // 500
className="font-semibold"    // 600
className="font-bold"        // 700
className="font-extrabold"   // 800
className="font-black"       // 900
```

### Line Height Scale
```css
--line-height-none: 1;
--line-height-tight: 1.25;
--line-height-snug: 1.375;
--line-height-normal: 1.5;
--line-height-relaxed: 1.625;
--line-height-loose: 2;
```

**Usage:**
```tsx
className="leading-none"     // 1.0
className="leading-tight"    // 1.25
className="leading-snug"     // 1.375
className="leading-normal"   // 1.5
className="leading-relaxed"  // 1.625
className="leading-loose"    // 2.0
```

### Letter Spacing Scale
```css
--letter-spacing-tighter: -0.05em;
--letter-spacing-tight: -0.025em;
--letter-spacing-normal: 0em;
--letter-spacing-wide: 0.025em;
--letter-spacing-wider: 0.05em;
--letter-spacing-widest: 0.1em;
```

**Usage:**
```tsx
className="tracking-tighter" // -0.05em
className="tracking-tight"   // -0.025em
className="tracking-normal"  // 0em
className="tracking-wide"    // 0.025em
className="tracking-wider"   // 0.05em
className="tracking-widest"  // 0.1em
```

### Typography Component Classes
```css
.text-display-1    /* Hero text - 6xl, black weight, tight leading */
.text-display-2    /* Section headers - 5xl, extrabold weight */
.text-display-3    /* Page titles - 4xl, bold weight */
.text-heading-1    /* Main headings - 3xl, bold weight */
.text-heading-2    /* Sub headings - 2xl, semibold weight */
.text-heading-3    /* Component titles - xl, semibold weight */
.text-body-large   /* Enhanced readability - lg, normal weight */
.text-body-medium  /* Standard content - base, normal weight */
.text-body-small   /* Compact information - sm, normal weight */
.text-caption      /* Supporting text - xs, medium weight */
.text-label        /* Form labels - sm, semibold weight */
.text-button       /* Button text - sm, semibold weight */
.text-code         /* Technical content - sm, mono font */
```

**Usage:**
```tsx
<h1 className="text-display-1">Hero Title</h1>
<h2 className="text-heading-1">Section Header</h2>
<p className="text-body-medium">Main content text</p>
<span className="text-caption">Supporting information</span>
```

### Text Color Utilities
```tsx
className="text-primary"      // Primary brand color
className="text-secondary"    // Secondary brand color
className="text-muted"        // Muted text color
className="text-accent"       // Accent color
className="text-success"      // Success state color
className="text-warning"      // Warning state color
className="text-info"         // Information color
className="text-destructive"  // Error/destructive color
```

### Link and Emphasis Styles
```tsx
className="text-link"         // Primary link style with underline
className="text-link-muted"   // Muted link style
className="text-emphasis"     // Emphasized text
className="text-subtle"       // Subtle text
className="text-muted"        // Muted text
```

## 🎬 Loading States & Animations

### Skeleton Loaders

#### Card Skeleton
```tsx
<div className="border rounded-lg p-4 space-y-3 animate-pulse">
  <div className="h-48 bg-muted rounded-lg"></div>
  <div className="space-y-2">
    <div className="h-4 bg-muted rounded w-3/4"></div>
    <div className="h-3 bg-muted rounded w-1/2"></div>
    <div className="h-3 bg-muted rounded w-2/3"></div>
  </div>
  <div className="flex space-x-2">
    <div className="h-6 bg-muted rounded w-16"></div>
    <div className="h-6 bg-muted rounded w-20"></div>
  </div>
</div>
```

#### List Skeleton
```tsx
<div className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
  <div className="h-12 w-12 bg-muted rounded-full"></div>
  <div className="flex-1 space-y-2">
    <div className="h-4 bg-muted rounded w-1/4"></div>
    <div className="h-3 bg-muted rounded w-1/2"></div>
  </div>
  <div className="h-8 bg-muted rounded w-20"></div>
</div>
```

#### Form Skeleton
```tsx
<div className="space-y-4 max-w-md">
  <div className="space-y-2">
    <div className="h-4 bg-muted rounded w-20"></div>
    <div className="h-10 bg-muted rounded"></div>
  </div>
  <div className="space-y-2">
    <div className="h-4 bg-muted rounded w-24"></div>
    <div className="h-10 bg-muted rounded"></div>
  </div>
  <div className="h-10 bg-muted rounded w-24"></div>
</div>
```

### Loading Spinners

#### Circular Spinner
```tsx
<div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
```

#### Dots Spinner
```tsx
<div className="flex space-x-1">
  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
</div>
```

#### Pulse Spinner
```tsx
<div className="w-12 h-12 bg-primary rounded-full animate-pulse-soft"></div>
```

#### Shimmer Spinner
```tsx
<div className="w-12 h-12 bg-gradient-to-r from-muted via-primary/20 to-muted rounded-lg animate-shimmer"></div>
```

### Progress Indicators

#### Linear Progress
```tsx
<div>
  <div className="flex justify-between text-sm text-muted-foreground mb-1">
    <span>Progress Label</span>
    <span>75%</span>
  </div>
  <div className="w-full bg-muted rounded-full h-2">
    <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
  </div>
</div>
```

#### Gradient Progress
```tsx
<div className="w-full bg-muted rounded-full h-3">
  <div className="bg-gradient-to-r from-primary to-serengeti-500 h-3 rounded-full transition-all duration-300" style={{ width: '60%' }}></div>
</div>
```

#### Circular Progress
```tsx
<div className="relative inline-flex items-center justify-center">
  <svg className="w-20 h-20 transform -rotate-90">
    <circle
      cx="40"
      cy="40"
      r="36"
      stroke="currentColor"
      strokeWidth="8"
      fill="transparent"
      className="text-muted"
    />
    <circle
      cx="40"
      cy="40"
      r="36"
      stroke="currentColor"
      strokeWidth="8"
      fill="transparent"
      strokeDasharray={`${2 * Math.PI * 36}`}
      strokeDashoffset={`${2 * Math.PI * 36 * (1 - 0.75)}`}
      className="text-primary transition-all duration-300"
    />
  </svg>
  <span className="absolute text-lg font-semibold">75%</span>
</div>
```

### Animation Utilities

#### Pre-built Animation Classes
```tsx
className="animate-fade-in"      // Fade in from bottom
className="animate-scale-in"     // Scale in from 0.9 to 1
className="animate-slide-up"     // Slide up from below
className="animate-slide-down"   // Slide down from above
className="animate-bounce-in"    // Bounce in with scale
className="animate-pulse-soft"   // Soft pulse effect
className="animate-shimmer"      // Shimmer animation
```

#### Custom Animation Keyframes
```css
@keyframes fade-in {
  0%: { opacity: '0', transform: 'translateY(20px)' };
  100%: { opacity: '1', transform: 'translateY(0)' };
}

@keyframes scale-in {
  0%: { opacity: '0', transform: 'scale(0.9)' };
  100%: { opacity: '1', transform: 'scale(1)' };
}

@keyframes slide-up {
  0%: { opacity: '0', transform: 'translateY(30px)' };
  100%: { opacity: '1', transform: 'translateY(0)' };
}

@keyframes bounce-in {
  0%: { opacity: '0', transform: 'scale(0.3)' };
  50%: { opacity: '1', transform: 'scale(1.05)' };
  70%: { transform: 'scale(0.9)' };
  100%: { opacity: '1', transform: 'scale(1)' };
}

@keyframes pulse-soft {
  0%, 100%: { opacity: '1' };
  50%: { opacity: '0.8' };
}

@keyframes shimmer {
  0%: { transform: 'translateX(-100%)' };
  100%: { transform: 'translateX(100%)' };
}
```

### Micro-interactions

#### Hover Effects
```tsx
// Scale on hover
<button className="transform hover:scale-105 transition-all duration-300">
  Hover to Scale
</button>

// Lift on hover
<button className="transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
  Hover to Lift
</button>

// Glow on hover
<button className="hover:bg-primary/90 hover:shadow-md transition-all duration-300">
  Hover to Glow
</button>
```

#### Focus States
```tsx
// Primary focus ring
<button className="focus-ring-primary focus:outline-none">
  Focus Me (Primary)
</button>

// Success focus ring
<button className="focus-ring-success focus:outline-none">
  Focus Me (Success)
</button>

// Warning focus ring
<button className="focus-ring-warning focus:outline-none">
  Focus Me (Warning)
</button>
```

### Page Transitions

#### Content Loading
```tsx
// Fade in content
<div className="animate-fade-in">
  <h4>Content Loaded</h4>
  <p>This content appeared with a fade-in animation.</p>
</div>

// Slide up content
<div className="animate-slide-up">
  <h4>Sliding Content</h4>
  <p>This content slid up from below.</p>
</div>

// Scale in content
<div className="animate-scale-in">
  <h4>Scaled Content</h4>
  <p>This content scaled in smoothly.</p>
</div>
```

#### State Changes
```tsx
// Success state
<div className="animate-fade-in p-4 bg-success/10 border border-success/20 rounded-lg">
  <h4 className="text-success">Success State</h4>
  <p className="text-success/80">Operation completed successfully!</p>
</div>

// Warning state
<div className="animate-slide-up p-4 bg-warning/10 border border-warning/20 rounded-lg">
  <h4 className="text-warning">Warning State</h4>
  <p className="text-warning/80">Please review your input.</p>
</div>
```

## 🎯 Best Practices

### Typography Guidelines
1. **Hierarchy**: Use consistent heading levels (h1-h6) with appropriate sizes
2. **Readability**: Choose appropriate line heights for content length
3. **Contrast**: Ensure sufficient contrast between text and background
4. **Consistency**: Use the same font combinations for similar content types
5. **Accessibility**: Maintain proper heading structure for screen readers

### Loading State Guidelines
1. **Always Show**: Display loading indicators for async operations
2. **Skeleton Loaders**: Use for content that takes time to load
3. **Progress Feedback**: Provide progress for long-running operations
4. **Consistency**: Keep loading states consistent across the application
5. **Timing**: Use appropriate loading times (not too fast, not too slow)

### Animation Guidelines
1. **Subtle**: Keep animations subtle and purposeful
2. **Consistent**: Use consistent timing and easing functions
3. **Accessibility**: Respect user preferences for reduced motion
4. **Performance**: Ensure animations don't interfere with functionality
5. **Testing**: Test on different devices and connection speeds

## 🚀 Implementation Examples

### Complete Article Layout
```tsx
<article className="space-y-6">
  <header className="space-y-4">
    <h1 className="text-display-2">Article Title</h1>
    <p className="text-body-large text-muted-foreground">Article subtitle with enhanced readability</p>
  </header>
  
  <div className="prose prose-lg max-w-none">
    <p className="text-body-medium">Main content paragraph using body-medium for optimal readability.</p>
    <p className="text-body-medium">The typography system ensures consistent spacing and visual hierarchy.</p>
  </div>
  
  <footer className="border-t pt-6">
    <p className="text-caption text-muted-foreground">Published on January 1, 2024</p>
  </footer>
</article>
```

### Loading State Component
```tsx
const LoadingCard = () => (
  <div className="border rounded-lg p-4 space-y-3 animate-pulse">
    <div className="h-48 bg-muted rounded-lg"></div>
    <div className="space-y-2">
      <div className="h-4 bg-muted rounded w-3/4"></div>
      <div className="h-3 bg-muted rounded w-1/2"></div>
    </div>
    <div className="flex space-x-2">
      <div className="h-6 bg-muted rounded w-16"></div>
      <div className="h-6 bg-muted rounded w-20"></div>
    </div>
  </div>
);
```

### Animated Button Component
```tsx
const AnimatedButton = ({ children, variant = 'primary', ...props }) => (
  <button
    className={`
      px-6 py-3 rounded-lg font-semibold text-button
      transform hover:scale-105 hover:shadow-lg
      focus-ring-${variant} focus:outline-none
      transition-all duration-300
      ${variant === 'primary' ? 'bg-primary text-primary-foreground' : ''}
      ${variant === 'success' ? 'bg-success text-success-foreground' : ''}
      ${variant === 'warning' ? 'bg-warning text-warning-foreground' : ''}
    `}
    {...props}
  >
    {children}
  </button>
);
```

## 🔧 Development Tools

### Typography Demo
Visit `/typography` to see all typography utilities in action.

### Loading States Demo
Visit `/loading-states` to see all loading states and animations.

### CSS Custom Properties
All typography and animation values are available as CSS custom properties.

### Tailwind Integration
All utilities are integrated with Tailwind CSS for immediate use.

## 📚 Resources

- **Typography Demo**: `/typography`
- **Loading States Demo**: `/loading-states`
- **CSS Variables**: `src/index.css`
- **Component Examples**: Throughout the codebase
- **Tailwind Config**: `tailwind.config.ts`

---

*These systems are designed to evolve with your application. New typography styles and animation patterns can be added while maintaining consistency and accessibility.*
