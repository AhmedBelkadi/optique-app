# About Page Components

This directory contains the components for the dynamic `/about` page that fetches content from the `AboutSection[]` database model.

## Components

### 1. `AboutHero.tsx`
- **Purpose**: Hero section with gradient background and animated title
- **Features**: 
  - Gradient background using theme colors (`from-primary to-secondary`)
  - Framer Motion animations for title and subtitle
  - Responsive typography
  - Uses `text-primary-foreground` for proper contrast

### 2. `AboutSections.tsx`
- **Purpose**: Renders dynamic `AboutSection[]` content with alternating layouts
- **Features**:
  - **Alternating Layout**: Text left/image right, then reversed
  - **Scroll Animations**: Uses `useInView` for scroll-triggered animations
  - **Background Transitions**: Alternating white and muted backgrounds
  - **Responsive Grid**: 2-column layout on large screens, stacked on mobile
  - **Image Handling**: Shows image if provided, placeholder if not
  - **Content Rendering**: Safely renders HTML content from database

### 3. `AboutCTA.tsx`
- **Purpose**: "Why book with us?" section with benefits and call-to-action
- **Features**:
  - **Benefits Grid**: 6 benefit cards with icons and descriptions
  - **Icon Integration**: Uses Lucide icons with color-coded backgrounds
  - **Hover Effects**: Cards lift and show shadow on hover
  - **CTA Section**: Prominent call-to-action with appointment and product links
  - **Scroll Animations**: Staggered animations for cards

### 4. `AboutSkeleton.tsx`
- **Purpose**: Loading skeleton for the about page
- **Features**:
  - **Hero Skeleton**: Placeholder for title and subtitle
  - **Content Skeletons**: 3 alternating section placeholders
  - **CTA Skeleton**: Placeholder for benefits grid and CTA section
  - **Responsive**: Matches the actual layout structure

## Database Integration

### `AboutSection` Model
```typescript
{
  id: string;
  title: string;
  content: string; // HTML content
  image: string | null; // Optional image URL
  order: number; // Display order
  createdAt: Date;
  updatedAt: Date;
}
```

### Data Flow
1. **Page Load**: `getAllAboutSections()` fetches data from database
2. **Content Rendering**: `AboutSections` component maps over sections
3. **Layout Logic**: Even/odd index determines layout direction
4. **Image Display**: Shows image if available, placeholder if not

## Animation Features

### Scroll Animations
- **Entry**: Fade in + slide up from bottom
- **Content**: Staggered slide in from left/right based on layout
- **Images**: Slide in from opposite direction of content
- **Benefits**: Staggered card animations with delays

### Hover Effects
- **Cards**: Lift effect with shadow enhancement
- **Buttons**: Color transitions and shadow changes
- **Images**: Subtle overlay gradients

## Theme Integration

### Color Usage
- **Primary Colors**: Uses `bg-primary`, `text-primary-foreground`
- **Secondary Colors**: Uses `bg-secondary`, `text-secondary-foreground`
- **Dynamic**: Colors automatically adapt to admin theme settings

### Background Patterns
- **Hero**: `from-primary to-secondary` gradient
- **Sections**: Alternating white and `bg-muted/30`
- **CTA**: Subtle `from-primary/5 to-secondary/5` gradient

## Responsive Design

### Breakpoints
- **Mobile**: Single column, stacked layout
- **Tablet**: 2-column benefits grid
- **Desktop**: Full 2-column section layout with alternating directions

### Spacing
- **Section Padding**: `py-20` for consistent vertical rhythm
- **Grid Gaps**: `gap-12` for content sections, `gap-8` for benefits
- **Container**: `max-w-7xl` with responsive padding

## Usage

The about page automatically:
1. Fetches `AboutSection[]` data from the database
2. Renders sections in the correct order
3. Applies alternating layouts
4. Shows loading skeleton while data loads
5. Handles empty states gracefully

## Admin Management

Content is managed through the admin CMS at `/admin/content/about` where admins can:
- Create/edit/delete about sections
- Upload images for each section
- Reorder sections
- Write rich HTML content
- Preview changes before publishing
