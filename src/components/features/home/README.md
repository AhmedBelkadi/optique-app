# Home Page Components

This directory contains the dynamic home page components for the Optique app.

## Components

### HeroSection
- **Purpose**: Full-width hero section with dynamic content
- **Features**:
  - Editable title, subtitle, and CTA buttons
  - Background image support with overlay
  - Framer Motion animations (fade-in, slide-up)
  - Parallax background effect
  - Responsive design

### WelcomeSection
- **Purpose**: Brand introduction section
- **Features**:
  - Editable welcome message
  - Card-based design with soft shadows
  - Fade-in animation on scroll
  - Backdrop blur effect

### FeaturedProducts
- **Purpose**: Showcase featured products
- **Features**:
  - Grid layout with hover effects
  - "New" and "Popular" badges
  - Image hover scaling
  - Staggered animations
  - Product categories display
  - Price formatting

### TestimonialsSection
- **Purpose**: Display customer testimonials
- **Features**:
  - 5-star rating display
  - Quote icons and styling
  - Avatar support with fallback initials
  - Hover animations
  - Responsive grid layout

### FloatingCTA
- **Purpose**: Always-visible call-to-action
- **Features**:
  - Fixed positioning
  - Scroll-triggered appearance
  - Smooth animations
  - Mobile-friendly design

## Data Sources

- **HomeSection**: CMS content (title, subtitle, CTAs, intro message, background image)
- **FeaturedProducts**: Latest 6 products from database
- **FeaturedTestimonials**: Latest 3 active testimonials

## Animations

All components use Framer Motion for smooth, performant animations:
- Entry animations (fade-in, slide-up)
- Hover effects (scale, shadow changes)
- Scroll-triggered animations
- Staggered children animations

## Styling

- Uses CSS variables for consistent theming
- Responsive design with Tailwind CSS
- Luxurious spacing and typography
- Gradient backgrounds and subtle shadows
- Backdrop blur effects for modern glass morphism

## Performance

- Server-side data fetching
- Suspense boundaries for loading states
- Optimized image loading
- Lazy animations (only animate when in viewport)
